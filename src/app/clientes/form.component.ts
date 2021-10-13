import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './clientes.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  public cliente: Cliente = new Cliente();
  public titulo: string = "Crear Cliente";
  constructor(private clienteService: ClienteService,
    private router: Router) { }

  ngOnInit(): void {
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
      }
    )
  }
}
