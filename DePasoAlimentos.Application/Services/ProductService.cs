using DePasoAlimentos.Application.DTOs.Products;
using DePasoAlimentos.Application.Interfaces;
using DePasoAlimentos.Domain.Entities;

namespace DePasoAlimentos.Application.Services;

public class ProductService : IProductService
{
    private readonly IProductRepository _productRepository;

    public ProductService(IProductRepository productRepository)
    {
        _productRepository = productRepository;
    }

    //Este metodo obtiene todos los productos
    public async Task<List<ProductDto>> GetAllAsync()
    {
        var products = await _productRepository.GetAllActiveAsync();

        return products.Select(MapToDto).ToList();
    }

    public async Task<List<ProductDto>> GetAllForAdminAsync()
    {
        var products = await _productRepository.GetAllAsync();

        return products.Select(MapToDto).ToList();
    }

    //Este metodo obtiene un producto por su id
    public async Task<ProductDto?> GetByIdAsync(int id)
    {
        var product = await _productRepository.GetByIdAsync(id);

        if (product is null || !product.IsActive)
        {
            return null;
        }

        return MapToDto(product);
    }

    //Este metodo crea un producto nuevo
    public async Task<ProductDto> CreateAsync(CreateProductRequest request)
    {
        var product = new Product
        {
            Name = request.Name,
            Description = request.Description,
            Category = request.Category,
            Price = request.Price,
            ImageUrl = request.ImageUrl,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        await _productRepository.AddAsync(product);
        await _productRepository.SaveChangesAsync();

        return MapToDto(product);
    }


    //Este metodo actualiza un producto existente
    public async Task<bool> UpdateAsync(int id, UpdateProductRequest request)
    {
        var product = await _productRepository.GetByIdAsync(id);

        if (product is null)
        {
            return false;
        }

        product.Name = request.Name;
        product.Description = request.Description;
        product.Category = request.Category;
        product.Price = request.Price;
        product.ImageUrl = request.ImageUrl;
        product.IsActive = request.IsActive;
        product.UpdatedAt = DateTime.UtcNow;

        _productRepository.Update(product);

        return await _productRepository.SaveChangesAsync();
    }

    //Este metodo elimina un producto existente
    public async Task<bool> DeleteAsync(int id)
    {
        var product = await _productRepository.GetByIdAsync(id);

        if (product is null)
        {
            return false;
        }

        _productRepository.Delete(product);

        return await _productRepository.SaveChangesAsync();
    }

    public async Task<bool> ActivateAsync(int id)
    {
        var product = await _productRepository.GetByIdAsync(id);

        if (product is null)
        {
            return false;
        }

        product.IsActive = true;
        product.UpdatedAt = DateTime.UtcNow;

        _productRepository.Update(product);

        return await _productRepository.SaveChangesAsync();
    }

    public async Task<bool> DeactivateAsync(int id)
    {
        var product = await _productRepository.GetByIdAsync(id);

        if (product is null)
        {
            return false;
        }

        product.IsActive = false;
        product.UpdatedAt = DateTime.UtcNow;

        _productRepository.Update(product);

        return await _productRepository.SaveChangesAsync();
    }


    private static ProductDto MapToDto(Product product)
    {
        return new ProductDto
        {
            Id = product.Id,
            Name = product.Name,
            Description = product.Description,
            Category = product.Category,
            Price = product.Price,
            ImageUrl = product.ImageUrl,
            IsActive = product.IsActive
        };
    }
}
