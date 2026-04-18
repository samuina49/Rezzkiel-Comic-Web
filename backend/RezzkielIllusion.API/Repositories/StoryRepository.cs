using Microsoft.EntityFrameworkCore;
using RezzkielIllusion.API.Data;
using RezzkielIllusion.API.Interfaces;
using RezzkielIllusion.API.Models;

namespace RezzkielIllusion.API.Repositories;

public class StoryRepository : IStoryRepository
{
    private readonly AppDbContext _context;

    public StoryRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Story>> GetAllPublishedAsync(string? searchTerm = null, string? category = null)
    {
        var query = _context.Stories.Where(s => s.IsPublished);

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            query = query.Where(s => s.Title.Contains(searchTerm) || s.Description.Contains(searchTerm));
        }

        if (!string.IsNullOrWhiteSpace(category) && !category.Equals("All", StringComparison.OrdinalIgnoreCase))
        {
            var categoryLower = category.Trim().ToLower();
            query = query.Where(s => s.Category.ToLower() == categoryLower);
        }

        return await query
            .OrderByDescending(s => s.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Story>> GetAllAdminAsync()
    {
        return await _context.Stories
            .OrderByDescending(s => s.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Story>> GetTrendingAsync(int count)
    {
        return await _context.Stories
            .Where(s => s.IsPublished)
            .OrderByDescending(s => s.ViewCount)
            .Take(count)
            .ToListAsync();
    }

    public async Task IncrementViewAsync(Guid id)
    {
        var story = await _context.Stories.FindAsync(id);
        if (story != null)
        {
            story.ViewCount++;
            await _context.SaveChangesAsync();
        }
    }

    public async Task<Story?> GetByIdAsync(Guid id)
    {
        return await _context.Stories
            .Include(s => s.Chapters.OrderBy(c => c.ChapterNumber))
            .FirstOrDefaultAsync(s => s.Id == id);
    }

    public async Task<Story> CreateAsync(Story story)
    {
        await _context.Stories.AddAsync(story);
        await _context.SaveChangesAsync();
        return story;
    }

    public async Task UpdateAsync(Story story)
    {
        _context.Stories.Update(story);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Story story)
    {
        _context.Stories.Remove(story);
        await _context.SaveChangesAsync();
    }
}
