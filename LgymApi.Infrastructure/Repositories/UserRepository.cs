using LgymApi.Application.Models;
using LgymApi.Application.Repositories;
using LgymApi.Domain.Entities;
using LgymApi.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace LgymApi.Infrastructure.Repositories;

public sealed class UserRepository : IUserRepository
{
    private readonly AppDbContext _dbContext;

    public UserRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public Task<User?> FindByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return _dbContext.Users.FirstOrDefaultAsync(u => u.Id == id, cancellationToken);
    }

    public Task<User?> FindByNameAsync(string name, CancellationToken cancellationToken = default)
    {
        return _dbContext.Users.FirstOrDefaultAsync(u => u.Name == name, cancellationToken);
    }

    public Task<User?> FindByNameOrEmailAsync(string name, string email, CancellationToken cancellationToken = default)
    {
        return _dbContext.Users.FirstOrDefaultAsync(u => u.Name == name || u.Email == email, cancellationToken);
    }

    public async Task<List<UserRankingEntry>> GetRankingAsync(CancellationToken cancellationToken = default)
    {
        var users = await _dbContext.Users
            .Where(u => !u.IsTester && !u.IsDeleted && u.IsVisibleInRanking)
            .ToListAsync(cancellationToken);

        var result = new List<UserRankingEntry>();
        foreach (var user in users)
        {
            var elo = await _dbContext.EloRegistries
                .Where(e => e.UserId == user.Id)
                .OrderByDescending(e => e.Date)
                .Select(e => (int?)e.Elo)
                .FirstOrDefaultAsync(cancellationToken) ?? 1000;

            result.Add(new UserRankingEntry(user, elo));
        }

        return result.OrderByDescending(entry => entry.Elo).ToList();
    }

    public async Task AddAsync(User user, CancellationToken cancellationToken = default)
    {
        await _dbContext.Users.AddAsync(user, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(User user, CancellationToken cancellationToken = default)
    {
        _dbContext.Users.Update(user);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}
