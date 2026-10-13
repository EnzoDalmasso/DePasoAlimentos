using System.ComponentModel.DataAnnotations;
using Microsoft.Extensions.Configuration;

namespace DePasoAlimentos.Application.Validation;

// Solo acepta imagenes subidas a nuestro bucket de Supabase Storage,
// para que no se puedan cargar URLs arbitrarias en el catalogo.
[AttributeUsage(AttributeTargets.Property)]
public sealed class StorageImageUrlAttribute : ValidationAttribute
{
    protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
    {
        if (value is not string imageUrl || string.IsNullOrWhiteSpace(imageUrl))
        {
            return ValidationResult.Success;
        }

        if (!Uri.TryCreate(imageUrl, UriKind.Absolute, out var uri) || uri.Scheme != Uri.UriSchemeHttps)
        {
            return Fail(validationContext);
        }

        var configuration = validationContext.GetService(typeof(IConfiguration)) as IConfiguration;
        var storageUrl = configuration?["SupabaseStorage:Url"]?.TrimEnd('/');
        var bucket = configuration?["SupabaseStorage:Bucket"];

        if (string.IsNullOrWhiteSpace(storageUrl) || string.IsNullOrWhiteSpace(bucket))
        {
            return ValidationResult.Success;
        }

        var allowedPrefix = $"{storageUrl}/storage/v1/object/public/{bucket}/";

        return imageUrl.StartsWith(allowedPrefix, StringComparison.OrdinalIgnoreCase)
            ? ValidationResult.Success
            : Fail(validationContext);
    }

    private static ValidationResult Fail(ValidationContext validationContext)
    {
        return new ValidationResult(
            "La imagen debe subirse desde el panel de administracion.",
            [validationContext.MemberName ?? "ImageUrl"]
        );
    }
}
