using DePasoAlimentos.Application.Interfaces;
using DePasoAlimentos.Domain.Entities;
using DePasoAlimentos.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace DePasoAlimentos.Infrastructure.Repositories;

public class ProductRepository : IProductRepository
{
    private readonly AppDbContext _context;

    public ProductRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Product>> GetAllAsync()
    {
        return await _context.Products.OrderBy(product => product.Name).ToListAsync();
    }

    public async Task<List<Product>> GetAllActiveAsync()
    {
        return await _context.Products.Where(product => product.IsActive).OrderBy(product => product.Name).ToListAsync();
    }

    public async Task<Product?> GetByIdAsync(int id)
    {
        return await _context.Products.FirstOrDefaultAsync(product => product.Id == id);
    }

    public async Task AddAsync(Product product)
    {
        await _context.Products.AddAsync(product);
    }

    public void Update(Product product)
    {
        _context.Products.Update(product);
    }

    public void Delete(Product product)
    {
        _context.Products.Remove(product);
    }

    public async Task<bool> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync() > 0;
    }
}