using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AvanadeTarefasApi.Data;
using AvanadeTarefasApi.Models;
using System.Linq;

namespace AvanadeTarefasApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TasksController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TasksController(AppDbContext context)
        {
            _context = context;
        }

        // todas as tarefas (admin)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TaskItem>>> GetTasks()
        {
            return await _context.Tasks
                .OrderBy(t => t.Completed)
                .ThenByDescending(t => t.Id)
                .ToListAsync();
        }

        // tarefas de um usuário específico
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<TaskItem>>> GetTasksByUser(int userId)
        {
            var tasks = await _context.Tasks
                .Where(t => t.UserId == userId)
                .OrderBy(t => t.Completed)
                .ThenByDescending(t => t.Id)
                .ToListAsync();

            return Ok(tasks);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TaskItem>> GetTask(int id)
        {
            var task = await _context.Tasks.FindAsync(id);

            if (task == null)
                return NotFound();

            return task;
        }

        [HttpPost]
        public async Task<ActionResult<TaskItem>> CreateTask(TaskItem task)
        {
            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTask), new { id = task.Id }, task);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTask(int id, TaskItem task)
        {
            if (id != task.Id)
                return BadRequest();

            _context.Entry(task).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Tasks.Any(e => e.Id == id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null)
                return NotFound();

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
