using GraphixWeb.Models;

namespace GraphixWeb.Contract
{
    public interface ICashFlowService
    {
        Task<List<CashFlow>> Get(DateTime startDate, DateTime endDate);

        Task<List<CashFlow>> Get(string startDate, string endDate, int pageSize = 20);

        Task<CashFlow> Get(int id);

        Task Update(CashFlow os);

        Task Delete(int id);

        Task Create(CashFlow os);
    }
}