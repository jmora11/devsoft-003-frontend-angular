import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from './auth.service';
import { Usuario } from './usuario';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  titulo: string = 'Inicio de sesión';
  usuario: Usuario;

  constructor(private authService: AuthService,
    private router: Router) {
    this.usuario = new Usuario();
   }

  ngOnInit(): void {
    if (this.authService.isAutheticated()) {
      Swal.fire({
        icon: 'info',
        title: 'Login',
        text: `Hola ${this.authService.usuario.username} ya estás autenticado`
      })
      this.router.navigate(['/clientes']);
    }
  }

  login(): void {
    console.log(this.usuario);
    if(this.usuario.username == null || this.usuario.password == null) {
      Swal.fire({
        icon: 'warning',
        title: 'Error Login',
        text: `Username o password vacíos`
      });
      return;
    }

    this.authService.login(this.usuario).subscribe(
      res =>{

        this.authService.guardarUsuario(res.access_token);
        this.authService.guardarToken(res.access_token);
        let usuario = this.authService.usuario;

        this.router.navigate(['/clientes']);
        Swal.fire({
          icon: 'success',
          title: 'Login',
          text: `Bienvenido ${usuario.username}`
        })
      }, err => {
        if (err.status == 400) {
          Swal.fire({
            icon: 'error',
            title: 'Error Login',
            text: `Credenciales incorrectas`
          })
        }
      } 
    )
  }
}
