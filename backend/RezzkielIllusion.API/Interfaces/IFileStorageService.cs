namespace RezzkielIllusion.API.Interfaces;

public interface IFileStorageService
{
    Task<string> SaveFileAsync(IFormFile file, string folderName);
    bool DeleteFile(string fileUrl);
}
