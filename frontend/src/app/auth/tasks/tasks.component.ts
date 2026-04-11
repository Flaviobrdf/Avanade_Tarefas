import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TaskService, Task } from '../../services/task.service';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
  tasks: Task[] = [];
  username: string | null = null;
  showModal = false;
  isEditing = false;

  // objeto sempre inicializado
  selectedTask: Task = {
    id: 0,
    title: '',
    description: '',
    userId: 0,
    completed: false,
    dtCriacao: ''
  };

  constructor(private router: Router, private taskService: TaskService) {
    this.username = localStorage.getItem('username');
  }

  ngOnInit() {
    const userId = Number(localStorage.getItem('userId'));
    this.taskService.getTasksByUser(userId).subscribe((tasks: Task[]) => {
      this.tasks = tasks;
      this.ordenarTarefas();
    });
  }


  // ordenar tarefas: pendentes primeiro, concluídas depois
  private ordenarTarefas() {
    this.tasks.sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1; // pendentes primeiro
      }
      return new Date(a.dtCriacao).getTime() - new Date(b.dtCriacao).getTime();
    });
  }

  // abrir modal de criação
  openModal() {
    this.isEditing = false;
    this.selectedTask = {
      id: 0,
      title: '',
      description: '',
      userId: Number(localStorage.getItem('userId')) || 0,
      completed: false,
      dtCriacao: new Date().toISOString()
    };
    this.showModal = true;
  }

  // abrir modal de edição
  editTask(task: Task) {
    this.isEditing = true;
    this.taskService.getTaskById(task.id).subscribe({
      next: (data) => {
        this.selectedTask = data;
        this.showModal = true;
      },
      error: (err) => console.error('Erro ao buscar tarefa:', err)
    });
  }

  // salvar edição (PUT)
  saveEdit(event?: Event) {
    if (event) event.preventDefault();
    if (this.selectedTask) {
      this.taskService.updateTask(this.selectedTask).subscribe({
        next: () => {
          const index = this.tasks.findIndex(t => t.id === this.selectedTask.id);
          if (index !== -1) {
            this.tasks[index] = { ...this.selectedTask };
          }
          this.ordenarTarefas();
          this.closeModal();
        },
        error: (err) => console.error('Erro ao atualizar tarefa:', err)
      });
    }
  }

  // criar nova tarefa
  addTask(title: string, description: string, event?: Event) {
    if (event) event.preventDefault();

    const userId = Number(localStorage.getItem('userId'));
    const newTask: Task = {
      id: 0,
      title,
      description,
      userId,
      completed: false,
      dtCriacao: new Date().toISOString()
    };

    this.taskService.createTask(newTask).subscribe({
      next: (task: Task) => {
        this.tasks.push(task);
        this.ordenarTarefas();
        this.closeModal();

        // rola até a última tarefa criada
        setTimeout(() => {
          const list = document.querySelector('.task-list');
          if (list) {
            list.lastElementChild?.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      },
      error: (err) => console.error('Erro ao salvar tarefa:', err)
    });
  }

  toggleStatus(task: Task) {
    task.completed = !task.completed;
    this.taskService.updateTask(task).subscribe(() => {
      this.ordenarTarefas();
    });
  }

  deleteTask(task: Task) {
    const confirmed = window.confirm(`Tem certeza que deseja excluir a tarefa "${task.title}"?`);
    if (confirmed) {
      this.taskService.deleteTask(task.id).subscribe(() => {
        this.tasks = this.tasks.filter((t: Task) => t.id !== task.id);
      });
    }
  }

  closeModal() {
    this.showModal = false;
    this.isEditing = false;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    this.router.navigate(['/login']);
  }
}
