using GraphixWeb.Contract;
using GraphixWeb.DTOs.Security;
using GraphixWeb.Helpers;
using GraphixWeb.Models;

namespace GraphixWeb.Service
{
    public class UserService : IUserService
    {
        private readonly string _baseMethod;
        private readonly ApiClient _apiClient;
        public UserService(ApiClient apiClient)
        {
            _baseMethod = "user";
            _apiClient = apiClient;
        }
        public async Task Create(User obj)
        {
            await _apiClient.PostAsync<bool>(_baseMethod, obj);
        }

        public async Task Delete(int id)
        {
            await _apiClient.DeleteAsync<bool>($"{_baseMethod}/{id}");
        }

        public async Task<User> Get(int id)
        {
            return await _apiClient.GetAsync<User>($"{_baseMethod}/{id}");
        }

        public async Task<List<User>> Get()
        {
            return await _apiClient.GetAsync<List<User>>($"{_baseMethod}");
        }

        public async Task Login(User obj)
        {
            await _apiClient.PostAsync<AuthenticationDto>(_baseMethod, obj);
        }

        public async Task Update(User obj)
        {
            await _apiClient.PutAsync<bool>(_baseMethod, obj);
        }
    }
}
