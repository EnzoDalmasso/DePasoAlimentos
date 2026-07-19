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
            var responseBody = await response.Content.ReadAsStringAsync();

            throw new InvalidOperationException(
                $"Supabase Storage rechazo la imagen. Status: {(int)response.StatusCode}. Response: {responseBody}"
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
