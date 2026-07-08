namespace DePasoAlimentos.Application.DTOs.StoreHours;

public class StoreHoursDto
{
    public List<BusinessHourDto> WeeklyHours { get; set; } = [];

    public List<SpecialBusinessDayDto> SpecialDays { get; set; } = [];
}
