namespace DePasoAlimentos.Application.DTOs.Promotions;

public class PromotionDto
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public decimal PromoPrice { get; set; }

    public string ImageUrl { get; set; } = string.Empty;

    public DateTime? StartsAt { get; set; }

    public DateTime? EndsAt { get; set; }

    public bool IsActive { get; set; }
}