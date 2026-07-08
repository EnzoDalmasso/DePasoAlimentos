using System.ComponentModel.DataAnnotations;

namespace DePasoAlimentos.Application.DTOs.StoreHours;

public class UpdateBusinessHourRequest
{
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
    public string Notes { get; set; } = string.Empty;
}
