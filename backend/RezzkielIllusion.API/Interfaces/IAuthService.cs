using RezzkielIllusion.API.DTOs.Auth;

namespace RezzkielIllusion.API.Interfaces;

public interface IAuthService
{
    Task<AuthResponseDto> RegisterAsync(RegisterDto dto);
    Task<AuthResponseDto> LoginAsync(LoginDto dto);
    Task<UserResponseDto> GetCurrentUserAsync(Guid userId);
    Task<UserResponseDto> UpdateProfileAsync(Guid userId, UpdateProfileDto dto);
}
