import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Task {
  title: string;
  description: string;
  status: 'Pendente' | 'Concluída';
  createdAt: Date;
}

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent {
  tasks: Task[] = [];
  username: string | null = null;

  constructor(private router: Router) {
    // Recupera o nome do usuário salvo no localStorage
    this.username = localStorage.getItem('username');
  }

  addTask(title: string, description: string) {
    const newTask: Task = {
      title,
      description,
      status: 'Pendente',
      createdAt: new Date()
    };
    this.tasks.push(newTask);
  }

  toggleStatus(task: Task) {
    task.status = task.status === 'Pendente' ? 'Concluída' : 'Pendente';
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this.router.navigate(['/login']);
  }
}
