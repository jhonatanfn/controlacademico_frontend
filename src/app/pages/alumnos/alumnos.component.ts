import { Component, OnInit } from '@angular/core';
import { Alumno } from 'src/app/models/alumno.model';
import { AlumnoService } from 'src/app/services/alumno.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-alumnos',
  templateUrl: './alumnos.component.html',
  styleUrls: ['./alumnos.component.css']
})
export class AlumnosComponent implements OnInit {

  public alumnos: Alumno[] = [];
  public cargando: boolean = true;
  public titulo: string = 'Lista Alumnos';
  public icono: string = 'bi bi-table';
  public desde: number = 0;
  public totalRegistros: number = 0;
  public numeropaginas = 0;
  public ds: boolean = true;
  public da: boolean = true;

  constructor(private alumnoService: AlumnoService) {
  }

  ngOnInit(): void {
    this.listarAlumnos();
  }

  controlBotonesPaginacion() {
    if (this.alumnos.length !== 5) {
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

  listarAlumnos() {
    this.cargando = true;
    this.alumnoService.listar(this.desde)
      .subscribe({
        next: ({ ok, alumnos, total }) => {
          if (ok) {
            this.alumnos = alumnos;
            this.totalRegistros = total;
            this.numeropaginas = Math.ceil(this.totalRegistros / 5);
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
    this.listarAlumnos();
  }

  eliminarAlumno(alumno: Alumno) {
    this.alumnoService.tieneMatricula(alumno.id!).subscribe({
      next: ({ ok, msg }) => {
        if (ok) {
          Swal.fire({
            position: 'top-end',
            icon: 'info',
            title: msg,
            showConfirmButton: false,
            timer: 1500
          })
        } else {
          Swal.fire({
            title: 'Borrar Alumno',
            text: "Desea borrar a: " + alumno.persona?.nombres,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Borrar'
          }).then((result) => {
            if (result.isConfirmed) {
              this.alumnoService.borrar(alumno.id!)
                .subscribe({
                  next: ({ ok, msg }) => {
                    if (ok) {
                      this.listarAlumnos();
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
                      icon: 'error',
                      title: error.msg,
                      showConfirmButton: false,
                      timer: 1500
                    })
                  }
                })
            }
          })
        }
      },
      error: (error) => {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: error.msg,
          showConfirmButton: false,
          timer: 1500
        })
      }
    })
  }

  buscarAlumno(termino: string) {
    if (termino.length == 0) {
      this.listarAlumnos();
    } else {
      this.alumnoService.buscar(termino)
        .subscribe({
          next: (resp: Alumno[]) => {
            this.alumnos = resp;
            this.totalRegistros = resp.length;
            this.cargando = false;
            this.controlBotonesPaginacion();
          },
          error: (error) => {
            Swal.fire({
              position: 'top-end',
              icon: 'error',
              title: error.error.msg,
              showConfirmButton: false,
              timer: 1000
            });
          }
        });
    }
  }

}
