﻿using GraphixWeb.DTOs;
using GraphixWeb.Models;

namespace GraphixWeb.Contract
{
    public interface IOrderService
    {
        Task<CreateOrderResponseDto> Create(Order order);

        Task<Order> Get(int id);

        Task<List<Order>> Get();

        Task<List<Order>> Get(string startDate, string endDate, int pageSize = 20);

        Task Update(Order order);

        Task Delete(int id);

        Task<byte[]> Export(string startDate, string endDate);

        Task<byte[]> Download(int id, string deadLine);
    }
}