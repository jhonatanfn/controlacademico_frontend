import { Component, OnInit } from '@angular/core';
import { Madre } from 'src/app/models/madre.model';
import { MadreService } from 'src/app/services/madre.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-madres',
  templateUrl: './madres.component.html',
  styleUrls: ['./madres.component.css']
})
export class MadresComponent implements OnInit {

  public madres: Madre[] = [];
  public cargando: boolean = true;
  public titulo: string = "Tabla Madres";
  public icono: string = "bi bi-table";
  public desde: number = 0;
  public totalRegistros: number = 0;
  public ds: boolean = true;
  public da: boolean = true;

  constructor(private madreService: MadreService) {
  }
  ngOnInit(): void {
    this.listarMadres();
  }

  listarMadres() {
    this.cargando = true;
    this.madreService.listar(this.desde)
      .subscribe({
        next: ({ ok, madres, total }) => {
          if (ok) {
            this.madres = madres;
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
    this.listarMadres();
  }

  controlBotonesPaginacion() {
    if (this.madres.length !== 5) {
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

  eliminarMadre(madre: Madre) {
    Swal.fire({
      title: 'Borrar Madre',
      text: "Desea borrar a: " + madre.persona?.nombres,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Borrar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.madreService.borrar(madre.id!)
          .subscribe({
            next: ({ ok, msg }) => {
              if (ok) {
                this.listarMadres();
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

  buscarMadre(termino: string) {
    if (termino.length == 0) {
      this.listarMadres();
    } else {
      this.madreService.busqueda(termino)
        .subscribe((resp: Madre[]) => {
          this.madres = resp;
          this.totalRegistros = resp.length;
          this.cargando = false;
          this.controlBotonesPaginacion();
        });
    }
  }

}
