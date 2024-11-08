using GraphixWeb.Models;

namespace GraphixWeb.Models.OrderService
{
    public class Traceability : BaseModel
    {
        public int OrderServiceId { get; set; }
        public string? RawMaterialInk { get; set; }
        public string? Lot { get; set; }
        public int Quantity { get; set; }
    }
}
