import { Component, OnInit } from '@angular/core';
import { Padre } from 'src/app/models/padre.model';
import { PadreService } from 'src/app/services/padre.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-padres',
  templateUrl: './padres.component.html',
  styleUrls: ['./padres.component.css']
})
export class PadresComponent implements OnInit {

  public padres: Padre[] = [];
  public cargando: boolean = true;
  public titulo: string = "Tabla Padres";
  public icono: string = "bi bi-table";
  public desde: number = 0;
  public totalRegistros: number = 0;
  public ds: boolean = true;
  public da: boolean = true;

  constructor(private padreService: PadreService) {
  }
  ngOnInit(): void {
    this.listarPadres();
  }

  listarPadres() {
    this.cargando = true;
    this.padreService.listar(this.desde)
      .subscribe({
        next: ({ ok, padres, total }) => {
          if (ok) {
            this.padres = padres;
            this.totalRegistros = total;
            this.cargando = false;
            this.controlBotonesPaginacion();
          }
        }
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
    this.listarPadres();
  }

  controlBotonesPaginacion() {
    if (this.padres.length !== 5) {
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

  eliminarPadre(padre: Padre) {
    Swal.fire({
      title: 'Borrar Padre',
      text: "Desea borrar a: " + padre.persona?.nombres,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Borrar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.padreService.borrar(padre.id!)
          .subscribe({
            next: ({ ok, msg }) => {
              if (ok) {
                this.listarPadres();
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
                title: error.error.msg,
                showConfirmButton: false,
                timer: 1000
              })
            }
          })
      }
    });
  }

  buscarPadre(termino: string) {
    if (termino.length == 0) {
      this.listarPadres();
    } else {
      this.padreService.busqueda(termino)
        .subscribe((resp: Padre[]) => {
          this.padres = resp;
          this.totalRegistros = resp.length;
          this.cargando = false;
          this.controlBotonesPaginacion();
        });
    }
  }
  
}
