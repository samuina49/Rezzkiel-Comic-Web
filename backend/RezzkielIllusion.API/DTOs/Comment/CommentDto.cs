using System.ComponentModel.DataAnnotations;

namespace RezzkielIllusion.API.DTOs.Comment;

public class CreateCommentDto
{
    public Guid? StoryId { get; set; }
    public Guid? ChapterId { get; set; }
    public Guid? ParentId { get; set; }

    [Required]
    [MaxLength(2000)]
    public string Content { get; set; } = string.Empty;
}

public class CommentResponseDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string UserDisplayName { get; set; } = string.Empty;
    public string UserAvatarUrl { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public Guid? ParentId { get; set; }
    public List<CommentResponseDto> Replies { get; set; } = new List<CommentResponseDto>();
    public DateTime CreatedAt { get; set; }
}
