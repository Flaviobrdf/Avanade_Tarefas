import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  constructor(private http: HttpClient) {}

  onSubmit(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const username = (form.elements.namedItem('username') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    const user = { username: username, password: password };

    this.http.post('http://localhost:5184/api/users/register', user)
      .subscribe({
        next: (res) => {
          alert('Cadastro realizado com sucesso!');
          console.log('Resposta da API:', res);
        },
        error: (err) => {
          alert('Erro ao cadastrar usuário.');
          console.error(err);
        }
      });
  }

  onLogin() {
    console.log('Voltar para tela de login');
  }
}
