import { Injectable } from '@angular/core';
import { clientes } from './clientes.json';
import { Cliente } from './cliente';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private endpoint: string = 'http://localhost:8080/api/clientes';
  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});


  constructor(private http: HttpClient) { }

  getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.endpoint)
  }

  createClient(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.endpoint, cliente, {headers: this.httpHeaders});
  }
}
