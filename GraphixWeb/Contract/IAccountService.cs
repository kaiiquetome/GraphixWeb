using GraphixWeb.Models;

namespace GraphixWeb.Contract
{
    public interface IAccountService
    {
        Task<List<Account>> Get();
        Task<Account> Get(int id);
        Task Update(Account os);
        Task Delete(int id);
        Task Create(Account os);
    }
}
