using System.ComponentModel.DataAnnotations;

namespace RezzkielIllusion.API.DTOs.Profile;

public class ProfileUpdateDto
{
    [MaxLength(100)]
    public string DisplayName { get; set; } = string.Empty;

    [MaxLength(500)]
    public string AvatarUrl { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string Bio { get; set; } = string.Empty;

    [MaxLength(500)]
    public string BannerUrl { get; set; } = string.Empty;
}

public class ProfileResponseDto
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public string AvatarUrl { get; set; } = string.Empty;
    public string Bio { get; set; } = string.Empty;
    public string BannerUrl { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class ReadingHistoryDto
{
    public Guid StoryId { get; set; }
    public string StoryTitle { get; set; } = string.Empty;
    public string StoryCoverUrl { get; set; } = string.Empty;
    public Guid ChapterId { get; set; }
    public int ChapterNumber { get; set; }
    public string ChapterTitle { get; set; } = string.Empty;
    public DateTime LastReadAt { get; set; }
}
