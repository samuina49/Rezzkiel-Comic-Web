using RezzkielIllusion.API.Models;

namespace RezzkielIllusion.API.Interfaces;

public interface IStoryRepository
{
    Task<IEnumerable<Story>> GetAllPublishedAsync(string? searchTerm = null, string? category = null);
    Task<IEnumerable<Story>> GetAllAdminAsync();
    Task<IEnumerable<Story>> GetTrendingAsync(int count);
    Task<Story?> GetByIdAsync(Guid id);
    Task<Story> CreateAsync(Story story);
    Task UpdateAsync(Story story);
    Task DeleteAsync(Story story);
    Task IncrementViewAsync(Guid id);
}
