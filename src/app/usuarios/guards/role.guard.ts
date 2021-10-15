import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  
  constructor(private authService: AuthService,
    private router: Router){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    if (!this.authService.isAutheticated()) {
      this.router.navigate(['/login']);
      return false;
    }

    let role = route.data['role'] as string;
    console.log('ROL', role);
    if (this.authService.hasRole(role)) {
      return true;
    }
    Swal.fire({
      icon: 'warning',
      title: 'Acceso denegado',
      text: 'No tienes acceso a este recurso'
    });
    this.router.navigate(['/clientes']);
    return false;
  }
  
}
