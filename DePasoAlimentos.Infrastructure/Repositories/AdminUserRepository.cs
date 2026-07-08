using DePasoAlimentos.Application.Interfaces;
using DePasoAlimentos.Domain.Entities;
using DePasoAlimentos.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace DePasoAlimentos.Infrastructure.Repositories;

public class AdminUserRepository : IAdminUserRepository
{
    private readonly AppDbContext _context;

    public AdminUserRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<AdminUser?> GetByIdAsync(int id)
    {
        return await _context.AdminUsers.FirstOrDefaultAsync(
            adminUser => adminUser.Id == id
        );
    }

    public async Task<AdminUser?> GetByEmailAsync(string email)
    {
        return await _context.AdminUsers.FirstOrDefaultAsync(
            adminUser => adminUser.Email == email
        );
    }

    public async Task AddAsync(AdminUser adminUser)
    {
        await _context.AdminUsers.AddAsync(adminUser);
    }

    public void Update(AdminUser adminUser)
    {
        _context.AdminUsers.Update(adminUser);
    }

    public async Task<bool> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync() > 0;
    }
}
