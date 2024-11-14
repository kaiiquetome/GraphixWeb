﻿using GraphixWeb.Contract;
using GraphixWeb.Helpers;
using GraphixWeb.Models;

namespace GraphixWeb.Service
{
    public class CustomerService : ICustomerService
    {
        private readonly string _baseMethod;
        private readonly ApiClient _apiClient;
        public CustomerService(ApiClient apiClient)
        {
            _baseMethod = "customer";
            _apiClient = apiClient;
        }
        public async Task Create(Customer customer)
        {
            await _apiClient.PostAsync<bool>(_baseMethod, customer);
        }

        public async Task Delete(int id)
        {
            await _apiClient.DeleteAsync<bool>($"{_baseMethod}/{id}");
        }

        public async Task<Customer> Get(int id)
        {
            return await _apiClient.GetAsync<Customer>($"{_baseMethod}/{id}");
        }

        public async Task<List<Customer>> Get()
        {
            return await _apiClient.GetAsync<List<Customer>>($"{_baseMethod}");
        }
        public async Task Update(Customer customer)
        {
            await _apiClient.PutAsync<bool>(_baseMethod, customer);
        }
    }
}
