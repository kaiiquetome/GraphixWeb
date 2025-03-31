using GraphixWeb.Enums;
using System.Text.Json.Serialization;

namespace GraphixWeb.Models
{
    public class Order : BaseModel
    {
        public int CustomerId { get; set; }
        public int AccountId { get; set; }
        public OrderStatus Status { get; set; }
        public int OrderNumber { get; set; }
        public decimal Total { get; set; }
        public string? Observation { get; set; }
        public string? PaymentCondition { get; set; }
        public string? Seller { get; set; }
        public decimal Freight { get; set; }
        public bool FOB { get; set; } = false;
        public DateTime? DeliveryDeadline { get; set; }
        public DateTime? DeliveryDate { get; set; }
        public List<OrderItem> Items { get; set; }
        public Account Account { get; set; }
        public Customer Customer { get; set; }

        [JsonIgnore]
        public bool ShowDetails { get; set; }
    }
}