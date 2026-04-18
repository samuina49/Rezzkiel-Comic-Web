using Microsoft.EntityFrameworkCore;
using RezzkielIllusion.API.Data;
using RezzkielIllusion.API.Interfaces;
using RezzkielIllusion.API.Models;

namespace RezzkielIllusion.API.Repositories;

public class HistoryRepository : IHistoryRepository
{
    private readonly AppDbContext _context;

    public HistoryRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<ReadingHistory>> GetUserHistoryAsync(Guid userId)
    {
        return await _context.ReadingHistories
            .Include(rh => rh.Story)
            .Include(rh => rh.Chapter)
            .Where(rh => rh.UserId == userId)
            .OrderByDescending(rh => rh.LastReadAt)
            .ToListAsync();
    }

    public async Task UpsertHistoryAsync(Guid userId, Guid storyId, Guid chapterId)
    {
        var existing = await _context.ReadingHistories
            .FirstOrDefaultAsync(rh => rh.UserId == userId && rh.StoryId == storyId);

        if (existing == null)
        {
            var history = new ReadingHistory
            {
                UserId = userId,
                StoryId = storyId,
                ChapterId = chapterId,
                LastReadAt = DateTime.UtcNow
            };
            await _context.ReadingHistories.AddAsync(history);
        }
        else
        {
            existing.ChapterId = chapterId;
            existing.LastReadAt = DateTime.UtcNow;
            _context.ReadingHistories.Update(existing);
        }

        await _context.SaveChangesAsync();
    }
}
