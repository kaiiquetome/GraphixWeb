using GraphixWeb.Models;

namespace GraphixWeb.Models.OrderService
{
    public class Anilox : BaseModel
    {
        public int OrderServiceId { get; set; }
        public int Number { get; set; }
        public string? Cromia { get; set; }
        public string? Pantone { get; set; }
        public string? BCM { get; set; }
        public string? Lines { get; set; }
    }
}
