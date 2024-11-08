using GraphixWeb.Contract;
using GraphixWeb.Helpers;
using GraphixWeb.Models;

namespace GraphixWeb.Service
{
    public class CustomerService : ICustomerService
    {
        private readonly string _baseMethod;
        public CustomerService()
        {
            _baseMethod = "customer";
        }
        public async Task Create(Customer customer)
        {
            await ApiClient.PostAsync<bool>(_baseMethod, customer);
        }

        public async Task Delete(int id)
        {
            await ApiClient.DeleteAsync<bool>($"{_baseMethod}/{id}");
        }

        public async Task<Customer> Get(int id)
        {
            return await ApiClient.GetAsync<Customer>($"{_baseMethod}/{id}");
        }

        public async Task<List<Customer>> Get()
        {
            return await ApiClient.GetAsync<List<Customer>>($"{_baseMethod}");
        }
        public async Task Update(Customer customer)
        {
            await ApiClient.PutAsync<bool>(_baseMethod, customer);
        }
    }
}
