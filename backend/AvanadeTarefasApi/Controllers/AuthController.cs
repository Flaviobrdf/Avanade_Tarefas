using Microsoft.AspNetCore.Mvc;
using AvanadeTarefasApi.Data;
using AvanadeTarefasApi.Models;
using System.Linq;

namespace AvanadeTarefasApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            // Busca usuário no banco
            var user = _context.Users.FirstOrDefault(u => u.Username == request.Username && u.Password == request.Password);

            if (user == null)
            {
                return Unauthorized(new { message = "Usuário ou senha inválidos" });
            }

            var token = Guid.NewGuid().ToString(); 

            return Ok(new {
                message = "Login realizado com sucesso!",
                token = token,
                id = user.Id,
                username = user.Username
            });

        }
    }

    public class LoginRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
