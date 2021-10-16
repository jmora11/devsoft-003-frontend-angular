import { Component, Input, OnInit } from '@angular/core';
import { Cliente } from '../cliente';
import { ClienteService } from '../clientes.service';
import Swal from 'sweetalert2';
import { HttpEventType } from '@angular/common/http';
import { ModalService } from './modal.service';
import { AuthService } from 'src/app/usuarios/auth.service';
import { FacturasService } from 'src/app/facturas/services/facturas.service';
import { Factura } from 'src/app/facturas/models/factura';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {

  @Input() cliente: Cliente;
  titulo: string = "Detalle del cliente";
  fotoSeleccionada: File;
  progreso: number = 0;
  
  constructor(private clienteService: ClienteService,
    public modalService: ModalService,
    public authService: AuthService,
    private facturaService: FacturasService) { }

  ngOnInit(): void {
  }

  seleccionarFoto(event){
    this.fotoSeleccionada = event.target.files[0];
    this.progreso = 0;
    if(this.fotoSeleccionada.type.indexOf('image') < 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error al subir foto',
        text: `El archivo debe ser de tipo imagen`
      })
      this.fotoSeleccionada = null;
    }
  }

  subirFoto(){

    if(!this.fotoSeleccionada) {
      Swal.fire({
        icon: 'error',
        title: 'Error al subir foto',
        text: `Debe seleccionar una foto`
      })
    }
    this.clienteService.subirFoto(this.fotoSeleccionada, this.cliente.id).subscribe(
      event => {
        if(event.type === HttpEventType.UploadProgress) {
          this.progreso = Math.round((event.loaded / event.total) * 100)
        } else if(event.type === HttpEventType.Response) {
          let response: any = event.body;
          this.cliente = response.cliente as Cliente;
          
          this.modalService.notificarUpload.emit(this.cliente);
          
          Swal.fire({
            icon: 'success',
            title: 'Subir foto',
            text: `La foto se ha subido con éxito`
          })
        }
      }
    )
  }

  cerrarModal(){
    this.modalService.cerrarModal();
    this.fotoSeleccionada = null;
    this.progreso = 0;
  }

  eliminar(factura: Factura): void {
    Swal.fire({
      title: '¿Está seguro?',
      text: `¿Seguro que desea eliminar la factura?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar.',
      cancelButtonText: 'No, cancelar.'
    }).then((result) => {
      if (result.isConfirmed) {
        this.facturaService.delete(factura.id).subscribe(
          res => {

            this.cliente.facturas = this.cliente.facturas.filter(f => f !== factura)

            Swal.fire(
              'Eliminada!',
              'La factura ha sido eliminada.',
              'success'
            )
          }
        );
      }
    })
  }
}
