import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'; 
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loading = false;

  constructor(private router: Router, private authService: AuthService) {}

  onSubmit(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const username = (form.elements.namedItem('username') as HTMLInputElement).value; 
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    this.loading = true;

    this.authService.login(username, password).subscribe({
      next: (res: any) => {
        this.loading = false;
        
        if (res.token) localStorage.setItem('token', res.token);
        if (res.username) localStorage.setItem('username', res.username);
        if (res.id !== undefined && res.id !== null) {
          localStorage.setItem('userId', res.id.toString());
        }
        this.router.navigate(['/tasks']);
      },
      error: err => {
        this.loading = false;
        alert(err.error.message || 'Falha no login. Verifique suas credenciais.');
        console.error(err);
      }
    });
  }

  onRegister() {
    this.router.navigate(['/register']);
  }
}
