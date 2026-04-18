using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RezzkielIllusion.API.DTOs.Payment;
using RezzkielIllusion.API.Interfaces;
using RezzkielIllusion.API.Models;

namespace RezzkielIllusion.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PaymentsController : ControllerBase
{
    private readonly IPurchaseRepository _purchaseRepository;
    private readonly IStoryRepository _storyRepository;

    public PaymentsController(IPurchaseRepository purchaseRepository, IStoryRepository storyRepository)
    {
        _purchaseRepository = purchaseRepository;
        _storyRepository = storyRepository;
    }

    /// <summary>
    /// Simulate a purchase checkout for a story.
    /// </summary>
    [HttpPost("checkout")]
    public async Task<ActionResult<CheckoutResponseDto>> Checkout([FromBody] CheckoutRequestDto dto)
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId))
        {
            return Unauthorized(new { message = "Invalid token." });
        }

        var story = await _storyRepository.GetByIdAsync(dto.StoryId);
        if (story == null) return NotFound("Story not found");
        if (!story.IsPublished) return BadRequest("Story is not available for purchase.");

        // Check if already purchased
        var existingPurchase = await _purchaseRepository.GetPurchaseAsync(userId, dto.StoryId);
        if (existingPurchase != null)
        {
            return BadRequest("You already own this story.");
        }

        // Simulate payment success immediately for MVP
        var purchase = new Purchase
        {
            UserId = userId,
            StoryId = dto.StoryId,
            Status = "Success",
            PurchasedAt = DateTime.UtcNow
        };

        var saved = await _purchaseRepository.CreatePurchaseAsync(purchase);

        return Ok(new CheckoutResponseDto
        {
            PurchaseId = saved.Id,
            StoryId = saved.StoryId,
            Status = saved.Status,
            Message = "Payment successful. The story is now unlocked!"
        });
    }
}
