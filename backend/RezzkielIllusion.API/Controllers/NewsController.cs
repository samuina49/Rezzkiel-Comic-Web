using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RezzkielIllusion.API.Data;
using RezzkielIllusion.API.DTOs.Auth;
using RezzkielIllusion.API.DTOs.Comment;
using RezzkielIllusion.API.DTOs.News;
using RezzkielIllusion.API.Models;
using System.Security.Claims;

namespace RezzkielIllusion.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NewsController : ControllerBase
{
    private readonly AppDbContext _context;

    public NewsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<NewsPostResponseDto>>> GetAll()
    {
        var posts = await _context.NewsPosts
            .Include(n => n.Creator)
            .OrderByDescending(n => n.CreatedAt)
            .ToListAsync();

        return Ok(posts.Select(MapPost));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<NewsPostResponseDto>> GetById(Guid id)
    {
        var post = await _context.NewsPosts
            .Include(n => n.Creator)
            .Include(n => n.Comments.OrderByDescending(c => c.CreatedAt))
                .ThenInclude(c => c.User)
            .Include(n => n.Comments)
                .ThenInclude(c => c.Replies)
            .FirstOrDefaultAsync(n => n.Id == id);

        if (post == null) return NotFound();

        return Ok(MapPost(post));
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<NewsPostResponseDto>> Create(CreateNewsPostDto dto)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !Guid.TryParse(userIdClaim, out var creatorId))
        {
            return Unauthorized();
        }

        var post = new NewsPost
        {
            CreatorId = creatorId,
            Title = dto.Title,
            Content = dto.Content,
            ImageUrl = dto.ImageUrl,
            CreatedAt = DateTime.UtcNow
        };

        _context.NewsPosts.Add(post);
        await _context.SaveChangesAsync();

        // Reload for creator info
        await _context.Entry(post).Reference(n => n.Creator).LoadAsync();

        return CreatedAtAction(nameof(GetById), new { id = post.Id }, MapPost(post));
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var post = await _context.NewsPosts.FindAsync(id);
        if (post == null) return NotFound();

        _context.NewsPosts.Remove(post);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    private static NewsPostResponseDto MapPost(NewsPost n)
    {
        return new NewsPostResponseDto
        {
            Id = n.Id,
            CreatorId = n.CreatorId,
            Creator = new UserResponseDto
            {
                Id = n.Creator.Id,
                DisplayName = n.Creator.DisplayName,
                AvatarUrl = n.Creator.AvatarUrl,
                Role = n.Creator.Role,
                Email = n.Creator.Email,
                CreatedAt = n.Creator.CreatedAt
            },
            Title = n.Title,
            Content = n.Content,
            ImageUrl = n.ImageUrl,
            CreatedAt = n.CreatedAt,
            Comments = n.Comments?.Select(c => new CommentResponseDto
            {
                Id = c.Id,
                UserId = c.UserId,
                UserDisplayName = c.User.DisplayName ?? c.User.Email,
                UserAvatarUrl = c.User.AvatarUrl,
                Content = c.Content,
                CreatedAt = c.CreatedAt,
                Replies = c.Replies?.Select(r => new CommentResponseDto 
                { 
                    Id = r.Id, 
                    Content = r.Content 
                }).ToList() ?? new List<CommentResponseDto>()
            }) ?? new List<CommentResponseDto>()
        };
    }
}
