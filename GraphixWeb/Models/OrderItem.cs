
using System.Text.Json.Serialization;

namespace GraphixWeb.Models
{
    public class OrderItem : BaseModel
    {
        public int OrderId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal Total { get; set; }
        public Product Product { get; set; }
    }
}
