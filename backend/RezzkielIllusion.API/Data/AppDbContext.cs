using Microsoft.EntityFrameworkCore;
using RezzkielIllusion.API.Models;

namespace RezzkielIllusion.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Story> Stories => Set<Story>();
    public DbSet<Chapter> Chapters => Set<Chapter>();
    public DbSet<ChapterImage> ChapterImages => Set<ChapterImage>();
    public DbSet<Purchase> Purchases => Set<Purchase>();
    public DbSet<Character> Characters => Set<Character>();
    public DbSet<CharacterRelation> CharacterRelations => Set<CharacterRelation>();
    public DbSet<Comment> Comments => Set<Comment>();
    public DbSet<ReadingHistory> ReadingHistories => Set<ReadingHistory>();
    public DbSet<NewsPost> NewsPosts => Set<NewsPost>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User — unique email
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(u => u.Email).IsUnique();
        });

        // Story
        modelBuilder.Entity<Story>(entity =>
        {
            entity.HasIndex(s => s.Title);
        });

        // Chapter — unique chapter number per story
        modelBuilder.Entity<Chapter>(entity =>
        {
            entity.HasIndex(c => new { c.StoryId, c.ChapterNumber }).IsUnique();

            entity.HasOne(c => c.Story)
                  .WithMany(s => s.Chapters)
                  .HasForeignKey(c => c.StoryId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // ChapterImage — ordered pages per chapter
        modelBuilder.Entity<ChapterImage>(entity =>
        {
            entity.HasIndex(ci => new { ci.ChapterId, ci.PageNumber }).IsUnique();

            entity.HasOne(ci => ci.Chapter)
                  .WithMany(c => c.ChapterImages)
                  .HasForeignKey(ci => ci.ChapterId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Purchase — one purchase per user per story
        modelBuilder.Entity<Purchase>(entity =>
        {
            entity.HasIndex(p => new { p.UserId, p.StoryId }).IsUnique();

            entity.HasOne(p => p.User)
                  .WithMany(u => u.Purchases)
                  .HasForeignKey(p => p.UserId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(p => p.Story)
                  .WithMany(s => s.Purchases)
                  .HasForeignKey(p => p.StoryId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Character
        modelBuilder.Entity<Character>(entity =>
        {
            entity.HasOne(c => c.Story)
                  .WithMany(s => s.Characters)
                  .HasForeignKey(c => c.StoryId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // CharacterRelation — self-referencing many-to-many via Character
        modelBuilder.Entity<CharacterRelation>(entity =>
        {
            entity.HasOne(cr => cr.Character1)
                  .WithMany(c => c.RelationsAsCharacter1)
                  .HasForeignKey(cr => cr.Character1Id)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(cr => cr.Character2)
                  .WithMany(c => c.RelationsAsCharacter2)
                  .HasForeignKey(cr => cr.Character2Id)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // Comment
        modelBuilder.Entity<Comment>(entity =>
        {
            entity.HasOne(c => c.User)
                  .WithMany(u => u.Comments)
                  .HasForeignKey(c => c.UserId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(c => c.Story)
                  .WithMany()
                  .HasForeignKey(c => c.StoryId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(c => c.Chapter)
                  .WithMany()
                  .HasForeignKey(c => c.ChapterId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(c => c.NewsPost)
                  .WithMany(n => n.Comments)
                  .HasForeignKey(c => c.NewsPostId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // NewsPost
        modelBuilder.Entity<NewsPost>(entity =>
        {
            entity.HasOne(n => n.Creator)
                  .WithMany()
                  .HasForeignKey(n => n.CreatorId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // ReadingHistory — track one latest chapter per story per user
        modelBuilder.Entity<ReadingHistory>(entity =>
        {
            entity.HasIndex(rh => new { rh.UserId, rh.StoryId }).IsUnique();

            entity.HasOne(rh => rh.User)
                  .WithMany(u => u.Histories)
                  .HasForeignKey(rh => rh.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
