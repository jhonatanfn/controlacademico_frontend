import { Component, OnInit } from '@angular/core';
import { Area } from 'src/app/models/area.model';
import { Matricula } from 'src/app/models/matricula.model';
import { Subarea } from 'src/app/models/subarea.model';
import { AreaService } from 'src/app/services/area.service';
import { MatriculaService } from 'src/app/services/matricula.service';
import { MenuService } from 'src/app/services/menu.service';
import { SubareaService } from 'src/app/services/subarea.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-matriculas',
  templateUrl: './matriculas.component.html',
  styleUrls: ['./matriculas.component.css']
})
export class MatriculasComponent implements OnInit {

  public matriculas: Matricula[] = [];
  public cargando: boolean = true;
  public titulo: string = 'Tabla Matriculas';
  public icono: string = 'bi bi-table';
  public desde: number = 0;
  public totalRegistros: number = 0;
  public numeropaginas = 0;
  public ds: boolean = true;
  public da: boolean = true;

  public areas: Area[] = [];
  public subareas: Subarea[] = [];
  public areaseleccionada: any = "";
  public subareaseleccionada:any="";

  constructor(private matriculaService: MatriculaService,
    private areaService: AreaService, private subareaService: SubareaService) {

    this.areaService.todo().subscribe({
      next: ({ ok, areas }) => {
        if (ok) {
          this.areas = areas;
        }
      }
    });
  }

  ngOnInit(): void {
    this.listarMatriculas();
  }

  subareasPorArea(){
    this.subareaService.porArea(this.areaseleccionada)
    .subscribe({
      next: ({ok,subareas})=>{
        if(ok){
          this.subareaseleccionada="";
          this.subareas=subareas;
        }
      }
    });
  }


  controlBotonesPaginacion() {
    if (this.matriculas.length !== 5) {
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

  listarMatriculas() {
    this.cargando = true;
    if(this.areaseleccionada && this.subareaseleccionada){
      this.matriculaService.matriculasPorSubarea(this.desde,Number(this.subareaseleccionada))
      .subscribe({
        next: ({ok,matriculas, total})=>{
          if(ok){
            this.matriculas=matriculas;
            this.totalRegistros = total;
            this.numeropaginas = Math.ceil(this.totalRegistros / 5);
            this.cargando = false;
            this.controlBotonesPaginacion();
          }
        }
      })
    }else{
    this.matriculaService.listar(this.desde)
      .subscribe(({ matriculas, total }) => {
        this.matriculas = matriculas;
        this.totalRegistros = total;
        this.numeropaginas = Math.ceil(this.totalRegistros / 5);
        this.cargando = false;
        this.controlBotonesPaginacion();
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
    this.listarMatriculas();
  }

  buscarMatriculas(termino: string) {

    if(this.areaseleccionada && this.subareaseleccionada){
      if(termino.length ==0){
        this.listarMatriculas();
      }else{
        this.matriculaService.buscarPorAlumnoSubarea(termino, Number(this.subareaseleccionada))
        .subscribe((resp: Matricula[]) => {
          this.matriculas = resp;
          this.totalRegistros = resp.length;
          this.cargando = false;
          this.controlBotonesPaginacion();
        });
      }
    }else{
      if (termino.length == 0) {
        this.listarMatriculas();
      } else {
        this.matriculaService.buscarPorAlumno(termino).subscribe((resp: Matricula[]) => {
          this.matriculas = resp;
          this.totalRegistros = resp.length;
          this.cargando = false;
          this.controlBotonesPaginacion();
        });
      }
    }
    
  }

  eliminarMatricula(matricula: Matricula) {

    Swal.fire({
      title: 'Eliminar',
      text: "¿Desea eliminar la matricula de: " + matricula.alumno?.persona?.nombres,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {

        this.matriculaService.borrar(Number(matricula.id)).subscribe(({ ok, msg }) => {
          if (ok) {
            this.listarMatriculas();
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: msg,
              showConfirmButton: false,
              timer: 2500
            });
          }
        });

      }
    })


  }
}
