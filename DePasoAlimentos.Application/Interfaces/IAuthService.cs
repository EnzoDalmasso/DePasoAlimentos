using DePasoAlimentos.Application.DTOs.Auth;

namespace DePasoAlimentos.Application.Interfaces;

public interface IAuthService
{
    Task<LoginResponse?> LoginAsync(LoginRequest request);

    Task<bool> ChangePasswordAsync(int adminUserId, ChangePasswordRequest request);
}
