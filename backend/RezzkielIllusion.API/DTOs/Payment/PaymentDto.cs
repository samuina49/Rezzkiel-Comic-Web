using System.ComponentModel.DataAnnotations;

namespace RezzkielIllusion.API.DTOs.Payment;

public class CheckoutRequestDto
{
    [Required]
    public Guid StoryId { get; set; }
}

public class CheckoutResponseDto
{
    public Guid PurchaseId { get; set; }
    public Guid StoryId { get; set; }
    public string Status { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
}
