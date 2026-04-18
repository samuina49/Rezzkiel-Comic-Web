using System.ComponentModel.DataAnnotations;

namespace RezzkielIllusion.API.DTOs.Character;

public class CreateCharacterDto
{
    [Required]
    public Guid StoryId { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    public string ShortLore { get; set; } = string.Empty;

    [MaxLength(5000)]
    public string DetailedLore { get; set; } = string.Empty;

    [MaxLength(500)]
    public string AvatarUrl { get; set; } = string.Empty;
}

public class UpdateCharacterDto
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    public string ShortLore { get; set; } = string.Empty;

    [MaxLength(5000)]
    public string DetailedLore { get; set; } = string.Empty;

    [MaxLength(500)]
    public string AvatarUrl { get; set; } = string.Empty;
}

public class CharacterResponseDto
{
    public Guid Id { get; set; }
    public Guid StoryId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string ShortLore { get; set; } = string.Empty;
    public string DetailedLore { get; set; } = string.Empty;
    public string AvatarUrl { get; set; } = string.Empty;
}

public class CreateRelationDto
{
    [Required]
    public Guid Character1Id { get; set; }

    [Required]
    public Guid Character2Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string RelationType { get; set; } = string.Empty;

    [MaxLength(500)]
    public string Description { get; set; } = string.Empty;
}

public class RelationResponseDto
{
    public Guid Id { get; set; }
    public Guid Character1Id { get; set; }
    public Guid Character2Id { get; set; }
    public string RelationType { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}

// Master graph object strictly formatting response logic for ReactFlow directly.
public class LoreGraphResponseDto
{
    public IEnumerable<CharacterResponseDto> Nodes { get; set; } = new List<CharacterResponseDto>();
    public IEnumerable<RelationResponseDto> Edges { get; set; } = new List<RelationResponseDto>();
}
