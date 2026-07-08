//namespace DePasoAlimentos.Application.DTOs.Products;
using System.ComponentModel.DataAnnotations;

namespace DePasoAlimentos.Application.DTOs.Products;

public class CreateProductRequest
{
    [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [StringLength(500)]
    public string Description { get; set; } = string.Empty;

    [Range(typeof(decimal), "0.01", "9999999.99", ParseLimitsInInvariantCulture = true)]
    public decimal Price { get; set; }

    [Required]
    [StringLength(500)]
    public string ImageUrl { get; set; } = string.Empty;
}