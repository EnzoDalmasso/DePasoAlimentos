using DePasoAlimentos.Application.DTOs.Promotions;

namespace DePasoAlimentos.Application.Interfaces;

public interface IPromotionService
{
    Task<List<PromotionDto>> GetAllAsync();

    Task<List<PromotionDto>> GetAllForAdminAsync();

    Task<PromotionDto?> GetByIdAsync(int id);

    Task<PromotionDto> CreateAsync(CreatePromotionRequest request);

    Task<bool> UpdateAsync(int id, UpdatePromotionRequest request);

    Task<bool> DeleteAsync(int id);

    Task<bool> ActivateAsync(int id);

    Task<bool> DeactivateAsync(int id);
}