using DePasoAlimentos.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace DePasoAlimentos.Infrastructure.Data;

public static class StoreHoursSeeder
{
    public static async Task SeedAsync(AppDbContext context)
    {
        var existingDays = await context.BusinessHours.Select(businessHour => businessHour.DayOfWeek).ToListAsync();
        var missingDays = Enumerable.Range(0, 7).Where(day => !existingDays.Contains(day)).ToList();

        if (missingDays.Count == 0)
        {
            return;
        }

        foreach (var day in missingDays)
        {
            var isSunday = day == 0;

            context.BusinessHours.Add(new BusinessHour
            {
                DayOfWeek = day,
                IsOpen = !isSunday,
                OpenTime = isSunday ? null : new TimeOnly(9, 30),
                CloseTime = isSunday ? null : new TimeOnly(13, 0),
                SecondOpenTime = isSunday ? null : new TimeOnly(18, 0),
                SecondCloseTime = isSunday ? null : new TimeOnly(21, 0),
                Notes = isSunday ? "Cerrado" : string.Empty,
                UpdatedAt = DateTime.UtcNow
            });
        }

        await context.SaveChangesAsync();
    }
}
