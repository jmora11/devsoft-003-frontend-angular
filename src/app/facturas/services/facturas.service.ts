import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Factura } from '../models/factura';
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root'
})
export class FacturasService {

  private endpoint: string = 'http://localhost:8080/api/facturas';

  constructor(private http: HttpClient) { }

  getFactura(id: number): Observable<Factura> {
    return this.http.get<Factura>(`${this.endpoint}/${id}`);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }

  filtrarProducto(termino: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.endpoint}/filtrar-productos/${termino}`);
  }

  create(factura: Factura): Observable<Factura> {
    return this.http.post<Factura>(this.endpoint, factura);
  }
}
