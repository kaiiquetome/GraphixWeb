namespace GraphixWeb.Models
{
    public class Product : BaseModel
    {
        public string? Description { get; set; }
        public string? Finish { get; set; }
        public string? Color { get; set; }
        public string? Dimension { get; set; }

        public string? Knife { get; set; }
        public string? Tubet { get; set; }
        public string? Material { get; set; }
        public string? Observation { get; set; }
    }
}
