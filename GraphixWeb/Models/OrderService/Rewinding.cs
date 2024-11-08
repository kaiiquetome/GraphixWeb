using GraphixWeb.Models;

namespace GraphixWeb.Models.OrderService
{
    public class Rewinding : BaseModel
    {
        public int OrderServiceId { get; set; }
        public int ProductId { get; set; }
        public string? ReviewedBy { get; set; }
        public string? RollQuantity { get; set; }
        public string? BoxQuantity { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }


        public Product Product { get; set; }
    }
}
