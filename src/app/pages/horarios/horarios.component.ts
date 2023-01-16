import { Component, OnInit } from '@angular/core';
import { Aula } from 'src/app/models/aula.model';
import { Horario } from 'src/app/models/horario.model';
import { Periodo } from 'src/app/models/periodo.model';
import { AulaService } from 'src/app/services/aula.service';

@Component({
  selector: 'app-horarios',
  templateUrl: './horarios.component.html',
  styleUrls: ['./horarios.component.css']
})
export class HorariosComponent implements OnInit {

  public horarios: Horario[] = [];
  public cargando: boolean = true;
  public titulo: string = 'Lista Horarios';
  public icono: string = 'bi bi-table';
  public desde: number = 0;
  public totalRegistros: number = 0;
  public ds: boolean = true;
  public da: boolean = true;
  public periodoseleccionado: any = "";
  public periodos: Periodo[] = [];
  public aulas: Aula[] = [];

  constructor(
    private aulaService: AulaService) {
  }

  ngOnInit(): void {
    this.listarAulas();
  }

  listarAulas() {
    this.cargando = true;
    this.aulaService.listar(this.desde).subscribe({
      next: ({ ok, aulas, total }) => {
        if (ok) {
          this.aulas = aulas;
          this.totalRegistros = total;
          this.cargando = false;
          this.controlBotonesPaginacion();
        }
      }
    })
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
    this.listarAulas();
  }

  controlBotonesPaginacion() {
    if (this.aulas.length !== 5) {
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



  eliminarHorario(aula: Aula) {

    /*
    Swal.fire({
      title: 'Borrar Horario',
      text: "Desea borrar el horario de : " + aula.nombre,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Borrar'
    }).then((result) => {
      if (result.isConfirmed) {

      }
    });
    */
  }

  buscarAula(termino: string) {
    if (termino.length == 0) {
      this.listarAulas();
    } else {
      this.aulaService.buscarAulas(termino)
        .subscribe((resp: Aula[]) => {
          this.aulas = resp;
          this.totalRegistros = resp.length;
          this.controlBotonesPaginacion();
        });
    }

  }

}
