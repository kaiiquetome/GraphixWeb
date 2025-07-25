﻿using AutoMapper;
using GraphixWeb.Contract;
using GraphixWeb.DTOs.OrderService;
using GraphixWeb.Helpers;
using GraphixWeb.Models;

namespace GraphixWeb.Service
{
    public class OSService : IOSService
    {
        private readonly string _baseMethod;
        private readonly IMapper _mapper;
        private readonly ApiClient _apiClient;

        public OSService(IMapper mapper, ApiClient apiClient)
        {
            _baseMethod = "orderService";
            _mapper = mapper;
            _apiClient = apiClient;
        }

        public async Task<Models.OrderService.OS> Create(Models.OrderService.OS os)
        {
            return await _apiClient.PostAsync<Models.OrderService.OS>(_baseMethod, _mapper.Map<OSDto>(os));
        }

        public async Task Delete(int id)
        {
            await _apiClient.DeleteAsync<bool>($"{_baseMethod}/{id}");
        }

        public async Task<Models.OrderService.OS> Get(int id)
        {
            return await _apiClient.GetAsync<Models.OrderService.OS>($"{_baseMethod}/{id}");
        }

        public async Task<List<Models.OrderService.OS>> Get()
        {
            var response = await _apiClient.GetAsync<BaseListModel<Models.OrderService.OS>>($"{_baseMethod}");

            return response.Data;
        }

        public async Task<List<Models.OrderService.OS>> Get(string startDate, string endDate, int pageSize = 20)
        {
            var response = await _apiClient.GetAsync<BaseListModel<Models.OrderService.OS>>($"{_baseMethod}?StartDate={startDate}&EndDate={endDate}&PageSize={pageSize}");
            return response.Data;
        }

        public async Task Update(Models.OrderService.OS os)
        {
            await _apiClient.PutAsync<bool>(_baseMethod, _mapper.Map<OSDto>(os));
        }

        public async Task<byte[]> Download(int id)
        {
            return await _apiClient.DownloadFileAsync<byte[]>($"{_baseMethod}/download?Id={id}");
        }
    }
}