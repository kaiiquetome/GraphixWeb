using GraphixWeb.DTOs;

namespace GraphixWeb.DTOs.OrderService
{
    public class RewindingDto : BaseDto
    {
        public int OrderServiceId { get; set; }
        public int ProductId { get; set; }
        public string? ReviewedBy { get; set; }
        public string? RollQuantity { get; set; }
        public string? BoxQuantity { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }


    }
}
