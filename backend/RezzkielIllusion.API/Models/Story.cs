using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RezzkielIllusion.API.Models;

public class Story
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(2000)]
    public string Description { get; set; } = string.Empty;

    [MaxLength(500)]
    public string CoverImageUrl { get; set; } = string.Empty;

    [Column(TypeName = "decimal(10,2)")]
    public decimal Price { get; set; }

    public bool IsPublished { get; set; }

    [MaxLength(50)]
    public string Category { get; set; } = "General";

    public int ViewCount { get; set; } = 0;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public ICollection<Chapter> Chapters { get; set; } = new List<Chapter>();
    public ICollection<Purchase> Purchases { get; set; } = new List<Purchase>();
    public ICollection<Character> Characters { get; set; } = new List<Character>();
}
