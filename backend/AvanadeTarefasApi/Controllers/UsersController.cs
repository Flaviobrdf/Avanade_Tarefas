using Microsoft.AspNetCore.Mvc;
using AvanadeTarefasApi.Data;
using AvanadeTarefasApi.Models;
using System.Linq;

namespace AvanadeTarefasApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("login")] // <-- ESSENCIAL
        public IActionResult Login([FromBody] User login)
        {
            var user = _context.Users
                .FirstOrDefault(u => u.Username == login.Username && u.Password == login.Password);

            if (user == null)
                return Unauthorized(new { message = "Usuário ou senha inválidos." });

            // Retorna JSON estruturado
            var token = Guid.NewGuid().ToString();
            return Ok(new { token, username = user.Username });
        }
    }
}
