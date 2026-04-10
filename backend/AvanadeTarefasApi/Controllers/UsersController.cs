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

        [HttpPost("login")] 
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
        [HttpPost("register")]
        public IActionResult Register([FromBody] User newUser)
        {
            if (_context.Users.Any(u => u.Username == newUser.Username))
            {
                return BadRequest(new { message = "Usuário já existe." });
            }

            _context.Users.Add(newUser);
            _context.SaveChanges();

            return Ok(new { message = "Usuário registrado com sucesso!" });
        }

    }
}
