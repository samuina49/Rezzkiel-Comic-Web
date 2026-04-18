using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RezzkielIllusion.API.Models;

public class CharacterRelation
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid Character1Id { get; set; }

    [ForeignKey(nameof(Character1Id))]
    public Character Character1 { get; set; } = null!;

    [Required]
    public Guid Character2Id { get; set; }

    [ForeignKey(nameof(Character2Id))]
    public Character Character2 { get; set; } = null!;

    [Required]
    [MaxLength(100)]
    public string RelationType { get; set; } = string.Empty;

    [MaxLength(500)]
    public string Description { get; set; } = string.Empty;
}
