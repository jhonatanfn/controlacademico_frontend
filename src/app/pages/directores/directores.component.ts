import { Component, OnInit } from '@angular/core';
import { Director } from 'src/app/models/director.model';
import { DirectorService } from 'src/app/services/director.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-directores',
  templateUrl: './directores.component.html',
  styleUrls: ['./directores.component.css']
})
export class DirectoresComponent implements OnInit {

  public directores: Director[] = [];
  public cargando: boolean = true;
  public titulo: string = "Lista Directores";
  public icono: string = "bi bi-table";
  public desde: number = 0;
  public totalRegistros: number = 0;
  public ds: boolean = true;
  public da: boolean = true;

  constructor(private directorService: DirectorService) {
  }
  ngOnInit(): void {
    this.listarDirectores();
  }

  listarDirectores() {
    this.cargando = true;
    this.directorService.listar(this.desde)
      .subscribe(({ directores, total }) => {
        this.directores = directores;
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
    this.listarDirectores();
  }

  controlBotonesPaginacion() {
    if (this.directores.length !== 5) {
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

  eliminarDirector(director: Director) {
    Swal.fire({
      title: 'Borrar Director',
      text: "Desea borrar a: " + director.persona?.nombres,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Borrar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.directorService.borrar(director.id!)
          .subscribe({
            next: ({ ok, msg }) => {
              if (ok) {
                this.listarDirectores();
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
                timer: 1000
              })
            }
          });
      }
    });
  }

  buscarDirector(termino: string) {
    if (termino.length == 0) {
      this.listarDirectores();
    } else {
      this.directorService.buscar(termino)
        .subscribe((resp: Director[]) => {
          this.directores = resp;
          this.totalRegistros = resp.length;
          this.cargando = false;
          this.controlBotonesPaginacion();
        });
    }
  }

}
