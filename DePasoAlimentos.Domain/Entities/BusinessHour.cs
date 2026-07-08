namespace DePasoAlimentos.Domain.Entities;

public class BusinessHour
{
    public int Id { get; set; }

    public int DayOfWeek { get; set; }

    public bool IsOpen { get; set; }

    public TimeOnly? OpenTime { get; set; }

    public TimeOnly? CloseTime { get; set; }

    public TimeOnly? SecondOpenTime { get; set; }

    public TimeOnly? SecondCloseTime { get; set; }

    public string Notes { get; set; } = string.Empty;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
