using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RezzkielIllusion.API.Interfaces;

namespace RezzkielIllusion.API.Controllers;

[ApiController]
[Route("api/upload")]
[Authorize]
public class UploadController : ControllerBase
{
    private readonly IFileStorageService _fileStorageService;

    public UploadController(IFileStorageService fileStorageService)
    {
        _fileStorageService = fileStorageService;
    }

    /// <summary>
    /// Upload a general image (Admin Only).
    /// </summary>
    [Authorize(Roles = "Admin")]
    [HttpPost("image")]
    public async Task<IActionResult> UploadImage(IFormFile file, [FromForm] string folderName = "general")
    {
        return await HandleUpload(file, folderName);
    }

    /// <summary>
    /// Upload a profile-related image (Any logged in user).
    /// </summary>
    [HttpPost("profile")]
    public async Task<IActionResult> UploadProfileImage(IFormFile file)
    {
        return await HandleUpload(file, "profiles");
    }

    private async Task<IActionResult> HandleUpload(IFormFile file, string folderName)
    {
        try
        {
            var url = await _fileStorageService.SaveFileAsync(file, folderName);
            return Ok(new { url });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "An error occurred while uploading the file." });
        }
    }
}
