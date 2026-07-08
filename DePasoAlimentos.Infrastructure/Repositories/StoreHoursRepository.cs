using DePasoAlimentos.Application.Interfaces;
using DePasoAlimentos.Domain.Entities;
using DePasoAlimentos.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace DePasoAlimentos.Infrastructure.Repositories;

public class StoreHoursRepository : IStoreHoursRepository
{
    private readonly AppDbContext _context;

    public StoreHoursRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<BusinessHour>> GetBusinessHoursAsync()
    {
        return await _context.BusinessHours.OrderBy(businessHour => businessHour.DayOfWeek).ToListAsync();
    }

    public async Task<BusinessHour?> GetBusinessHourByIdAsync(int id)
    {
        return await _context.BusinessHours.FirstOrDefaultAsync(businessHour => businessHour.Id == id);
    }

    public async Task<List<SpecialBusinessDay>> GetSpecialDaysAsync()
    {
        return await _context.SpecialBusinessDays.OrderBy(specialDay => specialDay.Date).ToListAsync();
    }

    public async Task<SpecialBusinessDay?> GetSpecialDayByIdAsync(int id)
    {
        return await _context.SpecialBusinessDays.FirstOrDefaultAsync(specialDay => specialDay.Id == id);
    }

    public async Task<SpecialBusinessDay?> GetSpecialDayByDateAsync(DateOnly date)
    {
        return await _context.SpecialBusinessDays.FirstOrDefaultAsync(specialDay => specialDay.Date == date);
    }

    public async Task AddSpecialDayAsync(SpecialBusinessDay specialBusinessDay)
    {
        await _context.SpecialBusinessDays.AddAsync(specialBusinessDay);
    }

    public void UpdateBusinessHour(BusinessHour businessHour)
    {
        _context.BusinessHours.Update(businessHour);
    }

    public void UpdateSpecialDay(SpecialBusinessDay specialBusinessDay)
    {
        _context.SpecialBusinessDays.Update(specialBusinessDay);
    }

    public void DeleteSpecialDay(SpecialBusinessDay specialBusinessDay)
    {
        _context.SpecialBusinessDays.Remove(specialBusinessDay);
    }

    public async Task<bool> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync() > 0;
    }
}
