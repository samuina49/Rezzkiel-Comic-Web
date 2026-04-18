using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RezzkielIllusion.API.Models;

public class Character
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid StoryId { get; set; }

    [ForeignKey(nameof(StoryId))]
    public Story Story { get; set; } = null!;

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    public string ShortLore { get; set; } = string.Empty;

    [MaxLength(5000)]
    public string DetailedLore { get; set; } = string.Empty;

    [MaxLength(500)]
    public string AvatarUrl { get; set; } = string.Empty;

    // Navigation properties
    public ICollection<CharacterRelation> RelationsAsCharacter1 { get; set; } = new List<CharacterRelation>();
    public ICollection<CharacterRelation> RelationsAsCharacter2 { get; set; } = new List<CharacterRelation>();
}
