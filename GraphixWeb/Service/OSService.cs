using AutoMapper;
using GraphixWeb.Contract;
using GraphixWeb.DTOs.OrderService;
using GraphixWeb.Helpers;

namespace GraphixWeb.Service
{
    public class OSService : IOSService
    {
        private readonly string _baseMethod;
        private readonly IMapper _mapper;
        public OSService(IMapper mapper)
        {
            _baseMethod = "orderService";
            _mapper = mapper;
        }
        public async Task<Models.OrderService.OS> Create(Models.OrderService.OS os)
        {
            return await ApiClient.PostAsync<Models.OrderService.OS>(_baseMethod, _mapper.Map<OSDto>(os));
        }
        public async Task Delete(int id)
        {
            await ApiClient.DeleteAsync<bool>($"{_baseMethod}/{id}");
        }
        public async Task<Models.OrderService.OS> Get(int id)
        {
            return await ApiClient.GetAsync<Models.OrderService.OS>($"{_baseMethod}/{id}");
        }
        public async Task<List<Models.OrderService.OS>> Get()
        {
            return await ApiClient.GetAsync<List<Models.OrderService.OS>>($"{_baseMethod}");
        }
        public async Task Update(Models.OrderService.OS os)
        {
            await ApiClient.PutAsync<bool>(_baseMethod, _mapper.Map<OSDto>(os));
        }
        public async Task<byte[]> Download(int id)
        {
            return await ApiClient.DownloadFileAsync<byte[]>($"{_baseMethod}/download?Id={id}");
        }
    }
}
