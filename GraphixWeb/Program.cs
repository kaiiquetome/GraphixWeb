using GraphixWeb;
using GraphixWeb.Authentication;
using GraphixWeb.AutoMapper;
using GraphixWeb.Contract;
using GraphixWeb.Helpers;
using GraphixWeb.Service;
using GraphixWeb.Service.Security;
using Microsoft.AspNetCore.Components.Authorization;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using MudBlazor.Services;

var builder = WebAssemblyHostBuilder.CreateDefault(args);
builder.RootComponents.Add<App>("#app");
builder.RootComponents.Add<HeadOutlet>("head::after");
builder.Services.AddMudServices();

var config = new ConfigurationBuilder()
    .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
    .Build();

builder.Services.AddSingleton<IConfiguration>(config);
AppDomain.CurrentDomain.UnhandledException += (sender, args) =>
{
    Console.WriteLine($"Unhandled exception: {args.ExceptionObject}");
};

builder.Services.AddScoped<IAccountService, AccountService>();
builder.Services.AddScoped<ICustomerService, CustomerService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IOSService, OSService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ICashFlowService, CashFlowService>();
builder.Services.AddScoped<ApiClient>();

builder.Services.AddAuthorizationCore();
builder.Services.AddScoped<CustomAuthStateProvider>();
builder.Services.AddScoped<AuthenticationStateProvider>(provider => provider.GetRequiredService<CustomAuthStateProvider>());

builder.Services.AddSingleton<AlertService>();

builder.Services.AddAutoMapper(typeof(AutoMapperProfile));

builder.Services.AddScoped(sp => new HttpClient { BaseAddress = new Uri(builder.HostEnvironment.BaseAddress) });

await builder.Build().RunAsync();