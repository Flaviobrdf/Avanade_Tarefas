import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'; 

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private router: Router, private authService: AuthService) {}

  onSubmit(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    this.authService.login(email, password).subscribe({
      next: (res: any) => {
        console.log('Login OK', res);
        localStorage.setItem('token', res.token);
        // aqui você pode redirecionar para /tasks, por exemplo
        this.router.navigate(['/tasks']);
      },
      error: err => {
        console.error('Login falhou', err);
      }
    });
  }

  onRegister() {
    this.router.navigate(['/register']);
  }
}
