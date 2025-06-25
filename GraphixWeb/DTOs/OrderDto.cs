using GraphixWeb.Enums;

namespace GraphixWeb.DTOs
{
    public class OrderDto : BaseDto
    {
        public int CustomerId { get; set; }
        public int AccountId { get; set; }
        public OrderStatus Status { get; set; }
        public int OrderNumber { get; set; }
        public decimal Total { get; set; }
        public decimal Discount { get; set; }
        public string? Observation { get; set; }
        public string? PaymentCondition { get; set; }
        public string? Seller { get; set; }
        public decimal Freight { get; set; }
        public bool FOB { get; set; }
        public DateTime? DeliveryDeadline { get; set; }
        public DateTime? DeliveryDate { get; set; }
        public List<OrderItemDto> Items { get; set; }
    }
}