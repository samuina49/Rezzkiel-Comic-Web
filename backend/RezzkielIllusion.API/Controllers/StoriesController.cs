using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RezzkielIllusion.API.DTOs.Story;
using RezzkielIllusion.API.Interfaces;
using RezzkielIllusion.API.Models;

namespace RezzkielIllusion.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StoriesController : ControllerBase
{
    private readonly IStoryRepository _storyRepository;

    public StoriesController(IStoryRepository storyRepository)
    {
        _storyRepository = storyRepository;
    }

    /// <summary>
    /// Get all published stories (Public).
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<StoryResponseDto>>> GetAllPublished([FromQuery] string? search, [FromQuery] string? category)
    {
        var stories = await _storyRepository.GetAllPublishedAsync(search, category);
        return Ok(stories.Select(MapToResponse));
    }

    [HttpGet("trending")]
    public async Task<ActionResult<IEnumerable<StoryResponseDto>>> GetTrending([FromQuery] int count = 5)
    {
        var stories = await _storyRepository.GetTrendingAsync(count);
        return Ok(stories.Select(MapToResponse));
    }

    [HttpPost("{id}/view")]
    public async Task<IActionResult> IncrementView(Guid id)
    {
        await _storyRepository.IncrementViewAsync(id);
        return NoContent();
    }

    /// <summary>
    /// Get all stories regardless of publish status (Admin only).
    /// </summary>
    [Authorize(Roles = "Admin")]
    [HttpGet("admin")]
    public async Task<ActionResult<IEnumerable<StoryResponseDto>>> GetAllForAdmin()
    {
        var stories = await _storyRepository.GetAllAdminAsync();
        return Ok(stories.Select(MapToResponse));
    }

    /// <summary>
    /// Get a specific story by ID.
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<StoryResponseDto>> GetById(Guid id)
    {
        var story = await _storyRepository.GetByIdAsync(id);
        
        if (story == null) return NotFound();

        // If not admin and not published, return 404
        if (!story.IsPublished && !User.IsInRole("Admin"))
        {
            return NotFound();
        }

        return Ok(MapToResponse(story));
    }

    /// <summary>
    /// Create a new story (Admin only).
    /// </summary>
    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<StoryResponseDto>> Create(CreateStoryDto dto)
    {
        var story = new Story
        {
            Title = dto.Title,
            Description = dto.Description,
            CoverImageUrl = dto.CoverImageUrl,
            Price = dto.Price,
            IsPublished = dto.IsPublished,
            Category = dto.Category,
            CreatedAt = DateTime.UtcNow
        };

        var createdStory = await _storyRepository.CreateAsync(story);
        return CreatedAtAction(nameof(GetById), new { id = createdStory.Id }, MapToResponse(createdStory));
    }

    /// <summary>
    /// Update an existing story (Admin only).
    /// </summary>
    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, UpdateStoryDto dto)
    {
        var story = await _storyRepository.GetByIdAsync(id);
        if (story == null) return NotFound();

        story.Title = dto.Title;
        story.Description = dto.Description;
        story.CoverImageUrl = dto.CoverImageUrl;
        story.Price = dto.Price;
        story.IsPublished = dto.IsPublished;
        story.Category = dto.Category;

        await _storyRepository.UpdateAsync(story);
        return NoContent();
    }

    /// <summary>
    /// Delete a story (Admin only).
    /// </summary>
    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var story = await _storyRepository.GetByIdAsync(id);
        if (story == null) return NotFound();

        await _storyRepository.DeleteAsync(story);
        return NoContent();
    }

    private static StoryResponseDto MapToResponse(Story story)
    {
        return new StoryResponseDto
        {
            Id = story.Id,
            Title = story.Title,
            Description = story.Description,
            CoverImageUrl = story.CoverImageUrl,
            Price = story.Price,
            IsPublished = story.IsPublished,
            Category = story.Category,
            ViewCount = story.ViewCount,
            CreatedAt = story.CreatedAt
        };
    }
}
