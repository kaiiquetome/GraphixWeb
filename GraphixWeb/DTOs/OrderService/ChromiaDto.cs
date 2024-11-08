using GraphixWeb.DTOs;

namespace GraphixWeb.DTOs.OrderService
{
    public class AniloxDto : BaseDto
    {
        public int OrderServiceId { get; set; }
        public int Number { get; set; }
        public string? Cromia { get; set; }
        public string? Pantone { get; set; }
        public string? BCM { get; set; }
        public string? Lines { get; set; }
    }
}
