using DePasoAlimentos.Application.DTOs.Products;

namespace DePasoAlimentos.Application.Interfaces;

public interface IProductService
{
    Task<List<ProductDto>> GetAllAsync();

    Task<List<ProductDto>> GetAllForAdminAsync();

    Task<ProductDto?> GetByIdAsync(int id);

    Task<ProductDto> CreateAsync(CreateProductRequest request);

    Task<bool> UpdateAsync(int id, UpdateProductRequest request);

    Task<bool> DeleteAsync(int id);

    Task<bool> ActivateAsync(int id);

    Task<bool> DeactivateAsync(int id);
}