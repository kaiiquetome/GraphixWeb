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
        public OrderService(IMapper mapper)
        {
            _baseMethod = "order";
            _mapper = mapper;
        }
        public async Task<CreateOrderResponseDto> Create(Order order)
        {
            return await ApiClient.PostAsync<CreateOrderResponseDto>(_baseMethod, _mapper.Map<OrderDto>(order));
        }
        public async Task Delete(int id)
        {
            await ApiClient.DeleteAsync<bool>($"{_baseMethod}/{id}");
        }
        public async Task<Order> Get(int id)
        {
            return await ApiClient.GetAsync<Order>($"{_baseMethod}/{id}");
        }
        public async Task<List<Order>> Get()
        {
            return await ApiClient.GetAsync<List<Order>>($"{_baseMethod}");
        }
        public async Task Update(Order order)
        {
            await ApiClient.PutAsync<bool>(_baseMethod, _mapper.Map<OrderDto>(order));
        }
        public async Task<byte[]> Download(int id)
        {
            return await ApiClient.DownloadFileAsync<byte[]>($"{_baseMethod}/download?Id={id}");
        }
        public async Task<byte[]> Export(string startDate, string endDate)
        {
            return await ApiClient.DownloadFileAsync<byte[]>($"{_baseMethod}/export?startDate={startDate}&endDate={endDate}");
        }
    }
}
