using DePasoAlimentos.Application.DTOs.FoodSuggestions;
using DePasoAlimentos.Application.Interfaces;
using DePasoAlimentos.Domain.Entities;

namespace DePasoAlimentos.Application.Services;

public class FoodSuggestionService : IFoodSuggestionService
{
    private readonly IFoodSuggestionRepository _foodSuggestionRepository;

    public FoodSuggestionService(IFoodSuggestionRepository foodSuggestionRepository)
    {
        _foodSuggestionRepository = foodSuggestionRepository;
    }

    public async Task<List<FoodSuggestionDto>> GetAllAsync()
    {
        var foodSuggestions = await _foodSuggestionRepository.GetAllPublishedAsync();

        return foodSuggestions.Select(MapToDto).ToList();
    }

    public async Task<List<FoodSuggestionDto>> GetAllForAdminAsync()
    {
        var foodSuggestions = await _foodSuggestionRepository.GetAllAsync();

        return foodSuggestions.Select(MapToDto).ToList();
    }

    public async Task<FoodSuggestionDto?> GetByIdAsync(int id)
    {
        var foodSuggestion = await _foodSuggestionRepository.GetByIdAsync(id);

        if (foodSuggestion is null || !foodSuggestion.IsPublished)
        {
            return null;
        }

        return MapToDto(foodSuggestion);
    }

    public async Task<FoodSuggestionDto> CreateAsync(CreateFoodSuggestionRequest request)
    {
        var foodSuggestion = new FoodSuggestion
        {
            Title = request.Title,
            Description = request.Description,
            ImageUrl = request.ImageUrl,
            IsPublished = true,
            CreatedAt = DateTime.UtcNow
        };

        await _foodSuggestionRepository.AddAsync(foodSuggestion);
        await _foodSuggestionRepository.SaveChangesAsync();

        return MapToDto(foodSuggestion);
    }

    public async Task<bool> UpdateAsync(int id, UpdateFoodSuggestionRequest request)
    {
        var foodSuggestion = await _foodSuggestionRepository.GetByIdAsync(id);

        if (foodSuggestion is null)
        {
            return false;
        }

        foodSuggestion.Title = request.Title;
        foodSuggestion.Description = request.Description;
        foodSuggestion.ImageUrl = request.ImageUrl;
        foodSuggestion.IsPublished = request.IsPublished;
        foodSuggestion.UpdatedAt = DateTime.UtcNow;

        _foodSuggestionRepository.Update(foodSuggestion);

        return await _foodSuggestionRepository.SaveChangesAsync();
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var foodSuggestion = await _foodSuggestionRepository.GetByIdAsync(id);

        if (foodSuggestion is null)
        {
            return false;
        }

        _foodSuggestionRepository.Delete(foodSuggestion);

        return await _foodSuggestionRepository.SaveChangesAsync();
    }

    public async Task<bool> PublishAsync(int id)
    {
        var foodSuggestion = await _foodSuggestionRepository.GetByIdAsync(id);

        if (foodSuggestion is null)
        {
            return false;
        }

        foodSuggestion.IsPublished = true;
        foodSuggestion.UpdatedAt = DateTime.UtcNow;

        _foodSuggestionRepository.Update(foodSuggestion);

        return await _foodSuggestionRepository.SaveChangesAsync();
    }

    public async Task<bool> UnpublishAsync(int id)
    {
        var foodSuggestion = await _foodSuggestionRepository.GetByIdAsync(id);

        if (foodSuggestion is null)
        {
            return false;
        }

        foodSuggestion.IsPublished = false;
        foodSuggestion.UpdatedAt = DateTime.UtcNow;

        _foodSuggestionRepository.Update(foodSuggestion);

        return await _foodSuggestionRepository.SaveChangesAsync();
    }

    private static FoodSuggestionDto MapToDto(FoodSuggestion foodSuggestion)
    {
        return new FoodSuggestionDto
        {
            Id = foodSuggestion.Id,
            Title = foodSuggestion.Title,
            Description = foodSuggestion.Description,
            ImageUrl = foodSuggestion.ImageUrl,
            IsPublished = foodSuggestion.IsPublished
        };
    }
}
