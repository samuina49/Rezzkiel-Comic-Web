using RezzkielIllusion.API.Models;

namespace RezzkielIllusion.API.Interfaces;

public interface IHistoryRepository
{
    Task<IEnumerable<ReadingHistory>> GetUserHistoryAsync(Guid userId);
    Task UpsertHistoryAsync(Guid userId, Guid storyId, Guid chapterId);
}
