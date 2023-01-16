import { Component, OnInit } from '@angular/core';
import { Auxiliar } from 'src/app/models/auxiliar.model';
import { AuxiliarService } from 'src/app/services/auxiliar.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-auxiliares',
  templateUrl: './auxiliares.component.html',
  styleUrls: ['./auxiliares.component.css']
})
export class AuxiliaresComponent implements OnInit {

  public auxiliares: Auxiliar[] = [];
  public cargando: boolean = true;
  public titulo: string = "Lista Auxiliares";
  public icono: string = "bi bi-table";
  public desde: number = 0;
  public totalRegistros: number = 0;
  public ds: boolean = true;
  public da: boolean = true;

  constructor(private auxiliarService: AuxiliarService) {
  }
  ngOnInit(): void {
    this.listarAuxiliares();
  }

  listarAuxiliares() {
    this.cargando = true;
    this.auxiliarService.listar(this.desde)
      .subscribe(({ auxiliares, total }) => {
        this.auxiliares = auxiliares;
        this.totalRegistros = total;
        this.cargando = false;
        this.controlBotonesPaginacion();
      });
  }

  cambiarPagina(valor: number) {
    this.desde += valor;
    if (this.desde < 0) {
      this.desde = 0;
    } else {
      if (this.desde > this.totalRegistros) {
        this.desde -= valor;
      }
    }
    this.listarAuxiliares();
  }

  controlBotonesPaginacion() {
    if (this.auxiliares.length !== 5) {
      this.ds = true;
    } else {
      this.ds = false;
    }
    if (this.desde === 0) {
      this.da = true;
    } else {
      this.da = false;
    }
  }

  eliminarAuxiliar(auxiliar: Auxiliar) {
    Swal.fire({
      title: 'Borrar Auxiliar',
      text: "Desea borrar a: " + auxiliar.persona?.nombres,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Borrar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.auxiliarService.borrar(auxiliar.id!)
          .subscribe({
            next: ({ ok, msg }) => {
              if (ok) {
                this.listarAuxiliares();
                Swal.fire({
                  position: 'top-end',
                  icon: 'success',
                  title: msg,
                  showConfirmButton: false,
                  timer: 1000
                })
              }
            },
            error: (error) => {
              Swal.fire({
                position: 'top-end',
                icon: 'info',
                title: error.msg,
                showConfirmButton: false,
                timer: 1000
              })
            }
          })
      }
    });
  }

  buscarAuxiliar(termino: string) {
    if (termino.length == 0) {
      this.listarAuxiliares();
    } else {
      this.auxiliarService.buscar(termino)
        .subscribe((resp: Auxiliar[]) => {
          this.auxiliares = resp;
          this.totalRegistros = resp.length;
          this.cargando = false;
          this.controlBotonesPaginacion();
        });
    }
  }

}
