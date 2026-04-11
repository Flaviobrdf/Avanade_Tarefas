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

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TaskItem>>> GetTasks()
        {
            try
            {
                return await _context.Tasks
                    .OrderBy(t => t.Completed)
                    .ThenByDescending(t => t.Id)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro ao carregar tarefas.", detail = ex.Message });
            }
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<TaskItem>>> GetTasksByUser(int userId)
        {
            try
            {
                var tasks = await _context.Tasks
                    .Where(t => t.UserId == userId)
                    .OrderBy(t => t.Completed)
                    .ThenByDescending(t => t.Id)
                    .ToListAsync();

                return Ok(tasks);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro ao carregar tarefas do usuário.", detail = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TaskItem>> GetTask(int id)
        {
            try
            {
                var task = await _context.Tasks.FindAsync(id);

                if (task == null)
                    return NotFound(new { message = "Tarefa não encontrada." });

                return task;
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro ao buscar tarefa.", detail = ex.Message });
            }
        }

        [HttpPost]
        public async Task<ActionResult<TaskItem>> CreateTask(TaskItem task)
        {
            if (string.IsNullOrWhiteSpace(task.Title) || string.IsNullOrWhiteSpace(task.Description))
            {
                return BadRequest(new { message = "Título e descrição são obrigatórios." });
            }

            try
            {
                task.DtCriacao = DateTime.Now;
                _context.Tasks.Add(task);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetTask), new { id = task.Id }, task);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro ao criar tarefa.", detail = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTask(int id, TaskItem task)
        {
            if (id != task.Id)
                return BadRequest(new { message = "ID da tarefa não corresponde." });

            if (string.IsNullOrWhiteSpace(task.Title) || string.IsNullOrWhiteSpace(task.Description))
            {
                return BadRequest(new { message = "Título e descrição são obrigatórios." });
            }

            _context.Entry(task).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
                return Ok(new { message = "Tarefa atualizada com sucesso!" });
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Tasks.Any(e => e.Id == id))
                    return NotFound(new { message = "Tarefa não encontrada." });
                else
                    throw;
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro ao atualizar tarefa.", detail = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            try
            {
                var task = await _context.Tasks.FindAsync(id);
                if (task == null)
                    return NotFound(new { message = "Tarefa não encontrada." });

                _context.Tasks.Remove(task);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Tarefa excluída com sucesso!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro ao excluir tarefa.", detail = ex.Message });
            }
        }
    }
}
