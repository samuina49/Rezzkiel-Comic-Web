using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RezzkielIllusion.API.Models;

public class Purchase
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid UserId { get; set; }

    [ForeignKey(nameof(UserId))]
    public User User { get; set; } = null!;

    [Required]
    public Guid StoryId { get; set; }

    [ForeignKey(nameof(StoryId))]
    public Story Story { get; set; } = null!;

    [Required]
    [MaxLength(50)]
    public string Status { get; set; } = "Pending"; // "Pending" or "Success"

    public DateTime PurchasedAt { get; set; } = DateTime.UtcNow;
}
