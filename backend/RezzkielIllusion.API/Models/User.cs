using System.ComponentModel.DataAnnotations;

namespace RezzkielIllusion.API.Models;

public class User
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [MaxLength(255)]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string PasswordHash { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string Role { get; set; } = "Reader"; // "Admin" or "Reader"

    [MaxLength(100)]
    public string DisplayName { get; set; } = string.Empty;

    [MaxLength(500)]
    public string AvatarUrl { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string Bio { get; set; } = string.Empty;

    [MaxLength(500)]
    public string BannerUrl { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public ICollection<Purchase> Purchases { get; set; } = new List<Purchase>();
    public ICollection<Comment> Comments { get; set; } = new List<Comment>();
    public ICollection<ReadingHistory> Histories { get; set; } = new List<ReadingHistory>();
}
