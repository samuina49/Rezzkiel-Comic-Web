using System.ComponentModel.DataAnnotations;

namespace RezzkielIllusion.API.DTOs.Story;

public class CreateStoryDto
{
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(2000)]
    public string Description { get; set; } = string.Empty;

    [MaxLength(500)]
    public string CoverImageUrl { get; set; } = string.Empty;

    [Range(0, 10000)]
    public decimal Price { get; set; }

    public bool IsPublished { get; set; } = false;

    [MaxLength(50)]
    public string Category { get; set; } = "General";
}

public class UpdateStoryDto : CreateStoryDto
{
}

public class StoryResponseDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string CoverImageUrl { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public bool IsPublished { get; set; }
    public string Category { get; set; } = string.Empty;
    public int ViewCount { get; set; }
    public DateTime CreatedAt { get; set; }
}
