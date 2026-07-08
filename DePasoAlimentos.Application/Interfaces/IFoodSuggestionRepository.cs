using DePasoAlimentos.Domain.Entities;

namespace DePasoAlimentos.Application.Interfaces;

public interface IFoodSuggestionRepository
{
    Task<List<FoodSuggestion>> GetAllAsync();

    Task<List<FoodSuggestion>> GetAllPublishedAsync();

    Task<FoodSuggestion?> GetByIdAsync(int id);

    Task AddAsync(FoodSuggestion foodSuggestion);

    void Update(FoodSuggestion foodSuggestion);

    void Delete(FoodSuggestion foodSuggestion);

    Task<bool> SaveChangesAsync();
}
