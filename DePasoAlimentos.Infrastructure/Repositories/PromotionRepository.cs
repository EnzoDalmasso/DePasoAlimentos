using DePasoAlimentos.Application.Interfaces;
using DePasoAlimentos.Domain.Entities;
using DePasoAlimentos.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace DePasoAlimentos.Infrastructure.Repositories;

public class PromotionRepository : IPromotionRepository
{
    private readonly AppDbContext _context;

    public PromotionRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Promotion>> GetAllAsync()
    {
        return await _context.Promotions.OrderBy(promotion => promotion.Title).ToListAsync();
    }

    public async Task<List<Promotion>> GetAllActiveAsync()
    {
        return await _context.Promotions.Where(promotion => promotion.IsActive).OrderBy(promotion => promotion.Title).ToListAsync();
    }

    public async Task<Promotion?> GetByIdAsync(int id)
    {
        return await _context.Promotions.FirstOrDefaultAsync(promotion => promotion.Id == id);
    }

    public async Task AddAsync(Promotion promotion)
    {
        await _context.Promotions.AddAsync(promotion);
    }

    public void Update(Promotion promotion)
    {
        _context.Promotions.Update(promotion);
    }

    public void Delete(Promotion promotion)
    {
        _context.Promotions.Remove(promotion);
    }

    public async Task<bool> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync() > 0;
    }
}