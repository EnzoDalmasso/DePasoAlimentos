using DePasoAlimentos.Application.DTOs.FoodSuggestions;

namespace DePasoAlimentos.Application.Interfaces;

public interface IFoodSuggestionService
{
    Task<List<FoodSuggestionDto>> GetAllAsync();

    Task<List<FoodSuggestionDto>> GetAllForAdminAsync();

    Task<FoodSuggestionDto?> GetByIdAsync(int id);

    Task<FoodSuggestionDto> CreateAsync(CreateFoodSuggestionRequest request);

    Task<bool> UpdateAsync(int id, UpdateFoodSuggestionRequest request);

    Task<bool> DeleteAsync(int id);

    Task<bool> PublishAsync(int id);

    Task<bool> UnpublishAsync(int id);
            
}