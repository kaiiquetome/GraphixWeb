using GraphixWeb.Contract;
using GraphixWeb.Helpers;
using GraphixWeb.Models;

namespace GraphixWeb.Service
{
    public class ProductService : IProductService
    {
        private readonly string _baseMethod;
        public ProductService()
        {
            _baseMethod = "product";
        }
        public async Task Create(Product product)
        {
            await ApiClient.PostAsync<bool>(_baseMethod, product);
        }

        public async Task Delete(int id)
        {
            await ApiClient.DeleteAsync<bool>($"{_baseMethod}/{id}");
        }

        public async Task<Product> Get(int id)
        {
            return await ApiClient.GetAsync<Product>($"{_baseMethod}/{id}");
        }

        public async Task<List<Product>> Get()
        {
            return await ApiClient.GetAsync<List<Product>>($"{_baseMethod}");
        }

        public async Task Update(Product product)
        {
            await ApiClient.PutAsync<bool>(_baseMethod, product);
        }
    }
}
