using System.Security.Claims;
using DePasoAlimentos.Application.DTOs.Auth;
using DePasoAlimentos.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DePasoAlimentos.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<ActionResult<LoginResponse>> Login(LoginRequest request)
    {
        var loginResponse = await _authService.LoginAsync(request);

        if (loginResponse is null)
        {
            return Unauthorized("Email o contrasena incorrectos.");
        }

        return Ok(loginResponse);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("change-password")]
    public async Task<IActionResult> ChangePassword(ChangePasswordRequest request)
    {
        var adminUserIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!int.TryParse(adminUserIdValue, out var adminUserId))
        {
            return Unauthorized();
        }

        var passwordChanged = await _authService.ChangePasswordAsync(
            adminUserId,
            request
        );

        if (!passwordChanged)
        {
            return BadRequest("No pudimos cambiar la contrasena.");
        }

        return NoContent();
    }
}
