using DePasoAlimentos.Application.DTOs.FoodSuggestions;
using DePasoAlimentos.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace DePasoAlimentos.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FoodSuggestionsController : ControllerBase
{
    private readonly IFoodSuggestionService _foodSuggestionService;

    public FoodSuggestionsController(IFoodSuggestionService foodSuggestionService)
    {
        _foodSuggestionService = foodSuggestionService;
    }

    [HttpGet]
    public async Task<ActionResult<List<FoodSuggestionDto>>> GetAll()
    {
        var foodSuggestions = await _foodSuggestionService.GetAllAsync();

        return Ok(foodSuggestions);
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("admin")]
    public async Task<ActionResult<List<FoodSuggestionDto>>> GetAllForAdmin()
    {
        var foodSuggestions = await _foodSuggestionService.GetAllForAdminAsync();

        return Ok(foodSuggestions);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<FoodSuggestionDto>> GetById(int id)
    {
        var foodSuggestion = await _foodSuggestionService.GetByIdAsync(id);

        if (foodSuggestion is null)
        {
            return NotFound();
        }

        return Ok(foodSuggestion);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<FoodSuggestionDto>> Create(CreateFoodSuggestionRequest request)
    {
        var foodSuggestion = await _foodSuggestionService.CreateAsync(request);

        return CreatedAtAction(nameof(GetById), new { id = foodSuggestion.Id }, foodSuggestion);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, UpdateFoodSuggestionRequest request)
    {
        var updated = await _foodSuggestionService.UpdateAsync(id, request);

        if (!updated)
        {
            return NotFound();
        }

        return NoContent();
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _foodSuggestionService.DeleteAsync(id);

        if (!deleted)
        {
            return NotFound();
        }

        return NoContent();
    }

    [Authorize(Roles = "Admin")]
    [HttpPatch("{id:int}/publish")]
    public async Task<IActionResult> Publish(int id)
    {
        var published = await _foodSuggestionService.PublishAsync(id);

        if (!published)
        {
            return NotFound();
        }

        return NoContent();
    }

    [Authorize(Roles = "Admin")]
    [HttpPatch("{id:int}/unpublish")]
    public async Task<IActionResult> Unpublish(int id)
    {
        var unpublished = await _foodSuggestionService.UnpublishAsync(id);

        if (!unpublished)
        {
            return NotFound();
        }

        return NoContent();
    }
}