using Microsoft.EntityFrameworkCore;
using RezzkielIllusion.API.Data;
using RezzkielIllusion.API.Interfaces;
using RezzkielIllusion.API.Models;

namespace RezzkielIllusion.API.Repositories;

public class CharacterRepository : ICharacterRepository
{
    private readonly AppDbContext _context;

    public CharacterRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Character>> GetCharactersByStoryAsync(Guid storyId)
    {
        return await _context.Characters
            .Where(c => c.StoryId == storyId)
            .ToListAsync();
    }

    public async Task<Character?> GetCharacterByIdAsync(Guid id)
    {
        return await _context.Characters.FindAsync(id);
    }

    public async Task<Character> CreateCharacterAsync(Character character)
    {
        await _context.Characters.AddAsync(character);
        await _context.SaveChangesAsync();
        return character;
    }

    public async Task UpdateCharacterAsync(Character character)
    {
        _context.Characters.Update(character);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteCharacterAsync(Character character)
    {
        // First delete associated relations to avoid FK constraint errors due to Restrict setting
        var relations = await _context.CharacterRelations
            .Where(cr => cr.Character1Id == character.Id || cr.Character2Id == character.Id)
            .ToListAsync();
            
        if (relations.Any())
        {
            _context.CharacterRelations.RemoveRange(relations);
        }

        _context.Characters.Remove(character);
        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<CharacterRelation>> GetRelationsByStoryAsync(Guid storyId)
    {
        // Get all relations where Character1 belongs to the targeted StoryId
        return await _context.CharacterRelations
            .Include(cr => cr.Character1)
            .Where(cr => cr.Character1.StoryId == storyId)
            .ToListAsync();
    }

    public async Task<CharacterRelation> CreateRelationAsync(CharacterRelation relation)
    {
        await _context.CharacterRelations.AddAsync(relation);
        await _context.SaveChangesAsync();
        return relation;
    }

    public async Task DeleteRelationAsync(CharacterRelation relation)
    {
        _context.CharacterRelations.Remove(relation);
        await _context.SaveChangesAsync();
    }

    public async Task<CharacterRelation?> GetRelationByIdAsync(Guid id)
    {
        return await _context.CharacterRelations.FindAsync(id);
    }
}
