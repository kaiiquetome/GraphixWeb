using GraphixWeb.Models.OrderService;

namespace GraphixWeb.Contract
{
    public interface IOSService
    {
        Task<OS> Create(OS os);

        Task<OS> Get(int id);

        Task<List<OS>> Get();

        Task<List<OS>> Get(string startDate, string endDate, int pageSize = 20);

        Task Update(OS os);

        Task Delete(int id);

        Task<byte[]> Download(int id);
    }
}