using System.ComponentModel.DataAnnotations;

namespace RezzkielIllusion.API.DTOs.Auth;

public class UpdateProfileDto
{
    [MaxLength(100)]
    public string? DisplayName { get; set; }

    [MaxLength(500)]
    public string? AvatarUrl { get; set; }

    [MaxLength(1000)]
    public string? Bio { get; set; }

    [MaxLength(500)]
    public string? BannerUrl { get; set; }
}
