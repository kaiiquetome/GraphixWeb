using GraphixWeb.Contract;
using GraphixWeb.Helpers;
using GraphixWeb.Models;

namespace GraphixWeb.Service
{
    public class ProductService : IProductService
    {
        private readonly string _baseMethod;
        private readonly ApiClient _apiClient;
        public ProductService(ApiClient apiClient)
        {
            _baseMethod = "product";
            _apiClient = apiClient;
        }
        public async Task Create(Product product)
        {
            await _apiClient.PostAsync<bool>(_baseMethod, product);
        }

        public async Task Delete(int id)
        {
            await _apiClient.DeleteAsync<bool>($"{_baseMethod}/{id}");
        }

        public async Task<Product> Get(int id)
        {
            return await _apiClient.GetAsync<Product>($"{_baseMethod}/{id}");
        }

        public async Task<List<Product>> Get()
        {
            return await _apiClient.GetAsync<List<Product>>($"{_baseMethod}");
        }

        public async Task Update(Product product)
        {
            await _apiClient.PutAsync<bool>(_baseMethod, product);
        }
    }
}
