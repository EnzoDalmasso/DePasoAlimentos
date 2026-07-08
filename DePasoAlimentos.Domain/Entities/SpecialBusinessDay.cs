namespace DePasoAlimentos.Domain.Entities;

public class SpecialBusinessDay
{
    public int Id { get; set; }

    public DateOnly Date { get; set; }

    public bool IsOpen { get; set; }

    public TimeOnly? OpenTime { get; set; }

    public TimeOnly? CloseTime { get; set; }

    public TimeOnly? SecondOpenTime { get; set; }

    public TimeOnly? SecondCloseTime { get; set; }

    public string Reason { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }
}
