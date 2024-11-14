using GraphixWeb.Contract;
using GraphixWeb.Helpers;
using GraphixWeb.Models;

namespace GraphixWeb.Service
{
    public class AccountService : IAccountService
    {
        private readonly string _baseMethod;
        private readonly ApiClient _apiClient;
        public AccountService(ApiClient apiClient)
        {
            _baseMethod = "account";
            _apiClient = apiClient;
        }
        public async Task Create(Account account)
        {
            await _apiClient.PostAsync<bool>(_baseMethod, account);
        }

        public async Task Delete(int id)
        {
            await _apiClient.DeleteAsync<bool>($"{_baseMethod}/{id}");
        }

        public async Task<Account> Get(int id)
        {
            return await _apiClient.GetAsync<Account>($"{_baseMethod}/{id}");
        }

        public async Task<List<Account>> Get()
        {
            return await _apiClient.GetAsync<List<Account>>($"{_baseMethod}");
        }

        public async Task Update(Account account)
        {
            await _apiClient.PutAsync<bool>(_baseMethod, account);
        }
    }
}
