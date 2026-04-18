using RezzkielIllusion.API.Models;

namespace RezzkielIllusion.API.Interfaces;

public interface IChapterRepository
{
    Task<IEnumerable<Chapter>> GetChaptersByStoryIdAsync(Guid storyId);
    Task<Chapter?> GetByIdAsync(Guid id);
    Task<Chapter?> GetByIdWithImagesAsync(Guid id);
    Task<Chapter> CreateAsync(Chapter chapter);
    Task UpdateAsync(Chapter chapter);
    Task DeleteAsync(Chapter chapter);
    Task AddImageAsync(ChapterImage image);
    Task DeleteImageAsync(ChapterImage image);
    Task<ChapterImage?> GetImageByIdAsync(Guid id);
}
