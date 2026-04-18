using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RezzkielIllusion.API.Models;

public class Comment
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid UserId { get; set; }

    [ForeignKey(nameof(UserId))]
    public User User { get; set; } = null!;

    // A comment can belong to either a Story OR a Chapter
    public Guid? StoryId { get; set; }
    
    [ForeignKey(nameof(StoryId))]
    public Story? Story { get; set; }

    public Guid? ChapterId { get; set; }

    [ForeignKey(nameof(ChapterId))]
    public Chapter? Chapter { get; set; }

    public Guid? NewsPostId { get; set; }

    [ForeignKey(nameof(NewsPostId))]
    public NewsPost? NewsPost { get; set; }

    [Required]
    [MaxLength(2000)]
    public string Content { get; set; } = string.Empty;

    public Guid? ParentId { get; set; }
    
    [ForeignKey(nameof(ParentId))]
    public Comment? Parent { get; set; }

    public ICollection<Comment> Replies { get; set; } = new List<Comment>();

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
