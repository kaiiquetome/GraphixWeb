using GraphixWeb.Models;

namespace GraphixWeb.Contract
{
    public interface ICustomerService
    {
        Task<List<Customer>> Get();

        Task<List<Customer>> Get(string startDate, string endDate, int PageSize = 20);

        Task<Customer> Get(int id);

        Task Create(Customer customer);

        Task Update(Customer customer);

        Task Delete(int id);
    }
}