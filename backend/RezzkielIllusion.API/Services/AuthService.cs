using RezzkielIllusion.API.DTOs.Auth;
using RezzkielIllusion.API.Interfaces;
using RezzkielIllusion.API.Models;

namespace RezzkielIllusion.API.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly ITokenService _tokenService;

    public AuthService(IUserRepository userRepository, ITokenService tokenService)
    {
        _userRepository = userRepository;
        _tokenService = tokenService;
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
    {
        // Check if email already exists
        if (await _userRepository.EmailExistsAsync(dto.Email))
        {
            throw new InvalidOperationException("An account with this email already exists.");
        }

        // Hash password
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

        // All registered users start as Reader.
        // Admin accounts are seeded or promoted manually.
        var role = "Reader";

        var user = new User
        {
            Email = dto.Email.ToLower().Trim(),
            PasswordHash = passwordHash,
            Role = role,
            CreatedAt = DateTime.UtcNow
        };

        await _userRepository.CreateAsync(user);

        // Generate JWT
        var token = _tokenService.GenerateToken(user);

        return new AuthResponseDto
        {
            Token = token,
            User = MapToUserResponse(user)
        };
    }

    public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
    {
        var user = await _userRepository.GetByEmailAsync(dto.Email);

        if (user == null)
        {
            throw new UnauthorizedAccessException("Invalid email or password.");
        }

        // Verify password
        if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
        {
            throw new UnauthorizedAccessException("Invalid email or password.");
        }

        // Generate JWT
        var token = _tokenService.GenerateToken(user);

        return new AuthResponseDto
        {
            Token = token,
            User = MapToUserResponse(user)
        };
    }

    public async Task<UserResponseDto> GetCurrentUserAsync(Guid userId)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null)
        {
            throw new UnauthorizedAccessException("User not found.");
        }
        return MapToUserResponse(user);
    }

    public async Task<UserResponseDto> UpdateProfileAsync(Guid userId, UpdateProfileDto dto)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null)
        {
            throw new UnauthorizedAccessException("User not found.");
        }

        if (dto.DisplayName != null) user.DisplayName = dto.DisplayName;
        if (dto.AvatarUrl != null) user.AvatarUrl = dto.AvatarUrl;
        if (dto.Bio != null) user.Bio = dto.Bio;
        if (dto.BannerUrl != null) user.BannerUrl = dto.BannerUrl;

        await _userRepository.UpdateAsync(user);

        return MapToUserResponse(user);
    }

    private static UserResponseDto MapToUserResponse(User user)
    {
        return new UserResponseDto
        {
            Id = user.Id,
            Email = user.Email,
            Role = user.Role,
            DisplayName = user.DisplayName,
            AvatarUrl = user.AvatarUrl,
            Bio = user.Bio,
            BannerUrl = user.BannerUrl,
            CreatedAt = user.CreatedAt
        };
    }
}
