using DePasoAlimentos.Domain.Entities;

namespace DePasoAlimentos.Application.Interfaces;

public interface IAdminUserRepository
{
    Task<AdminUser?> GetByIdAsync(int id);

    Task<AdminUser?> GetByEmailAsync(string email);

    Task AddAsync(AdminUser adminUser);

    void Update(AdminUser adminUser);

    Task<bool> SaveChangesAsync();
}
