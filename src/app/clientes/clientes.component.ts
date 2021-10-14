import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './clientes.service';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { ModalService } from './detalle/modal.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[] = [];
  paginador: any;
  clienteSeleccionado: Cliente;

  constructor(private clienteService: ClienteService,
    private activatedRoute: ActivatedRoute,
    private modalService: ModalService) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(
      params => {
        let page = +params.get('page');

        if (!page) {
          page = 0;
        }

        this.clienteService.getClientes(page).subscribe(
          response => {
            this.clientes = response.content as Cliente[];
            this.paginador = response;
          }
        );
      }
    );
      this.modalService.notificarUpload.subscribe(cliente => {
        this.clientes = this.clientes.map(
          clienteOriginal => {
            if(cliente.id == clienteOriginal.id) {
              clienteOriginal.foto = cliente.foto;
            }
            return clienteOriginal;
          }
        )
      })
  }

  delete(cliente: Cliente): void {
    Swal.fire({
      title: '¿Está seguro?',
      text: `¿Seguro que desea eliminar al cliente ${cliente.nombre} ${cliente.apellido}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar.',
      cancelButtonText: 'No, cancelar.'
    }).then((result) => {
      if (result.isConfirmed) {
        this.clienteService.deleteCliente(cliente.id).subscribe(
          res => {

            this.clientes = this.clientes.filter(cli => cli !== cliente)

            Swal.fire(
              'Eliminado!',
              'El cliente ha sido eliminado.',
              'success'
            )
          }
        );
      }
    })
  }

  abrirModal(cliente:Cliente) {
    this.clienteSeleccionado = cliente;
    this.modalService.abrirModal();
  }
}
