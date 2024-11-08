using GraphixWeb.DTOs;

namespace GraphixWeb.DTOs.OrderService
{
    public class InkMixDto : BaseDto
    {
        public int OrderServiceId { get; set; }
        public string? InkNamePantone { get; set; }
        public string? LotUsed { get; set; }
        public string? Percentage { get; set; }
        public string? FinalLot { get; set; }
    }
}
