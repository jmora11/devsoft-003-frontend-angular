import { Injectable } from '@angular/core';
import { Cliente } from './cliente';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { Region } from './region';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private endpoint: string = 'http://localhost:8080/api/clientes';

  constructor(private http: HttpClient,
    private router: Router) { }

  getRegiones(): Observable<Region[]> {
    return this.http.get<Region[]>(`${this.endpoint}/regiones`);
  }

  getClientes(page: number): Observable<any> {

    return this.http.get(this.endpoint + '/page/' + page).pipe(
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
    return this.http.post(this.endpoint, cliente).pipe(
      map((response: any) => response.cliente as Cliente),
      catchError(e => {

        if (e.status == 400) {
          return throwError(e);
        }

        return throwError(e);
      })
    );
  }

  getCliente(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.endpoint}/${id}`).pipe(
      catchError(e => {
        if (e.status != 401) {
          this.router.navigate(['/clientes']);
        }
        return throwError(e)
      })
    );
  }

  updateCliente(cliente: Cliente): Observable<any> {
    return this.http.put<any>(`${this.endpoint}/${cliente.id}`, cliente).pipe(
      catchError(e => {

        if (e.status == 400) {
          return throwError(e);
        }

        return throwError(e)
      })
    );
  }

  deleteCliente(id: number): Observable<Cliente> {
    return this.http.delete<Cliente>(`${this.endpoint}/${id}`).pipe(
      catchError(e => throwError(e)));
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
