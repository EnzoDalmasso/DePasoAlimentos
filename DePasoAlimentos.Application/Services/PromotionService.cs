using DePasoAlimentos.Application.DTOs.Promotions;
using DePasoAlimentos.Application.Interfaces;
using DePasoAlimentos.Domain.Entities;

namespace DePasoAlimentos.Application.Services;

public class PromotionService : IPromotionService
{
    private readonly IPromotionRepository _promotionRepository;

    public PromotionService(IPromotionRepository promotionRepository)
    {
        _promotionRepository = promotionRepository;
    }

    public async Task<List<PromotionDto>> GetAllAsync()
    {
        var promotions = await _promotionRepository.GetAllActiveAsync();

        return promotions.Select(MapToDto).ToList();
    }

    public async Task<List<PromotionDto>> GetAllForAdminAsync()
    {
        var promotions = await _promotionRepository.GetAllAsync();

        return promotions.Select(MapToDto).ToList();
    }

    public async Task<PromotionDto?> GetByIdAsync(int id)
    {
        var promotion = await _promotionRepository.GetByIdAsync(id);

        if (promotion is null || !promotion.IsActive)
        {
            return null;
        }

        return MapToDto(promotion);
    }

    public async Task<PromotionDto> CreateAsync(CreatePromotionRequest request)
    {
        var promotion = new Promotion
        {
            Title = request.Title,
            Description = request.Description,
            PromoPrice = request.PromoPrice,
            ImageUrl = request.ImageUrl,
            StartsAt = request.StartsAt,
            EndsAt = request.EndsAt,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        await _promotionRepository.AddAsync(promotion);
        await _promotionRepository.SaveChangesAsync();

        return MapToDto(promotion);
    }

    public async Task<bool> UpdateAsync(int id, UpdatePromotionRequest request)
    {
        var promotion = await _promotionRepository.GetByIdAsync(id);

        if (promotion is null)
        {
            return false;
        }

        promotion.Title = request.Title;
        promotion.Description = request.Description;
        promotion.PromoPrice = request.PromoPrice;
        promotion.ImageUrl = request.ImageUrl;
        promotion.StartsAt = request.StartsAt;
        promotion.EndsAt = request.EndsAt;
        promotion.IsActive = request.IsActive;
        promotion.UpdatedAt = DateTime.UtcNow;

        _promotionRepository.Update(promotion);

        return await _promotionRepository.SaveChangesAsync();
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var promotion = await _promotionRepository.GetByIdAsync(id);

        if (promotion is null)
        {
            return false;
        }

        _promotionRepository.Delete(promotion);

        return await _promotionRepository.SaveChangesAsync();
    }

    public async Task<bool> ActivateAsync(int id)
    {
        var promotion = await _promotionRepository.GetByIdAsync(id);

        if (promotion is null)
        {
            return false;
        }

        promotion.IsActive = true;
        promotion.UpdatedAt = DateTime.UtcNow;

        _promotionRepository.Update(promotion);

        return await _promotionRepository.SaveChangesAsync();
    }

    public async Task<bool> DeactivateAsync(int id)
    {
        var promotion = await _promotionRepository.GetByIdAsync(id);

        if (promotion is null)
        {
            return false;
        }

        promotion.IsActive = false;
        promotion.UpdatedAt = DateTime.UtcNow;

        _promotionRepository.Update(promotion);

        return await _promotionRepository.SaveChangesAsync();
    }

    private static PromotionDto MapToDto(Promotion promotion)
    {
        return new PromotionDto
        {
            Id = promotion.Id,
            Title = promotion.Title,
            Description = promotion.Description,
            PromoPrice = promotion.PromoPrice,
            ImageUrl = promotion.ImageUrl,
            StartsAt = promotion.StartsAt,
            EndsAt = promotion.EndsAt,
            IsActive = promotion.IsActive
        };
    }
}