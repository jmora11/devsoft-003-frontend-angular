import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../usuarios/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(public authService: AuthService,
    private router: Router) { }

  ngOnInit(): void {

  }

  logout(): void {
    let username = this.authService.usuario.username;
    this.authService.logout();
    Swal.fire({
      icon: 'success',
      title: 'Logout',
      text: `${username} has cerrado cesión`
    });
    this.router.navigate(['/login']);
  }
}
