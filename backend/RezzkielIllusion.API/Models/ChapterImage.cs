using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RezzkielIllusion.API.Models;

public class ChapterImage
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid ChapterId { get; set; }

    [ForeignKey(nameof(ChapterId))]
    public Chapter Chapter { get; set; } = null!;

    [Required]
    [MaxLength(500)]
    public string ImageUrl { get; set; } = string.Empty;

    public int PageNumber { get; set; }
}
