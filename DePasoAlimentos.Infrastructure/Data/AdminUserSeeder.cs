using DePasoAlimentos.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace DePasoAlimentos.Infrastructure.Data;

public static class AdminUserSeeder
{
    public static async Task SeedAsync(AppDbContext context, IConfiguration configuration)
    {
        var email = configuration["SeedAdmin:Email"];
        var password = configuration["SeedAdmin:Password"];

        if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
        {
            return;
        }

        var adminAlreadyExists = await context.AdminUsers.AnyAsync(
            adminUser => adminUser.Email == email
        );

        if (adminAlreadyExists)
        {
            return;
        }

        var adminUser = new AdminUser
        {
            Email = email,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        var passwordHasher = new PasswordHasher<AdminUser>();

        adminUser.PasswordHash = passwordHasher.HashPassword(adminUser, password);

        await context.AdminUsers.AddAsync(adminUser);
        await context.SaveChangesAsync();
    }
}