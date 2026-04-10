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
    const username = (form.elements.namedItem('username') as HTMLInputElement).value; 
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    this.authService.login(username, password).subscribe({
      next: (res: any) => {
        alert('Login realizado com sucesso!');
        localStorage.setItem('token', res.token);
        localStorage.setItem('username', res.username); 
        this.router.navigate(['/tasks']);
      },
      error: err => {
        alert(err.error.message || 'Falha no login. Verifique suas credenciais.');
        console.error(err);
      }
    });

  }

  onRegister() {
    this.router.navigate(['/register']);
  }
}
