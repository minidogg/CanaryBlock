var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.MapGet("/", () => "aaaaaaa");

app.Run();

File.Create("./test.txt");