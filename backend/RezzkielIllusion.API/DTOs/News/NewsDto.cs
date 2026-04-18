using RezzkielIllusion.API.DTOs.Auth;
using RezzkielIllusion.API.DTOs.Comment;

namespace RezzkielIllusion.API.DTOs.News;

public class NewsPostResponseDto
{
    public Guid Id { get; set; }
    public Guid CreatorId { get; set; }
    public UserResponseDto Creator { get; set; } = null!;
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public IEnumerable<CommentResponseDto> Comments { get; set; } = new List<CommentResponseDto>();
}

public class CreateNewsPostDto
{
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
}
