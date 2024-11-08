using GraphixWeb.Models;

namespace GraphixWeb.Models.OrderService
{
    public class InkMix : BaseModel
    {
        public int OrderServiceId { get; set; }
        public string? InkNamePantone { get; set; }
        public string? LotUsed { get; set; }
        public string? Percentage { get; set; }
        public string? FinalLot { get; set; }
    }
}
