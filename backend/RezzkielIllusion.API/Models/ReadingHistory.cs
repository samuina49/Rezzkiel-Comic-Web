using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RezzkielIllusion.API.Models;

public class ReadingHistory
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
    public Guid ChapterId { get; set; }

    [ForeignKey(nameof(ChapterId))]
    public Chapter Chapter { get; set; } = null!;

    public DateTime LastReadAt { get; set; } = DateTime.UtcNow;
}
