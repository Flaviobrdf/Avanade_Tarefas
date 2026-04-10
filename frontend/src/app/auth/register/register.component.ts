import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  constructor(private http: HttpClient, private router: Router) {}

  onSubmit(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const username = (form.elements.namedItem('username') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    const user = { Username: username, Password: password };

    this.http.post('http://localhost:5184/api/users/register', user)
      .subscribe({
        next: (res: any) => {
          alert(res.message || 'Cadastro realizado com sucesso!');
          console.log('Resposta da API:', res);
          this.router.navigate(['/login']); 
        },
        error: (err) => {
          alert(err.error.message || 'Erro ao cadastrar usuário.');
          console.error(err);
        }
      });
  }

  
  onLogin() {
    this.router.navigate(['/login']);
  }
}
