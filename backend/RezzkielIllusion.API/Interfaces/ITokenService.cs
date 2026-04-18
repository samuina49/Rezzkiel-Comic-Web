using RezzkielIllusion.API.Models;

namespace RezzkielIllusion.API.Interfaces;

public interface ITokenService
{
    string GenerateToken(User user);
}
