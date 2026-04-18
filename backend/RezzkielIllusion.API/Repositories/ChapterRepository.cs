using Microsoft.EntityFrameworkCore;
using RezzkielIllusion.API.Data;
using RezzkielIllusion.API.Interfaces;
using RezzkielIllusion.API.Models;

namespace RezzkielIllusion.API.Repositories;

public class ChapterRepository : IChapterRepository
{
    private readonly AppDbContext _context;

    public ChapterRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Chapter>> GetChaptersByStoryIdAsync(Guid storyId)
    {
        return await _context.Chapters
            .Where(c => c.StoryId == storyId)
            .OrderBy(c => c.ChapterNumber)
            .ToListAsync();
    }

    public async Task<Chapter?> GetByIdAsync(Guid id)
    {
        return await _context.Chapters.FindAsync(id);
    }

    public async Task<Chapter?> GetByIdWithImagesAsync(Guid id)
    {
        return await _context.Chapters
            .Include(c => c.ChapterImages.OrderBy(ci => ci.PageNumber))
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<Chapter> CreateAsync(Chapter chapter)
    {
        await _context.Chapters.AddAsync(chapter);
        await _context.SaveChangesAsync();
        return chapter;
    }

    public async Task UpdateAsync(Chapter chapter)
    {
        _context.Chapters.Update(chapter);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Chapter chapter)
    {
        _context.Chapters.Remove(chapter);
        await _context.SaveChangesAsync();
    }

    public async Task AddImageAsync(ChapterImage image)
    {
        await _context.ChapterImages.AddAsync(image);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteImageAsync(ChapterImage image)
    {
        _context.ChapterImages.Remove(image);
        await _context.SaveChangesAsync();
    }
    
    public async Task<ChapterImage?> GetImageByIdAsync(Guid id)
    {
        return await _context.ChapterImages.FindAsync(id);
    }
}
