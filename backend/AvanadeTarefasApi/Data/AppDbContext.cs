using Microsoft.EntityFrameworkCore;
using AvanadeTarefasApi.Models;

namespace AvanadeTarefasApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().HasData(
                new User { Id = 1, Username = "teste", Password = "123" }
            );
        }

    }
}
