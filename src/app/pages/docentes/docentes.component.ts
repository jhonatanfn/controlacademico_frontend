import { Component, OnInit } from '@angular/core';
import { Docente } from 'src/app/models/docente.model';
import { DocenteService } from 'src/app/services/docente.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-docentes',
  templateUrl: './docentes.component.html',
  styleUrls: ['./docentes.component.css']
})
export class DocentesComponent implements OnInit {

  public docentes: Docente[] = [];
  public cargando: boolean = true;
  public titulo:string="Tabla Docentes";
  public icono:string="bi bi-table";
  public desde: number = 0;
  public totalRegistros: number = 0;
  public ds: boolean = true;
  public da: boolean = true;

  constructor(private docenteService: DocenteService) {
  }
  ngOnInit(): void {
    this.listarDocentes();
  }

  listarDocentes() {
    this.cargando = true;
    this.docenteService.listar(this.desde)
      .subscribe(({ docentes, total }) => {
        this.docentes = docentes;
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
    this.listarDocentes();
  }

  controlBotonesPaginacion() {
    if (this.docentes.length !== 5) {
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

  eliminarDocente(docente: Docente) {

    this.docenteService.tieneProgramacion(docente.id!)
      .subscribe({
        next: ({ ok, msg }) => {
          if (ok) {
            Swal.fire({
              position: 'top-end',
              icon: 'info',
              title: msg,
              showConfirmButton: false,
              timer: 1500
            });
          } else {
            Swal.fire({
              title: 'Borrar Docente',
              text: "Desea borrar a: " + docente.persona?.nombres,
              icon: 'question',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              cancelButtonText: 'Cancelar',
              confirmButtonText: 'Borrar'
            }).then((result) => {
              if (result.isConfirmed) {
                this.docenteService.borrar(docente.id!)
                  .subscribe({
                    next: ({ ok, msg }) => {
                      if (ok) {
                        this.listarDocentes();
                        Swal.fire({
                          position: 'top-end',
                          icon: 'success',
                          title: msg,
                          showConfirmButton: false,
                          timer: 1500
                        })
                      }
                    },
                    error: (error) => {
                      Swal.fire({
                        position: 'top-end',
                        icon: 'info',
                        title: error.msg,
                        showConfirmButton: false,
                        timer: 2500
                      })
                    }
                  })
              }
            });
          }
        }
      });
  }

  buscarDocente(termino: string) {
    if (termino.length == 0) {
      this.listarDocentes();
    } else {
      this.docenteService.buscarNombres(termino)
        .subscribe((resp: Docente[]) => {
          this.docentes = resp;
          this.totalRegistros = resp.length;
          this.cargando = false;
          this.controlBotonesPaginacion();
        });
    }
  }
}
