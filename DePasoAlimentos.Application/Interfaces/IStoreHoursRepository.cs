using DePasoAlimentos.Domain.Entities;

namespace DePasoAlimentos.Application.Interfaces;

public interface IStoreHoursRepository
{
    Task<List<BusinessHour>> GetBusinessHoursAsync();

    Task<BusinessHour?> GetBusinessHourByIdAsync(int id);

    Task<List<SpecialBusinessDay>> GetSpecialDaysAsync();

    Task<SpecialBusinessDay?> GetSpecialDayByIdAsync(int id);

    Task<SpecialBusinessDay?> GetSpecialDayByDateAsync(DateOnly date);

    Task AddSpecialDayAsync(SpecialBusinessDay specialBusinessDay);

    void UpdateBusinessHour(BusinessHour businessHour);

    void UpdateSpecialDay(SpecialBusinessDay specialBusinessDay);

    void DeleteSpecialDay(SpecialBusinessDay specialBusinessDay);

    Task<bool> SaveChangesAsync();
}
