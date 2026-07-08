using DePasoAlimentos.Domain.Entities;

namespace DePasoAlimentos.Application.Interfaces;

public interface IPromotionRepository
{
    Task<List<Promotion>> GetAllAsync();

    Task<List<Promotion>> GetAllActiveAsync();

    Task<Promotion?> GetByIdAsync(int id);

    Task AddAsync(Promotion promotion);

    void Update(Promotion promotion);

    void Delete(Promotion promotion);

    Task<bool> SaveChangesAsync();

}
