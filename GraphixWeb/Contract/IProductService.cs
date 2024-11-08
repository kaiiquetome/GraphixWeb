using GraphixWeb.Models;

namespace GraphixWeb.Contract
{
    public interface IProductService
    {
        Task Create(Product product);
        Task<Product> Get(int id);
        Task<List<Product>> Get();
        Task Update(Product product);
        Task Delete(int id);
    }
}
