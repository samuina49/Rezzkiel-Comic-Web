using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RezzkielIllusion.API.DTOs.Comment;
using RezzkielIllusion.API.Interfaces;
using RezzkielIllusion.API.Models;

namespace RezzkielIllusion.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CommentsController : ControllerBase
{
    private readonly ICommentRepository _commentRepository;
    private readonly IUserRepository _userRepository;

    public CommentsController(ICommentRepository commentRepository, IUserRepository userRepository)
    {
        _commentRepository = commentRepository;
        _userRepository = userRepository;
    }

    [HttpGet("story/{storyId}")]
    public async Task<ActionResult<IEnumerable<CommentResponseDto>>> GetByStory(Guid storyId)
    {
        var comments = await _commentRepository.GetCommentsByStoryAsync(storyId);
        return Ok(comments.Select(MapToResponse));
    }

    [HttpGet("chapter/{chapterId}")]
    public async Task<ActionResult<IEnumerable<CommentResponseDto>>> GetByChapter(Guid chapterId)
    {
        var comments = await _commentRepository.GetCommentsByChapterAsync(chapterId);
        return Ok(comments.Select(MapToResponse));
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<CommentResponseDto>> Create(CreateCommentDto dto)
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId))
            return Unauthorized();

        var comment = new Comment
        {
            UserId = userId,
            StoryId = dto.StoryId,
            ChapterId = dto.ChapterId,
            ParentId = dto.ParentId,
            Content = dto.Content
        };

        var created = await _commentRepository.CreateCommentAsync(comment);
        
        // Load the full comment with user for response
        var result = await _commentRepository.GetByIdAsync(created.Id);

        return Ok(MapToResponse(result!));
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var comment = await _commentRepository.GetByIdAsync(id);
        if (comment == null) return NotFound();

        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId))
            return Unauthorized();

        // Only owner or admin can delete
        if (comment.UserId != userId && !User.IsInRole("Admin"))
            return Forbid();

        await _commentRepository.DeleteCommentAsync(comment);
        return NoContent();
    }

    private static CommentResponseDto MapToResponse(Comment c)
    {
        return new CommentResponseDto
        {
            Id = c.Id,
            UserId = c.UserId,
            UserDisplayName = c.User == null ? "Unknown" : (string.IsNullOrEmpty(c.User.DisplayName) ? c.User.Email.Split('@')[0] : c.User.DisplayName),
            UserAvatarUrl = c.User?.AvatarUrl ?? "",
            Content = c.Content,
            ParentId = c.ParentId,
            CreatedAt = c.CreatedAt,
            Replies = c.Replies?.Select(MapToResponse).ToList() ?? new List<CommentResponseDto>()
        };
    }
}
