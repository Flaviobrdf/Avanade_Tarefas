import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

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
}
