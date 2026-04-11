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
        console.log('Resposta do backend no login:', res);
        alert('Login realizado com sucesso!');

        // sempre salva token e username
        if (res.token) {
          localStorage.setItem('token', res.token);
        }
        if (res.username) {
          localStorage.setItem('username', res.username);
        }

        // salva userId apenas se vier do backend
        if (res.id !== undefined && res.id !== null) {
          localStorage.setItem('userId', res.id.toString());
        } else {
          console.warn("Nenhum userId retornado pelo backend!");
        }

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
