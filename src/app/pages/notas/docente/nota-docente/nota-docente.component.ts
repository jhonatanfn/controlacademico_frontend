import { Component, OnInit } from '@angular/core';
import { Docente } from 'src/app/models/docente.model';
import { Matricula } from 'src/app/models/matricula.model';
import { Periodo } from 'src/app/models/periodo.model';
import { Programacion } from 'src/app/models/programacion.model';
import { MatriculaService } from 'src/app/services/matricula.service';
import { PeriodoService } from 'src/app/services/periodo.service';
import { ProgramacionService } from 'src/app/services/programacion.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-nota-docente',
  templateUrl: './nota-docente.component.html',
  styleUrls: ['./nota-docente.component.css']
})
export class NotaDocenteComponent implements OnInit {

  public titulo: string = 'Tabla Notas';
  public icono: string = 'bi bi-table';
  public cargando: boolean = true;
  public programaciones: Programacion[] = [];
  public desde: number = 0;
  public totalRegistros: number = 0;
  public numeropaginas = 0;
  public ds: boolean = true;
  public da: boolean = true;
  public docente!: Docente;
  public matriculas:Matricula[]=[];
  public periodoseleccionado:any="";
  public periodos:Periodo[]=[];

  constructor(private usuarioService: UsuarioService,
    private programacionService: ProgramacionService,
    private matriculaService:MatriculaService,
    private periodoService:PeriodoService) {

    this.periodoService.todo().subscribe({
        next: ({ok,periodos})=>{
          if(ok){
            this.periodos=periodos;
          }
        }
    });

  }

  ngOnInit(): void {
    this.usuarioService.docentePorPersona().subscribe(({ok,docente})=>{
      if(ok){
        this.docente=docente;
        this.listarProgramaciones();
      }
    }); 
  }

  controlBotonesPaginacion() {
    if (this.programaciones.length !== 5) {
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

  listarProgramaciones() {
    this.cargando = true;

    if(this.periodoseleccionado){

      this.programacionService.programacionesPorDocentePeriodoPaginado(Number(this.docente.id),
      Number(this.periodoseleccionado), Number(this.desde))
      .subscribe({
        next: ({ok, programaciones, total})=>{
          if(ok){
            this.programaciones = programaciones;
            this.totalRegistros = total;
            this.numeropaginas = Math.ceil(this.totalRegistros / 5);
            this.cargando = false;
            this.controlBotonesPaginacion();
          }
        }
      });

    }else{
      this.programacionService.programacionesPorDocente(Number(this.docente.id),Number(this.desde))
        .subscribe(({ ok, programaciones, total }) => {
          if (ok) {
            this.programaciones = programaciones;
            this.totalRegistros = total;
            this.numeropaginas = Math.ceil(this.totalRegistros / 5);
            this.cargando = false;
            this.controlBotonesPaginacion();
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
    this.listarProgramaciones();
  }

  matriculasProgramacion(programacion: Programacion) {
   this.matriculaService.matriculasPorProgramacion(Number(programacion.id))
   .subscribe(({ok,matriculas})=>{
     if(ok){
       this.matriculas= matriculas;
     }
   })
  }

  buscarProgramaciones(nombre:string){
    
    if(this.periodoseleccionado){

      if(nombre.length==0){
        this.listarProgramaciones();
      }else{
        this.programacionService.buscarProgramacionesDocentePeriodo(nombre,
          Number(this.docente.id),Number(this.periodoseleccionado))
        .subscribe({
          next: (resp:Programacion[])=>{
            this.programaciones=resp;
            this.totalRegistros=resp.length;
            this.numeropaginas= Math.ceil(this.totalRegistros/5);
            this.controlBotonesPaginacion();
          },
          error:(error)=>{
            Swal.fire({
              position: 'top-end',
              icon: 'error',
              title:'Se produjo un error. Hable con el administrador.',
              showConfirmButton: false,
              timer: 1000
            })
          }
        });
      }
    }else{
      if(nombre.length==0){
        this.listarProgramaciones();
      }else{
        this.programacionService.buscarProgramacionesDocente(nombre,Number(this.docente.id))
        .subscribe({
          next: (resp:Programacion[])=>{
            this.programaciones=resp;
            this.totalRegistros=resp.length;
            this.numeropaginas= Math.ceil(this.totalRegistros/5);
            this.controlBotonesPaginacion();
          },
          error:(error)=>{
            Swal.fire({
              position: 'top-end',
              icon: 'error',
              title:'Se produjo un error. Hable con el administrador.',
              showConfirmButton: false,
              timer: 1000
            })
          }
        });
      }
    }

  }

}
