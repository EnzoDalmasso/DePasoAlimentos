namespace DePasoAlimentos.Application.DTOs.StoreHours;

public class BusinessHourDto
{
    public int Id { get; set; }

    public int DayOfWeek { get; set; }

    public string DayName { get; set; } = string.Empty;

    public bool IsOpen { get; set; }

    public string? OpenTime { get; set; }

    public string? CloseTime { get; set; }

    public string? SecondOpenTime { get; set; }

    public string? SecondCloseTime { get; set; }

    public string Notes { get; set; } = string.Empty;
}
