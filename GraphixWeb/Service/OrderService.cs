using AutoMapper;
using GraphixWeb.Contract;
using GraphixWeb.DTOs;
using GraphixWeb.Helpers;
using GraphixWeb.Models;

namespace GraphixWeb.Service
{
    public class OrderService : IOrderService
    {
        private readonly string _baseMethod;
        private readonly IMapper _mapper;
        private readonly ApiClient _apiClient;

        public OrderService(IMapper mapper, ApiClient apiClient)
        {
            _baseMethod = "order";
            _mapper = mapper;
            _apiClient = apiClient;
        }

        public async Task<CreateOrderResponseDto> Create(Order order)
        {
            return await _apiClient.PostAsync<CreateOrderResponseDto>(_baseMethod, _mapper.Map<OrderDto>(order));
        }

        public async Task Delete(int id)
        {
            await _apiClient.DeleteAsync<bool>($"{_baseMethod}/{id}");
        }

        public async Task<Order> Get(int id)
        {
            return await _apiClient.GetAsync<Order>($"{_baseMethod}/{id}");
        }

        public async Task<List<Order>> Get()
        {
            return await _apiClient.GetAsync<List<Order>>($"{_baseMethod}");
        }

        public async Task<List<Order>> Get(string startDate, string endDate)
        {
            return await _apiClient.GetAsync<List<Order>>($"{_baseMethod}?StartDate={startDate}&EndDate={endDate}");
        }

        public async Task Update(Order order)
        {
            await _apiClient.PutAsync<bool>(_baseMethod, _mapper.Map<OrderDto>(order));
        }

        public async Task<byte[]> Download(int id, string deadLine)
        {
            return await _apiClient.DownloadFileAsync<byte[]>($"{_baseMethod}/download?Id={id}&OrderDeadline={deadLine}");
        }

        public async Task<byte[]> Export(string startDate, string endDate)
        {
            return await _apiClient.DownloadFileAsync<byte[]>($"{_baseMethod}/export?StartDate={startDate}&EndDate={endDate}");
        }
    }
}