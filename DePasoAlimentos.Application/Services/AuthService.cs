using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using DePasoAlimentos.Application.DTOs.Auth;
using DePasoAlimentos.Application.Interfaces;
using DePasoAlimentos.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace DePasoAlimentos.Application.Services;

public class AuthService : IAuthService
{
    private readonly IAdminUserRepository _adminUserRepository;
    private readonly IConfiguration _configuration;
    private readonly PasswordHasher<AdminUser> _passwordHasher;

    public AuthService(
        IAdminUserRepository adminUserRepository,
        IConfiguration configuration)
    {
        _adminUserRepository = adminUserRepository;
        _configuration = configuration;
        _passwordHasher = new PasswordHasher<AdminUser>();
    }

    public async Task<LoginResponse?> LoginAsync(LoginRequest request)
    {
        var adminUser = await _adminUserRepository.GetByEmailAsync(request.Email);

        if (adminUser is null || !adminUser.IsActive)
        {
            return null;
        }

        var passwordVerificationResult = _passwordHasher.VerifyHashedPassword(
            adminUser,
            adminUser.PasswordHash,
            request.Password
        );

        if (passwordVerificationResult == PasswordVerificationResult.Failed)
        {
            return null;
        }

        adminUser.LastLoginAt = DateTime.UtcNow;

        _adminUserRepository.Update(adminUser);
        await _adminUserRepository.SaveChangesAsync();

        return new LoginResponse
        {
            Email = adminUser.Email,
            Token = GenerateJwtToken(adminUser)
        };
    }

    public async Task<bool> ChangePasswordAsync(int adminUserId, ChangePasswordRequest request)
    {
        var adminUser = await _adminUserRepository.GetByIdAsync(adminUserId);

        if (adminUser is null || !adminUser.IsActive)
        {
            return false;
        }

        var passwordVerificationResult = _passwordHasher.VerifyHashedPassword(
            adminUser,
            adminUser.PasswordHash,
            request.CurrentPassword
        );

        if (passwordVerificationResult == PasswordVerificationResult.Failed)
        {
            return false;
        }

        adminUser.PasswordHash = _passwordHasher.HashPassword(
            adminUser,
            request.NewPassword
        );

        _adminUserRepository.Update(adminUser);

        return await _adminUserRepository.SaveChangesAsync();
    }

    private string GenerateJwtToken(AdminUser adminUser)
    {
        var jwtKey = _configuration["Jwt:Key"];
        var jwtIssuer = _configuration["Jwt:Issuer"];
        var jwtAudience = _configuration["Jwt:Audience"];

        if (
            string.IsNullOrWhiteSpace(jwtKey) ||
            string.IsNullOrWhiteSpace(jwtIssuer) ||
            string.IsNullOrWhiteSpace(jwtAudience)
        )
        {
            throw new InvalidOperationException("La configuracion JWT no esta completa.");
        }

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, adminUser.Id.ToString()),
            new Claim(ClaimTypes.Email, adminUser.Email),
            new Claim(ClaimTypes.Role, "Admin")
        };

        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: jwtIssuer,
            audience: jwtAudience,
            claims: claims,
            expires: DateTime.UtcNow.AddHours(8),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
