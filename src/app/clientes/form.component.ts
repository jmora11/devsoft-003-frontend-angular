import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './clientes.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  public cliente: Cliente = new Cliente();
  public titulo: string = "Crear Cliente";
  public errores: string[] = [];

  constructor(private clienteService: ClienteService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.cargarCliente();
  }

  cargarCliente(): void {
    this.activatedRoute.params.subscribe(params => {
      let id = params['id'];
      if(id) {
        this.clienteService.getCliente(id).subscribe(
          cliente => this.cliente = cliente
        )
      }
    })
  }


  public create(): void {
    this.clienteService.createClient(this.cliente).subscribe(
      cliente => {
        this.router.navigate(['/clientes'])
        Swal.fire({
          icon: 'success',
          title: 'Añadir cliente',
          text: `Cliente ${cliente.nombre} creado con éxito`
        })
      }, err => {
        this.errores = err.error.errors as string[];
        console.log('StausCode', err.status);
        console.log('Errores', err.error.errors);
      }
    )
  }

  update(): void {
    this.clienteService.updateCliente(this.cliente).subscribe(
      json => {
        this.router.navigate(['/clientes'])
        Swal.fire({
          icon: 'success',
          title: 'Modificar cliente',
          text: `Cliente ${json.cliente.nombre} modificado con éxito`
        })
      }, err => {
        this.errores = err.error.errors as string[];
        console.log('StausCode', err.status);
        console.log('Errores', err.error.errors);
      }
    )
  }
}
