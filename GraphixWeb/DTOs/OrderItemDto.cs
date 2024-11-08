namespace GraphixWeb.DTOs
{
    public class OrderItemDto : BaseDto
    {
        public int OrderId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal Total { get; set; }
    }
}
