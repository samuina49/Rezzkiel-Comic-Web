using RezzkielIllusion.API.Models;

namespace RezzkielIllusion.API.Interfaces;

public interface ICommentRepository
{
    Task<IEnumerable<Comment>> GetCommentsByStoryAsync(Guid storyId);
    Task<IEnumerable<Comment>> GetCommentsByChapterAsync(Guid chapterId);
    Task<Comment> CreateCommentAsync(Comment comment);
    Task<Comment?> GetByIdAsync(Guid id);
    Task DeleteCommentAsync(Comment comment);
}
