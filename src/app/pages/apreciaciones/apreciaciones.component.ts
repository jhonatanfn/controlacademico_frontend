import { Component, OnInit } from '@angular/core';
import { Apreciacion } from 'src/app/models/apreciacion.model';
import { ApreciacionService } from 'src/app/services/apreciacion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-apreciaciones',
  templateUrl: './apreciaciones.component.html',
  styleUrls: ['./apreciaciones.component.css']
})
export class ApreciacionesComponent implements OnInit {

  public apreciaciones: Apreciacion[] = [];
  public cargando: boolean = true;
  public titulo: string = 'Lista Apreciaciones';
  public icono: string = 'bi bi-table';
  public desde: number = 0;
  public totalRegistros: number = 0;
  public numeropaginas = 0;
  public ds: boolean = true;
  public da: boolean = true;
  public formSubmitted: boolean = false;
  
  constructor(private apreciacionService: ApreciacionService) {
  }

  ngOnInit(): void {
    this.listarApreciaciones();
  }

  controlBotonesPaginacion() {
    if (this.apreciaciones.length !== 5) {
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

  listarApreciaciones() {
    this.cargando = true;
    this.apreciacionService.listar(this.desde)
      .subscribe(({ apreciaciones, total }) => {
        this.apreciaciones = apreciaciones;
        this.totalRegistros = total;
        this.numeropaginas = Math.ceil(this.totalRegistros / 5);
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
    this.listarApreciaciones();
  }

  eliminarApreciacion(apreciacion: Apreciacion) {

    Swal.fire({
      title: 'Borrar Apreciacion',
      text: "Desea borrar a: " + apreciacion.alumno?.persona?.nombres,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Borrar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.apreciacionService.borrar(apreciacion.id!)
          .subscribe(({ ok, msg }) => {
            if (ok) {
              this.listarApreciaciones();
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: msg,
                showConfirmButton: false,
                timer: 1000
              })
            }
          });
      }
    });
  }

  buscarApreciacion(termino: string) {
    if (termino.length == 0) {
      this.listarApreciaciones();
    } else {
      this.apreciacionService.buscar(termino)
        .subscribe((resp: Apreciacion[]) => {
          this.apreciaciones = resp;
          this.totalRegistros = resp.length;
          this.cargando = false;
          this.controlBotonesPaginacion();
        });
    }
  }
}
