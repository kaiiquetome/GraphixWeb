using AutoMapper;
using GraphixWeb.DTOs;
using GraphixWeb.DTOs.OrderService;
using GraphixWeb.Models;
using GraphixWeb.Models.OrderService;

namespace GraphixWeb.AutoMapper
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            #region Order
            CreateMap<Order, OrderDto>();
            CreateMap<OrderItem, OrderItemDto>();
            #endregion
            #region OS
            CreateMap<Anilox, AniloxDto>();
            CreateMap<InkMix, InkMixDto>();
            CreateMap<MachineSetup, MachineSetupDto>();
            CreateMap<OS, OSDto>();
            CreateMap<Rewinding, RewindingDto>();
            CreateMap<Traceability, TraceabilityDto>();
            #endregion

        }
    }
}
