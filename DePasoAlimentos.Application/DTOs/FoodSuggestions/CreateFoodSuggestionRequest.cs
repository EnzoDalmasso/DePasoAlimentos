using System.ComponentModel.DataAnnotations;
using DePasoAlimentos.Application.Validation;

namespace DePasoAlimentos.Application.DTOs.FoodSuggestions;

public class CreateFoodSuggestionRequest
{
    [Required]
    [StringLength(100)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [StringLength(1000)]
    public string Description { get; set; } = string.Empty;

    [Required]
    [StringLength(500)]
    [StorageImageUrl]
    public string ImageUrl { get; set; } = string.Empty;
}