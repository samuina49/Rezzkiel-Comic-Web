using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RezzkielIllusion.API.DTOs.Character;
using RezzkielIllusion.API.Interfaces;
using RezzkielIllusion.API.Models;

namespace RezzkielIllusion.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CharactersController : ControllerBase
{
    private readonly ICharacterRepository _characterRepository;
    private readonly IStoryRepository _storyRepository;

    public CharactersController(ICharacterRepository characterRepository, IStoryRepository storyRepository)
    {
        _characterRepository = characterRepository;
        _storyRepository = storyRepository;
    }

    /// <summary>
    /// Gets the compiled Lore Graph (Nodes & Edges) for a specific Story.
    /// </summary>
    [HttpGet("graph/story/{storyId}")]
    public async Task<ActionResult<LoreGraphResponseDto>> GetLoreGraph(Guid storyId)
    {
        var story = await _storyRepository.GetByIdAsync(storyId);
        if (story == null) return NotFound("Story not found");

        if (!story.IsPublished && !User.IsInRole("Admin"))
            return NotFound("Story not found");

        var characters = await _characterRepository.GetCharactersByStoryAsync(storyId);
        var relations = await _characterRepository.GetRelationsByStoryAsync(storyId);

        var response = new LoreGraphResponseDto
        {
            Nodes = characters.Select(MapToCharacterResponse),
            Edges = relations.Select(MapToRelationResponse)
        };

        return Ok(response);
    }

    /// <summary>
    /// Admin: Create Character
    /// </summary>
    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<CharacterResponseDto>> CreateCharacter(CreateCharacterDto dto)
    {
        var character = new Character
        {
            StoryId = dto.StoryId,
            Name = dto.Name,
            ShortLore = dto.ShortLore,
            DetailedLore = dto.DetailedLore,
            AvatarUrl = dto.AvatarUrl
        };

        var created = await _characterRepository.CreateCharacterAsync(character);
        return Ok(MapToCharacterResponse(created));
    }

    /// <summary>
    /// Admin: Update Character
    /// </summary>
    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCharacter(Guid id, UpdateCharacterDto dto)
    {
        var character = await _characterRepository.GetCharacterByIdAsync(id);
        if (character == null) return NotFound();

        character.Name = dto.Name;
        character.ShortLore = dto.ShortLore;
        character.DetailedLore = dto.DetailedLore;
        character.AvatarUrl = dto.AvatarUrl;

        await _characterRepository.UpdateCharacterAsync(character);
        return NoContent();
    }

    /// <summary>
    /// Admin: Delete Character
    /// </summary>
    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCharacter(Guid id)
    {
        var character = await _characterRepository.GetCharacterByIdAsync(id);
        if (character == null) return NotFound();

        await _characterRepository.DeleteCharacterAsync(character);
        return NoContent();
    }

    /// <summary>
    /// Admin: Create Relation Edge
    /// </summary>
    [Authorize(Roles = "Admin")]
    [HttpPost("relations")]
    public async Task<ActionResult<RelationResponseDto>> CreateRelation(CreateRelationDto dto)
    {
        if (dto.Character1Id == dto.Character2Id)
            return BadRequest("Cannot create a relationship with itself.");

        var c1 = await _characterRepository.GetCharacterByIdAsync(dto.Character1Id);
        var c2 = await _characterRepository.GetCharacterByIdAsync(dto.Character2Id);
        if (c1 == null || c2 == null) return NotFound("One or both characters not found.");

        if (c1.StoryId != c2.StoryId)
            return BadRequest("Characters must belong to the same story network.");

        var relation = new CharacterRelation
        {
            Character1Id = dto.Character1Id,
            Character2Id = dto.Character2Id,
            RelationType = dto.RelationType,
            Description = dto.Description
        };

        var created = await _characterRepository.CreateRelationAsync(relation);
        return Ok(MapToRelationResponse(created));
    }

    /// <summary>
    /// Admin: Delete Relation Edge
    /// </summary>
    [Authorize(Roles = "Admin")]
    [HttpDelete("relations/{id}")]
    public async Task<IActionResult> DeleteRelation(Guid id)
    {
        var relation = await _characterRepository.GetRelationByIdAsync(id);
        if (relation == null) return NotFound();

        await _characterRepository.DeleteRelationAsync(relation);
        return NoContent();
    }

    private static CharacterResponseDto MapToCharacterResponse(Character c)
    {
        return new CharacterResponseDto
        {
            Id = c.Id,
            StoryId = c.StoryId,
            Name = c.Name,
            ShortLore = c.ShortLore,
            DetailedLore = c.DetailedLore,
            AvatarUrl = c.AvatarUrl
        };
    }

    private static RelationResponseDto MapToRelationResponse(CharacterRelation r)
    {
        return new RelationResponseDto
        {
            Id = r.Id,
            Character1Id = r.Character1Id,
            Character2Id = r.Character2Id,
            RelationType = r.RelationType,
            Description = r.Description
        };
    }
}
