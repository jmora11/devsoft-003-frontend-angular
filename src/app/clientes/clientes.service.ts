import { Injectable } from '@angular/core';
import { Cliente } from './cliente';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpRequest, HttpEvent } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private endpoint: string = 'http://localhost:8080/api/clientes';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });


  constructor(private http: HttpClient, private router: Router) { }

  getClientes(page: number): Observable<any> {

    return this.http.get(this.endpoint + '/page/' +page).pipe(
      map((res: any) => {

        (res.content as Cliente[]).map(cliente => {

          cliente.createAt = formatDate(cliente.createAt, 'EEEE dd, MMMM yyyy', 'es');
          return cliente;

        });

        return res;
      })
    )
  }

  createClient(cliente: Cliente): Observable<Cliente> {
    return this.http.post(this.endpoint, cliente, { headers: this.httpHeaders }).pipe(
      map((response: any) => response.cliente as Cliente),
      catchError(e => {

        if (e.status == 400) {
          return throwError(e);
        }

        console.log('Error', e.error.mensaje);
        Swal.fire({
          icon: 'error',
          title: e.error.mensaje,
          text: e.error.error
        });
        return throwError(e);
      })
    );
  }

  getCliente(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.endpoint}/${id}`).pipe(
      catchError(e => {
        this.router.navigate(['/clientes']);
        console.log('Error', e.error.mensaje);
        Swal.fire({
          icon: 'error',
          title: 'Error al consultar cliente',
          text: e.error.mensaje
        });
        return throwError(e)
      })
    );
  }

  updateCliente(cliente: Cliente): Observable<any> {
    return this.http.put<any>(`${this.endpoint}/${cliente.id}`, cliente, { headers: this.httpHeaders }).pipe(
      catchError(e => {

        if (e.status == 400) {
          return throwError(e);
        }

        console.log('Error', e.error.mensaje);
        Swal.fire({
          icon: 'error',
          title: e.error.mensaje,
          text: e.error.error
        });
        return throwError(e)
      })
    );
  }

  deleteCliente(id: number): Observable<Cliente> {
    return this.http.delete<Cliente>(`${this.endpoint}/${id}`, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        console.log('Error', e.error.mensaje);
        Swal.fire({
          icon: 'error',
          title: e.error.mensaje,
          text: e.error.error
        });
        return throwError(e)
      })
    );
  }

  subirFoto(archivo: File, id): Observable<HttpEvent<{}>> {
    let formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("id", id);

    const req = new HttpRequest('POST', `${this.endpoint}/upload`, formData, {
      reportProgress: true
    });

    return this.http.request(req);
  }
}
