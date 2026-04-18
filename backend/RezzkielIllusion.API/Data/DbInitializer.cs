using BCrypt.Net;
using Microsoft.EntityFrameworkCore;
using RezzkielIllusion.API.Models;

namespace RezzkielIllusion.API.Data;

public static class DbInitializer
{
    public static async Task SeedAsync(AppDbContext context)
    {
        // Ensure database is created and migrations applied
        await context.Database.MigrateAsync();

        // Check if any admin exists
        if (!await context.Users.AnyAsync(u => u.Role == "Admin"))
        {
            var admin = new User
            {
                Email = "admin@rezzkiel.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
                Role = "Admin",
                DisplayName = "Master Admin",
                CreatedAt = DateTime.UtcNow
            };

            await context.Users.AddAsync(admin);
            await context.SaveChangesAsync();
        }
    }
}
