using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RezzkielIllusion.API.DTOs.Profile;
using RezzkielIllusion.API.Interfaces;

namespace RezzkielIllusion.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProfilesController : ControllerBase
{
    private readonly IUserRepository _userRepository;
    private readonly IHistoryRepository _historyRepository;

    public ProfilesController(IUserRepository userRepository, IHistoryRepository historyRepository)
    {
        _userRepository = userRepository;
        _historyRepository = historyRepository;
    }

    [HttpGet]
    public async Task<ActionResult<ProfileResponseDto>> Get()
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId))
            return Unauthorized();

        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null) return NotFound();

        return Ok(new ProfileResponseDto
        {
            Id = user.Id,
            Email = user.Email,
            DisplayName = user.DisplayName,
            AvatarUrl = user.AvatarUrl,
            Bio = user.Bio,
            BannerUrl = user.BannerUrl,
            CreatedAt = user.CreatedAt
        });
    }

    [HttpPut]
    public async Task<IActionResult> Update(ProfileUpdateDto dto)
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId))
            return Unauthorized();

        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null) return NotFound();

        user.DisplayName = dto.DisplayName;
        user.AvatarUrl = dto.AvatarUrl;
        user.Bio = dto.Bio;
        user.BannerUrl = dto.BannerUrl;

        await _userRepository.UpdateAsync(user);
        return NoContent();
    }

    [HttpGet("history")]
    public async Task<ActionResult<IEnumerable<ReadingHistoryDto>>> GetHistory()
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId))
            return Unauthorized();

        var history = await _historyRepository.GetUserHistoryAsync(userId);
        return Ok(history.Select(h => new ReadingHistoryDto
        {
            StoryId = h.StoryId,
            StoryTitle = h.Story.Title,
            StoryCoverUrl = h.Story.CoverImageUrl,
            ChapterId = h.ChapterId,
            ChapterNumber = h.Chapter.ChapterNumber,
            ChapterTitle = h.Chapter.Title,
            LastReadAt = h.LastReadAt
        }));
    }
}
