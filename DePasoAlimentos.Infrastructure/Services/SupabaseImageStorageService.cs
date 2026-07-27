using System.Net.Http.Headers;
using DePasoAlimentos.Application.Interfaces;
using Microsoft.Extensions.Configuration;

namespace DePasoAlimentos.Infrastructure.Services;

public class SupabaseImageStorageService : IImageStorageService
{
    private const long MaxFileSizeInBytes = 5 * 1024 * 1024;

    private static readonly HashSet<string> AllowedFolders = new(StringComparer.OrdinalIgnoreCase)
    {
        "products",
        "promotions",
        "food-suggestions"
    };

    private static readonly Dictionary<string, string> AllowedContentTypes =
        new(StringComparer.OrdinalIgnoreCase)
        {
            ["image/jpeg"] = ".jpg",
            ["image/png"] = ".png"
        };

    private readonly HttpClient _httpClient;
    private readonly string _supabaseUrl;
    private readonly string _serviceRoleKey;
    private readonly string _bucket;

    public SupabaseImageStorageService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _supabaseUrl = GetRequiredConfiguration(configuration, "SupabaseStorage:Url")
            .TrimEnd('/');
        _serviceRoleKey = GetRequiredConfiguration(configuration, "SupabaseStorage:ServiceRoleKey");
        _bucket = GetRequiredConfiguration(configuration, "SupabaseStorage:Bucket");
    }

    public async Task<string> UploadAsync(
        Stream fileStream,
        string fileName,
        string contentType,
        long fileSize,
        string folder
    )
    {
        ValidateFile(fileName, contentType, fileSize);
        ValidateFolder(folder);
        await ValidateImageSignatureAsync(fileStream, contentType);

        var fileExtension = AllowedContentTypes[contentType];
        var storageFileName = $"{Guid.NewGuid():N}{fileExtension}";
        var filePath = $"{folder}/{storageFileName}";
        var uploadUrl = $"{_supabaseUrl}/storage/v1/object/{_bucket}/{filePath}";

        using var content = new StreamContent(fileStream);
        content.Headers.ContentType = new MediaTypeHeaderValue(contentType);

        using var request = new HttpRequestMessage(HttpMethod.Post, uploadUrl)
        {
            Content = content
        };

        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _serviceRoleKey);
        request.Headers.Add("apikey", _serviceRoleKey);
        request.Headers.Add("x-upsert", "false");

        using var response = await _httpClient.SendAsync(request);

        if (!response.IsSuccessStatusCode)
        {
            throw new InvalidOperationException(
                $"Supabase Storage rechazo la imagen. Status: {(int)response.StatusCode}."
            );
        }

        return $"{_supabaseUrl}/storage/v1/object/public/{_bucket}/{filePath}";
    }

    private static void ValidateFile(string fileName, string contentType, long fileSize)
    {
        if (fileSize == 0)
        {
            throw new ArgumentException("El archivo esta vacio.");
        }

        if (fileSize > MaxFileSizeInBytes)
        {
            throw new ArgumentException("La imagen no puede superar los 5 MB.");
        }

        if (!AllowedContentTypes.ContainsKey(contentType))
        {
            throw new ArgumentException("Solo se permiten imagenes JPG o PNG.");
        }

        var extension = Path.GetExtension(fileName);
        var isValidExtension = extension.Equals(".jpg", StringComparison.OrdinalIgnoreCase) ||
            extension.Equals(".jpeg", StringComparison.OrdinalIgnoreCase) ||
            extension.Equals(".png", StringComparison.OrdinalIgnoreCase);

        if (!isValidExtension)
        {
            throw new ArgumentException("Solo se permiten archivos .jpg, .jpeg o .png.");
        }
    }

    private static void ValidateFolder(string folder)
    {
        if (!AllowedFolders.Contains(folder))
        {
            throw new ArgumentException("La carpeta indicada no es valida.");
        }
    }

    private static async Task ValidateImageSignatureAsync(Stream fileStream, string contentType)
    {
        if (!fileStream.CanSeek)
        {
            throw new ArgumentException("No pudimos validar la imagen.");
        }

        var originalPosition = fileStream.Position;
        var buffer = new byte[8];
        var bytesRead = await fileStream.ReadAsync(buffer);

        fileStream.Position = originalPosition;

        var isJpeg =
            bytesRead >= 3 &&
            buffer[0] == 0xFF &&
            buffer[1] == 0xD8 &&
            buffer[2] == 0xFF;

        var isPng =
            bytesRead >= 8 &&
            buffer[0] == 0x89 &&
            buffer[1] == 0x50 &&
            buffer[2] == 0x4E &&
            buffer[3] == 0x47 &&
            buffer[4] == 0x0D &&
            buffer[5] == 0x0A &&
            buffer[6] == 0x1A &&
            buffer[7] == 0x0A;

        var signatureMatchesContentType =
            (contentType.Equals("image/jpeg", StringComparison.OrdinalIgnoreCase) && isJpeg) ||
            (contentType.Equals("image/png", StringComparison.OrdinalIgnoreCase) && isPng);

        if (!signatureMatchesContentType)
        {
            throw new ArgumentException("El archivo no parece ser una imagen JPG o PNG valida.");
        }
    }

    private static string GetRequiredConfiguration(
        IConfiguration configuration,
        string key
    )
    {
        var value = configuration[key];

        if (string.IsNullOrWhiteSpace(value))
        {
            throw new InvalidOperationException($"Falta configurar {key}.");
        }

        return value;
    }
}
