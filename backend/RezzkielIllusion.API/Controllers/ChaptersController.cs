using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RezzkielIllusion.API.DTOs.Chapter;
using RezzkielIllusion.API.Interfaces;
using RezzkielIllusion.API.Models;

namespace RezzkielIllusion.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ChaptersController : ControllerBase
{
    private readonly IChapterRepository _chapterRepository;
    private readonly IStoryRepository _storyRepository;
    private readonly IPurchaseRepository _purchaseRepository;
    private readonly IHistoryRepository _historyRepository;

    public ChaptersController(IChapterRepository chapterRepository, IStoryRepository storyRepository, IPurchaseRepository purchaseRepository, IHistoryRepository historyRepository)
    {
        _chapterRepository = chapterRepository;
        _storyRepository = storyRepository;
        _purchaseRepository = purchaseRepository;
        _historyRepository = historyRepository;
    }

    /// <summary>
    /// Get chapters for a specific story.
    /// </summary>
    [HttpGet("story/{storyId}")]
    public async Task<ActionResult<IEnumerable<ChapterResponseDto>>> GetByStory(Guid storyId)
    {
        var story = await _storyRepository.GetByIdAsync(storyId);
        if (story == null) return NotFound("Story not found");

        if (!story.IsPublished && !User.IsInRole("Admin"))
            return NotFound("Story not found");

        var chapters = await _chapterRepository.GetChaptersByStoryIdAsync(storyId);
        return Ok(chapters.Select(MapToResponse));
    }

    /// <summary>
    /// Get specific chapter details (with images if unlocked/admin).
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult> GetById(Guid id)
    {
        var chapter = await _chapterRepository.GetByIdWithImagesAsync(id);
        if (chapter == null) return NotFound();

        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        Guid? currentUserId = null;
        if (!string.IsNullOrEmpty(userIdString) && Guid.TryParse(userIdString, out var uid))
        {
            currentUserId = uid;
        }

        var isAdmin = User.IsInRole("Admin");
        
        if (!chapter.IsFree && !isAdmin)
        {
            if (currentUserId == null)
            {
                return Unauthorized("You must be logged in to read locked chapters.");
            }

            var purchase = await _purchaseRepository.GetPurchaseAsync(currentUserId.Value, chapter.StoryId);
            if (purchase == null)
            {
                return StatusCode(403, new { message = "PurchaseRequired", storyId = chapter.StoryId });
            }
        }

        // Track History if logged in
        if (currentUserId != null)
        {
            await _historyRepository.UpsertHistoryAsync(currentUserId.Value, chapter.StoryId, chapter.Id);
        }

        var response = new
        {
            chapter = MapToResponse(chapter),
            images = chapter.ChapterImages.Select(ci => new ChapterImageDto
            {
                Id = ci.Id,
                ImageUrl = ci.ImageUrl,
                PageNumber = ci.PageNumber
            })
        };

        return Ok(response);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<ChapterResponseDto>> Create(CreateChapterDto dto)
    {
        var chapter = new Chapter
        {
            StoryId = dto.StoryId,
            Title = dto.Title,
            ChapterNumber = dto.ChapterNumber,
            IsFree = dto.IsFree,
            CreatedAt = DateTime.UtcNow
        };

        var created = await _chapterRepository.CreateAsync(chapter);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, MapToResponse(created));
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, UpdateChapterDto dto)
    {
        var chapter = await _chapterRepository.GetByIdAsync(id);
        if (chapter == null) return NotFound();

        chapter.Title = dto.Title;
        chapter.ChapterNumber = dto.ChapterNumber;
        chapter.IsFree = dto.IsFree;

        await _chapterRepository.UpdateAsync(chapter);
        return NoContent();
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var chapter = await _chapterRepository.GetByIdAsync(id);
        if (chapter == null) return NotFound();

        await _chapterRepository.DeleteAsync(chapter);
        return NoContent();
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("{id}/images")]
    public async Task<IActionResult> AddImage(Guid id, [FromBody] ChapterImageDto dto)
    {
        var chapter = await _chapterRepository.GetByIdAsync(id);
        if (chapter == null) return NotFound();

        var image = new ChapterImage
        {
            ChapterId = id,
            ImageUrl = dto.ImageUrl,
            PageNumber = dto.PageNumber
        };

        await _chapterRepository.AddImageAsync(image);
        return Ok(new { image.Id, image.ImageUrl, image.PageNumber });
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("images/{imageId}")]
    public async Task<IActionResult> DeleteImage(Guid imageId)
    {
        var image = await _chapterRepository.GetImageByIdAsync(imageId);
        if (image == null) return NotFound();

        await _chapterRepository.DeleteImageAsync(image);
        return NoContent();
    }

    private static ChapterResponseDto MapToResponse(Chapter chapter)
    {
        return new ChapterResponseDto
        {
            Id = chapter.Id,
            StoryId = chapter.StoryId,
            Title = chapter.Title,
            ChapterNumber = chapter.ChapterNumber,
            IsFree = chapter.IsFree,
            CreatedAt = chapter.CreatedAt
        };
    }
}
