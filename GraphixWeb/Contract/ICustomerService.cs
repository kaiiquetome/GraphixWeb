using GraphixWeb.Models;

namespace GraphixWeb.Contract
{
    public interface ICustomerService
    {
        Task<List<Customer>> Get();
        Task<Customer> Get(int id);
        Task Create(Customer customer);
        Task Update(Customer customer);
        Task Delete(int id);
    }
}
