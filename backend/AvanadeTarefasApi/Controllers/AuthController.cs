using Microsoft.AspNetCore.Mvc;

namespace AvanadeTarefasApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            if (request.Username == "teste" && request.Password == "123")
            {
                return Ok(new { message = "Login realizado com sucesso!", token = "fake-jwt-token" });
            }
            return Unauthorized(new { message = "Usuário ou senha inválidos" });
        }
    }

    public class LoginRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
