import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import Swal from "sweetalert2";
import { AuthService } from "../auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService,
        private router: Router){}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        
        return next.handle(req).pipe(
            catchError(e => {

                if (e.status == 401) {

                    if (this.authService.isAutheticated()) {
                      this.authService.logout();
                    }

                    this.router.navigate(['/login']);
                  }
              
                  if (e.status == 403) {

                    Swal.fire({
                      icon: 'warning',
                      title: 'Acceso denegado',
                      text: 'No tienes acceso a este recurso'
                    });

                    this.router.navigate(['/clientes']);
                  }

                return throwError(e);
            })
        );
    }
}
