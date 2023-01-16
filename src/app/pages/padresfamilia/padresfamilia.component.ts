import { Component, OnInit } from '@angular/core';
import { Madre } from 'src/app/models/madre.model';
import { Padre } from 'src/app/models/padre.model';
import { MadreService } from 'src/app/services/madre.service';
import { PadreService } from 'src/app/services/padre.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-padresfamilia',
  templateUrl: './padresfamilia.component.html',
  styleUrls: ['./padresfamilia.component.css']
})
export class PadresfamiliaComponent implements OnInit {

  public titulo: string = "Lista Familiares";
  public icono: string = "bi bi-table";
  public desde: number = 0;
  public totalRegistros: number = 0;
  public ds: boolean = true;
  public da: boolean = true;
  public padres: Padre[] = [];
  public madres: Madre[] = [];
  public cargando: boolean = true;
  public padresfamilia: any[] = [];
  public tipos: any[] = [
    { id: 1, nombre: "PADRE" },
    { id: 2, nombre: "MADRE" },
  ];
  public tiposeleccionado: any = 1;

  constructor(private padreService: PadreService, private madreService: MadreService) { }

  ngOnInit(): void {
    this.listarPadresfamilia();
  }

  listarPadresfamilia() {
    this.cargando = false;
    if (this.tiposeleccionado == 1) {
      this.padreService.listar(this.desde).subscribe({
        next: ({ ok, padres, total }) => {
          if (ok) {
            this.padresfamilia = padres;
            this.totalRegistros = total;
            this.cargando = false;
            this.controlBotonesPaginacion();
          }
        }
      });
    }
    if (this.tiposeleccionado == 2) {
      this.madreService.listar(this.desde).subscribe({
        next: ({ ok, madres, total }) => {
          if (ok) {
            this.padresfamilia = madres;
            this.totalRegistros = total;
            this.cargando = false;
            this.controlBotonesPaginacion();
          }
        }
      });
    }
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
    this.listarPadresfamilia();
  }

  controlBotonesPaginacion() {
    if (this.padresfamilia.length !== 5) {
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


  buscarPadrefamilia(termino: string) {

    if (this.tiposeleccionado == 1) {
      if (termino.length == 0) {
        this.listarPadresfamilia();
      } else {
        this.padreService.busqueda(termino)
          .subscribe((resp: Padre[]) => {
            this.padresfamilia = resp;
            this.totalRegistros = resp.length;
            this.cargando = false;
            this.controlBotonesPaginacion();
          });
      }
    }

    if (this.tiposeleccionado == 2) {
      if (termino.length == 0) {
        this.listarPadresfamilia();
      } else {
        this.madreService.busqueda(termino)
          .subscribe((resp: Madre[]) => {
            this.padresfamilia = resp;
            this.totalRegistros = resp.length;
            this.cargando = false;
            this.controlBotonesPaginacion();
          });
      }
    }
  }

  eliminarPadrefamilia(padresfamilia: any) {
    
    Swal.fire({
      title: 'Borrar',
      text: "Desea borrar a: " + padresfamilia.persona?.nombres,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Borrar'
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.tiposeleccionado == 1) {
          this.padreService.borrar(padresfamilia.id!)
            .subscribe({
              next: ({ ok, msg }) => {
                if (ok) {
                  this.listarPadresfamilia();
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
            });
        }
        if (this.tiposeleccionado == 2) {
          this.madreService.borrar(padresfamilia.id!)
            .subscribe({
              next: ({ ok, msg }) => {
                if (ok) {
                  this.listarPadresfamilia();
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
            });
        }
      }
    });
  }

}
