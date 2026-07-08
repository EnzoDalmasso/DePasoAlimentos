using DePasoAlimentos.Application.Interfaces;
using DePasoAlimentos.Domain.Entities;
using DePasoAlimentos.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace DePasoAlimentos.Infrastructure.Repositories;

public class FoodSuggestionRepository : IFoodSuggestionRepository
{
    private readonly AppDbContext _context;

    public FoodSuggestionRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<FoodSuggestion>> GetAllAsync()
    {
        return await _context.FoodSuggestions.OrderBy(foodSuggestion => foodSuggestion.Title).ToListAsync();
    }

    public async Task<List<FoodSuggestion>> GetAllPublishedAsync()
    {
        return await _context.FoodSuggestions.Where(foodSuggestion => foodSuggestion.IsPublished).OrderBy(foodSuggestion => foodSuggestion.Title).ToListAsync();
    }

    public async Task<FoodSuggestion?> GetByIdAsync(int id)
    {
        return await _context.FoodSuggestions.FirstOrDefaultAsync(foodSuggestion => foodSuggestion.Id == id);
    }

    public async Task AddAsync(FoodSuggestion foodSuggestion)
    {
        await _context.FoodSuggestions.AddAsync(foodSuggestion);
    }

    public void Update(FoodSuggestion foodSuggestion)
    {
        _context.FoodSuggestions.Update(foodSuggestion);
    }

    public void Delete(FoodSuggestion foodSuggestion)
    {
        _context.FoodSuggestions.Remove(foodSuggestion);
    }

    public async Task<bool> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync() > 0;
    }
}
