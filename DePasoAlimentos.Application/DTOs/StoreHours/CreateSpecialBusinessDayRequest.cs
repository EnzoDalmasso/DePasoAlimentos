using System.ComponentModel.DataAnnotations;

namespace DePasoAlimentos.Application.DTOs.StoreHours;

public class CreateSpecialBusinessDayRequest
{
    [Required]
    [StringLength(10, MinimumLength = 10)]
    public string Date { get; set; } = string.Empty;

    public bool IsOpen { get; set; }

    [StringLength(5)]
    public string? OpenTime { get; set; }

    [StringLength(5)]
    public string? CloseTime { get; set; }

    [StringLength(5)]
    public string? SecondOpenTime { get; set; }

    [StringLength(5)]
    public string? SecondCloseTime { get; set; }

    [StringLength(200)]
    public string Reason { get; set; } = string.Empty;
}
