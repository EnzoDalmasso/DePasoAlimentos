using System.ComponentModel.DataAnnotations;
using DePasoAlimentos.Application.Validation;

namespace DePasoAlimentos.Application.DTOs.Promotions;

public class UpdatePromotionRequest : IValidatableObject
{
    [Required]
    [StringLength(100)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [StringLength(500)]
    public string Description { get; set; } = string.Empty;

    [Range(typeof(decimal), "0.01", "9999999.99", ParseLimitsInInvariantCulture = true)]
    public decimal PromoPrice { get; set; }

    [Required]
    [StringLength(500)]
    [StorageImageUrl]
    public string ImageUrl { get; set; } = string.Empty;

    public DateTime? StartsAt { get; set; }

    public DateTime? EndsAt { get; set; }

    public bool IsActive { get; set; }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (StartsAt.HasValue && EndsAt.HasValue && EndsAt < StartsAt)
        {
            yield return new ValidationResult(
                "La fecha de fin no puede ser anterior a la de inicio.",
                [nameof(EndsAt)]
            );
        }
    }
}
