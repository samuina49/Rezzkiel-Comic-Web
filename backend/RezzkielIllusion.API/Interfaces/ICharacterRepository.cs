using RezzkielIllusion.API.Models;

namespace RezzkielIllusion.API.Interfaces;

public interface ICharacterRepository
{
    Task<IEnumerable<Character>> GetCharactersByStoryAsync(Guid storyId);
    Task<Character?> GetCharacterByIdAsync(Guid id);
    Task<Character> CreateCharacterAsync(Character character);
    Task UpdateCharacterAsync(Character character);
    Task DeleteCharacterAsync(Character character);

    Task<IEnumerable<CharacterRelation>> GetRelationsByStoryAsync(Guid storyId);
    Task<CharacterRelation> CreateRelationAsync(CharacterRelation relation);
    Task DeleteRelationAsync(CharacterRelation relation);
    Task<CharacterRelation?> GetRelationByIdAsync(Guid id);
}
