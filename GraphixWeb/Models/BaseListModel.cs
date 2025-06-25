namespace GraphixWeb.Models
{
    public class BaseListModel<T>
    {
        public BaseListModel()
        {
            Data = new List<T>();
        }

        public DateTime? Cursor { get; set; }
        public int? PageSize { get; set; }
        public List<T> Data { get; set; }
    }
}