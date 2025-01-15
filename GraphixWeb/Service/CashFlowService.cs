using GraphixWeb.Contract;
using GraphixWeb.Helpers;
using GraphixWeb.Models;

namespace GraphixWeb.Service
{
    public class CashFlowService : ICashFlowService
    {
        private readonly string _baseMethod;
        private readonly ApiClient _apiClient;

        public CashFlowService(ApiClient apiClient)
        {
            _baseMethod = "cashFLow";
            _apiClient = apiClient;
        }

        public async Task Create(CashFlow cashFLow)
        {
            await _apiClient.PostAsync<bool>(_baseMethod, cashFLow);
        }

        public async Task Delete(int id)
        {
            await _apiClient.DeleteAsync<bool>($"{_baseMethod}/{id}");
        }

        public async Task Update(CashFlow cashFLow)
        {
            await _apiClient.PutAsync<bool>(_baseMethod, cashFLow);
        }

        public async Task<List<CashFlow>> Get(DateTime startDate, DateTime endDate)
        {
            var startD = startDate.ToString("yyyy-MM-dd");
            var endD = endDate.ToString("yyyy-MM-dd");

            return await _apiClient.GetAsync<List<CashFlow>>($"{_baseMethod}?startDate={startD}&endDate={endD}");
        }

        public async Task<CashFlow> Get(int id)
        {
            return await _apiClient.GetAsync<CashFlow>($"{_baseMethod}/{id}");
        }
    }
}