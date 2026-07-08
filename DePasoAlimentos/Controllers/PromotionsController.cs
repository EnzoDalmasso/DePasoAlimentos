using DePasoAlimentos.Application.DTOs.Promotions;
using DePasoAlimentos.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace DePasoAlimentos.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PromotionsController : ControllerBase
{
    private readonly IPromotionService _promotionService;

    public PromotionsController(IPromotionService promotionService)
    {
        _promotionService = promotionService;
    }

    [HttpGet]
    public async Task<ActionResult<List<PromotionDto>>> GetAll()
    {
        var promotions = await _promotionService.GetAllAsync();

        return Ok(promotions);
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("admin")]
    public async Task<ActionResult<List<PromotionDto>>> GetAllForAdmin()
    {
        var promotions = await _promotionService.GetAllForAdminAsync();

        return Ok(promotions);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<PromotionDto>> GetById(int id)
    {
        var promotion = await _promotionService.GetByIdAsync(id);

        if (promotion is null)
        {
            return NotFound();
        }

        return Ok(promotion);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<PromotionDto>> Create(CreatePromotionRequest request)
    {
        var promotion = await _promotionService.CreateAsync(request);

        return CreatedAtAction(nameof(GetById), new { id = promotion.Id }, promotion);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, UpdatePromotionRequest request)
    {
        var updated = await _promotionService.UpdateAsync(id, request);

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
        var deleted = await _promotionService.DeleteAsync(id);

        if (!deleted)
        {
            return NotFound();
        }

        return NoContent();
    }

    [Authorize(Roles = "Admin")]
    [HttpPatch("{id:int}/activate")]
    public async Task<IActionResult> Activate(int id)
    {
        var activated = await _promotionService.ActivateAsync(id);

        if (!activated)
        {
            return NotFound();
        }

        return NoContent();
    }

    [Authorize(Roles = "Admin")]
    [HttpPatch("{id:int}/deactivate")]
    public async Task<IActionResult> Deactivate(int id)
    {
        var deactivated = await _promotionService.DeactivateAsync(id);

        if (!deactivated)
        {
            return NotFound();
        }

        return NoContent();
    }
}