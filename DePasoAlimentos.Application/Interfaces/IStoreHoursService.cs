using DePasoAlimentos.Application.DTOs.StoreHours;

namespace DePasoAlimentos.Application.Interfaces;

public interface IStoreHoursService
{
    Task<StoreHoursDto> GetAsync();

    Task<bool> UpdateBusinessHourAsync(int id, UpdateBusinessHourRequest request);

    Task<SpecialBusinessDayDto> CreateSpecialDayAsync(CreateSpecialBusinessDayRequest request);

    Task<bool> UpdateSpecialDayAsync(int id, UpdateSpecialBusinessDayRequest request);

    Task<bool> DeleteSpecialDayAsync(int id);
}
