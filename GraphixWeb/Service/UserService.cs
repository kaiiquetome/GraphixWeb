using GraphixWeb.Contract;
using GraphixWeb.Helpers;
using GraphixWeb.Models;

namespace GraphixWeb.Service
{
    public class UserService : IUserService
    {
        private readonly string _baseMethod;
        public UserService()
        {
            _baseMethod = "user";
        }
        public async Task Create(User obj)
        {
            await ApiClient.PostAsync<bool>(_baseMethod, obj);
        }

        public async Task Delete(int id)
        {
            await ApiClient.DeleteAsync<bool>($"{_baseMethod}/{id}");
        }

        public async Task<User> Get(int id)
        {
            return await ApiClient.GetAsync<User>($"{_baseMethod}/{id}");
        }

        public async Task<List<User>> Get()
        {
            return await ApiClient.GetAsync<List<User>>($"{_baseMethod}");
        }

        public async Task Update(User obj)
        {
            await ApiClient.PutAsync<bool>(_baseMethod, obj);
        }
    }
}
