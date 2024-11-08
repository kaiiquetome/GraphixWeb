namespace GraphixWeb.Models
{
    public class CustomListErrorModel
    {
        public string Detail { get; set; } = default!;
        public List<Dictionary<string, string>> Errors { get; set; } = new();
    }
}
