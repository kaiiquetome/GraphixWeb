using GraphixWeb.Contract;
using GraphixWeb.Helpers;
using GraphixWeb.Models;

namespace GraphixWeb.Service
{
    public class AccountService : IAccountService
    {
        private readonly string _baseMethod;
        public AccountService()
        {
            _baseMethod = "account";
        }
        public async Task Create(Account account)
        {
            await ApiClient.PostAsync<bool>(_baseMethod, account);
        }

        public async Task Delete(int id)
        {
            await ApiClient.DeleteAsync<bool>($"{_baseMethod}/{id}");
        }

        public async Task<Account> Get(int id)
        {
            return await ApiClient.GetAsync<Account>($"{_baseMethod}/{id}");
        }

        public async Task<List<Account>> Get()
        {
            return await ApiClient.GetAsync<List<Account>>($"{_baseMethod}");
        }

        public async Task Update(Account account)
        {
            await ApiClient.PutAsync<bool>(_baseMethod, account);
        }
    }
}
