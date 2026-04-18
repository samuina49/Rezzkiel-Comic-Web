using RezzkielIllusion.API.Models;

namespace RezzkielIllusion.API.Interfaces;

public interface IPurchaseRepository
{
    Task<Purchase?> GetPurchaseAsync(Guid userId, Guid storyId);
    Task<Purchase> CreatePurchaseAsync(Purchase purchase);
    Task<IEnumerable<Purchase>> GetUserPurchasesAsync(Guid userId);
}
