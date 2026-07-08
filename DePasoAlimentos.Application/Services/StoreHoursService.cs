using System.Globalization;
using DePasoAlimentos.Application.DTOs.StoreHours;
using DePasoAlimentos.Application.Interfaces;
using DePasoAlimentos.Domain.Entities;

namespace DePasoAlimentos.Application.Services;

public class StoreHoursService : IStoreHoursService
{
    private static readonly string[] DayNames =
    [
        "Domingo",
        "Lunes",
        "Martes",
        "Miercoles",
        "Jueves",
        "Viernes",
        "Sabado"
    ];

    private readonly IStoreHoursRepository _storeHoursRepository;

    public StoreHoursService(IStoreHoursRepository storeHoursRepository)
    {
        _storeHoursRepository = storeHoursRepository;
    }

    public async Task<StoreHoursDto> GetAsync()
    {
        var businessHours = await _storeHoursRepository.GetBusinessHoursAsync();
        var specialDays = await _storeHoursRepository.GetSpecialDaysAsync();

        return new StoreHoursDto
        {
            WeeklyHours = businessHours.Select(MapBusinessHourToDto).ToList(),
            SpecialDays = specialDays.Select(MapSpecialDayToDto).ToList()
        };
    }

    public async Task<bool> UpdateBusinessHourAsync(int id, UpdateBusinessHourRequest request)
    {
        var businessHour = await _storeHoursRepository.GetBusinessHourByIdAsync(id);

        if (businessHour is null)
        {
            return false;
        }

        var timeRanges = BuildTimeRanges(
            request.IsOpen,
            request.OpenTime,
            request.CloseTime,
            request.SecondOpenTime,
            request.SecondCloseTime);

        businessHour.IsOpen = request.IsOpen;
        businessHour.OpenTime = timeRanges.OpenTime;
        businessHour.CloseTime = timeRanges.CloseTime;
        businessHour.SecondOpenTime = timeRanges.SecondOpenTime;
        businessHour.SecondCloseTime = timeRanges.SecondCloseTime;
        businessHour.Notes = request.Notes.Trim();
        businessHour.UpdatedAt = DateTime.UtcNow;

        _storeHoursRepository.UpdateBusinessHour(businessHour);

        await _storeHoursRepository.SaveChangesAsync();

        return true;
    }

    public async Task<SpecialBusinessDayDto> CreateSpecialDayAsync(CreateSpecialBusinessDayRequest request)
    {
        var date = ParseDate(request.Date);
        var existingSpecialDay = await _storeHoursRepository.GetSpecialDayByDateAsync(date);

        if (existingSpecialDay is not null)
        {
            throw new ArgumentException("Ya existe un dia especial cargado para esa fecha.");
        }

        var timeRanges = BuildTimeRanges(
            request.IsOpen,
            request.OpenTime,
            request.CloseTime,
            request.SecondOpenTime,
            request.SecondCloseTime);

        var specialDay = new SpecialBusinessDay
        {
            Date = date,
            IsOpen = request.IsOpen,
            OpenTime = timeRanges.OpenTime,
            CloseTime = timeRanges.CloseTime,
            SecondOpenTime = timeRanges.SecondOpenTime,
            SecondCloseTime = timeRanges.SecondCloseTime,
            Reason = request.Reason.Trim(),
            CreatedAt = DateTime.UtcNow
        };

        await _storeHoursRepository.AddSpecialDayAsync(specialDay);
        await _storeHoursRepository.SaveChangesAsync();

        return MapSpecialDayToDto(specialDay);
    }

    public async Task<bool> UpdateSpecialDayAsync(int id, UpdateSpecialBusinessDayRequest request)
    {
        var specialDay = await _storeHoursRepository.GetSpecialDayByIdAsync(id);

        if (specialDay is null)
        {
            return false;
        }

        var date = ParseDate(request.Date);
        var existingSpecialDay = await _storeHoursRepository.GetSpecialDayByDateAsync(date);

        if (existingSpecialDay is not null && existingSpecialDay.Id != id)
        {
            throw new ArgumentException("Ya existe otro dia especial cargado para esa fecha.");
        }

        var timeRanges = BuildTimeRanges(
            request.IsOpen,
            request.OpenTime,
            request.CloseTime,
            request.SecondOpenTime,
            request.SecondCloseTime);

        specialDay.Date = date;
        specialDay.IsOpen = request.IsOpen;
        specialDay.OpenTime = timeRanges.OpenTime;
        specialDay.CloseTime = timeRanges.CloseTime;
        specialDay.SecondOpenTime = timeRanges.SecondOpenTime;
        specialDay.SecondCloseTime = timeRanges.SecondCloseTime;
        specialDay.Reason = request.Reason.Trim();
        specialDay.UpdatedAt = DateTime.UtcNow;

        _storeHoursRepository.UpdateSpecialDay(specialDay);

        await _storeHoursRepository.SaveChangesAsync();

        return true;
    }

    public async Task<bool> DeleteSpecialDayAsync(int id)
    {
        var specialDay = await _storeHoursRepository.GetSpecialDayByIdAsync(id);

        if (specialDay is null)
        {
            return false;
        }

        _storeHoursRepository.DeleteSpecialDay(specialDay);

        await _storeHoursRepository.SaveChangesAsync();

        return true;
    }

    private static (
        TimeOnly? OpenTime,
        TimeOnly? CloseTime,
        TimeOnly? SecondOpenTime,
        TimeOnly? SecondCloseTime
    ) BuildTimeRanges(
        bool isOpen,
        string? openTimeValue,
        string? closeTimeValue,
        string? secondOpenTimeValue,
        string? secondCloseTimeValue)
    {
        if (!isOpen)
        {
            return (null, null, null, null);
        }

        var openTime = ParseTime(openTimeValue, "hora de apertura");
        var closeTime = ParseTime(closeTimeValue, "hora de cierre");

        if (openTime >= closeTime)
        {
            throw new ArgumentException("La hora de apertura debe ser menor a la hora de cierre.");
        }

        var hasSecondOpenTime = !string.IsNullOrWhiteSpace(secondOpenTimeValue);
        var hasSecondCloseTime = !string.IsNullOrWhiteSpace(secondCloseTimeValue);

        if (!hasSecondOpenTime && !hasSecondCloseTime)
        {
            return (openTime, closeTime, null, null);
        }

        if (!hasSecondOpenTime || !hasSecondCloseTime)
        {
            throw new ArgumentException("El segundo turno debe tener apertura y cierre.");
        }

        var secondOpenTime = ParseTime(secondOpenTimeValue, "hora de apertura del segundo turno");
        var secondCloseTime = ParseTime(secondCloseTimeValue, "hora de cierre del segundo turno");

        if (secondOpenTime >= secondCloseTime)
        {
            throw new ArgumentException("La apertura del segundo turno debe ser menor al cierre.");
        }

        if (secondOpenTime < closeTime)
        {
            throw new ArgumentException("El segundo turno debe empezar despues del cierre del primer turno.");
        }

        return (openTime, closeTime, secondOpenTime, secondCloseTime);
    }

    private static TimeOnly ParseTime(string? value, string fieldName)
    {
        if (
            string.IsNullOrWhiteSpace(value) ||
            !TimeOnly.TryParseExact(value, "HH:mm", CultureInfo.InvariantCulture, DateTimeStyles.None, out var time)
        )
        {
            throw new ArgumentException($"La {fieldName} debe tener formato HH:mm.");
        }

        return time;
    }

    private static DateOnly ParseDate(string value)
    {
        if (!DateOnly.TryParseExact(value, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out var date))
        {
            throw new ArgumentException("La fecha debe tener formato yyyy-MM-dd.");
        }

        return date;
    }

    private static BusinessHourDto MapBusinessHourToDto(BusinessHour businessHour)
    {
        return new BusinessHourDto
        {
            Id = businessHour.Id,
            DayOfWeek = businessHour.DayOfWeek,
            DayName = GetDayName(businessHour.DayOfWeek),
            IsOpen = businessHour.IsOpen,
            OpenTime = FormatTime(businessHour.OpenTime),
            CloseTime = FormatTime(businessHour.CloseTime),
            SecondOpenTime = FormatTime(businessHour.SecondOpenTime),
            SecondCloseTime = FormatTime(businessHour.SecondCloseTime),
            Notes = businessHour.Notes
        };
    }

    private static SpecialBusinessDayDto MapSpecialDayToDto(SpecialBusinessDay specialDay)
    {
        return new SpecialBusinessDayDto
        {
            Id = specialDay.Id,
            Date = specialDay.Date.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture),
            IsOpen = specialDay.IsOpen,
            OpenTime = FormatTime(specialDay.OpenTime),
            CloseTime = FormatTime(specialDay.CloseTime),
            SecondOpenTime = FormatTime(specialDay.SecondOpenTime),
            SecondCloseTime = FormatTime(specialDay.SecondCloseTime),
            Reason = specialDay.Reason
        };
    }

    private static string GetDayName(int dayOfWeek)
    {
        return dayOfWeek >= 0 && dayOfWeek < DayNames.Length ? DayNames[dayOfWeek] : "Dia desconocido";
    }

    private static string? FormatTime(TimeOnly? time)
    {
        return time?.ToString("HH:mm", CultureInfo.InvariantCulture);
    }
}
