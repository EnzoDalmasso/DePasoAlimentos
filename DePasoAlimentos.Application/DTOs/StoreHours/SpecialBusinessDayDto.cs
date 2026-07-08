namespace DePasoAlimentos.Application.DTOs.StoreHours;

public class SpecialBusinessDayDto
{
    public int Id { get; set; }

    public string Date { get; set; } = string.Empty;

    public bool IsOpen { get; set; }

    public string? OpenTime { get; set; }

    public string? CloseTime { get; set; }

    public string? SecondOpenTime { get; set; }

    public string? SecondCloseTime { get; set; }

    public string Reason { get; set; } = string.Empty;
}
