using DePasoAlimentos.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace DePasoAlimentos.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options): base(options)
    {

    }

  
    public DbSet<Product> Products { get; set; }

    public DbSet<FoodSuggestion> FoodSuggestions { get; set; }

    public DbSet<Promotion> Promotions { get; set; }

    public DbSet<AdminUser> AdminUsers { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Product>().Property(product => product.Price).HasPrecision(18, 2);

        modelBuilder.Entity<Promotion>().Property(promotion => promotion.PromoPrice).HasPrecision(18, 2);

        modelBuilder.Entity<AdminUser>().HasIndex(adminUser => adminUser.Email).IsUnique();

        modelBuilder.Entity<AdminUser>().Property(adminUser => adminUser.Email).HasMaxLength(150);

        modelBuilder.Entity<AdminUser>().Property(adminUser => adminUser.PasswordHash).HasMaxLength(500);
    }
}
