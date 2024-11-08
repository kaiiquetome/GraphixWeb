namespace GraphixWeb.Models
{
    public class BaseModel
    {
        public int Id { get; set; }
        public DateTime? CreatedAt { get; set; }
        public int CreatedByUser { get; set; }
        public DateTime? ModifiedAt { get; set; }
        public int ModifiedByUser { get; set; }
    }
}
