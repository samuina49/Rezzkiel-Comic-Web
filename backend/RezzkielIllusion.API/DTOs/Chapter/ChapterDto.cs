using System.ComponentModel.DataAnnotations;

namespace RezzkielIllusion.API.DTOs.Chapter;

public class CreateChapterDto
{
    [Required]
    public Guid StoryId { get; set; }

    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [Required]
    public int ChapterNumber { get; set; }

    public bool IsFree { get; set; } = false;
}

public class UpdateChapterDto
{
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [Required]
    public int ChapterNumber { get; set; }

    public bool IsFree { get; set; }
}

public class ChapterResponseDto
{
    public Guid Id { get; set; }
    public Guid StoryId { get; set; }
    public string Title { get; set; } = string.Empty;
    public int ChapterNumber { get; set; }
    public bool IsFree { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class ChapterImageDto
{
    public Guid Id { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public int PageNumber { get; set; }
}
