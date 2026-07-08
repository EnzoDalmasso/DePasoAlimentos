using DePasoAlimentos.Application.DTOs.StoreHours;
using DePasoAlimentos.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DePasoAlimentos.Controllers;

[ApiController]
[Route("api/store-hours")]
public class StoreHoursController : ControllerBase
{
    private readonly IStoreHoursService _storeHoursService;

    public StoreHoursController(IStoreHoursService storeHoursService)
    {
        _storeHoursService = storeHoursService;
    }

    [HttpGet]
    public async Task<ActionResult<StoreHoursDto>> Get()
    {
        var storeHours = await _storeHoursService.GetAsync();

        return Ok(storeHours);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("weekly/{id:int}")]
    public async Task<IActionResult> UpdateBusinessHour(int id, UpdateBusinessHourRequest request)
    {
        try
        {
            var updated = await _storeHoursService.UpdateBusinessHourAsync(id, request);

            if (!updated)
            {
                return NotFound();
            }

            return NoContent();
        }
        catch (ArgumentException exception)
        {
            return BadRequest(new { message = exception.Message });
        }
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("special-days")]
    public async Task<ActionResult<SpecialBusinessDayDto>> CreateSpecialDay(CreateSpecialBusinessDayRequest request)
    {
        try
        {
            var specialDay = await _storeHoursService.CreateSpecialDayAsync(request);

            return CreatedAtAction(nameof(Get), new { id = specialDay.Id }, specialDay);
        }
        catch (ArgumentException exception)
        {
            return BadRequest(new { message = exception.Message });
        }
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("special-days/{id:int}")]
    public async Task<IActionResult> UpdateSpecialDay(int id, UpdateSpecialBusinessDayRequest request)
    {
        try
        {
            var updated = await _storeHoursService.UpdateSpecialDayAsync(id, request);

            if (!updated)
            {
                return NotFound();
            }

            return NoContent();
        }
        catch (ArgumentException exception)
        {
            return BadRequest(new { message = exception.Message });
        }
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("special-days/{id:int}")]
    public async Task<IActionResult> DeleteSpecialDay(int id)
    {
        var deleted = await _storeHoursService.DeleteSpecialDayAsync(id);

        if (!deleted)
        {
            return NotFound();
        }

        return NoContent();
    }
}
