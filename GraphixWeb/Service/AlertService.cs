using MudBlazor;

namespace GraphixWeb.Service
{
    public class AlertService
    {
        public event Action<string, Severity> OnShow;

        public void ShowAlert(string message, Severity severity)
        {
            OnShow?.Invoke(message, severity);
        }
    }
}
