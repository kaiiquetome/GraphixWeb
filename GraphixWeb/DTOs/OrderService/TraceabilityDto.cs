using GraphixWeb.DTOs;

namespace GraphixWeb.DTOs.OrderService
{
    public class TraceabilityDto : BaseDto
    {
        public int OrderServiceId { get; set; }
        public string? RawMaterialInk { get; set; }
        public string? Lot { get; set; }
        public int Quantity { get; set; }
    }
}
