using GraphixWeb.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace GraphixWeb.Contract
{
    public interface IUserService
    {
        Task<List<User>> Get();
        Task<User> Get(int id);
        Task Create(User user);
        Task Update(User user);
        Task Delete(int id);
    }
}
