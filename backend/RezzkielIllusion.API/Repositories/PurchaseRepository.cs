using Microsoft.EntityFrameworkCore;
using RezzkielIllusion.API.Data;
using RezzkielIllusion.API.Interfaces;
using RezzkielIllusion.API.Models;

namespace RezzkielIllusion.API.Repositories;

public class PurchaseRepository : IPurchaseRepository
{
    private readonly AppDbContext _context;

    public PurchaseRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Purchase?> GetPurchaseAsync(Guid userId, Guid storyId)
    {
        return await _context.Purchases
            .FirstOrDefaultAsync(p => p.UserId == userId && p.StoryId == storyId && p.Status == "Success");
    }

    public async Task<Purchase> CreatePurchaseAsync(Purchase purchase)
    {
        await _context.Purchases.AddAsync(purchase);
        await _context.SaveChangesAsync();
        return purchase;
    }

    public async Task<IEnumerable<Purchase>> GetUserPurchasesAsync(Guid userId)
    {
        return await _context.Purchases
            .Include(p => p.Story)
            .Where(p => p.UserId == userId && p.Status == "Success")
            .ToListAsync();
    }
}
