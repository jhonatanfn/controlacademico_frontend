import { Component, OnInit } from '@angular/core';
import { Periodo } from 'src/app/models/periodo.model';
import { Programacion } from 'src/app/models/programacion.model';
import { PeriodoService } from 'src/app/services/periodo.service';
import { ProgramacionService } from 'src/app/services/programacion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-programaciones',
  templateUrl: './programaciones.component.html',
  styleUrls: ['./programaciones.component.css']
})
export class ProgramacionesComponent implements OnInit {

  public programaciones:Programacion[]=[];
  public cargando:boolean= true;
  public titulo:string='Tabla Programaciones';
  public icono:string='bi bi-table';
  public desde:number=0;
  public totalRegistros:number=0;
  public numeropaginas=0;
  public ds:boolean= true;
  public da:boolean=true;

  public periodoseleccionado:any="";
  public periodos:Periodo[]=[];

  constructor(
    private programacionService:ProgramacionService,
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
    this.listarProgramaciones();
  }

  controlBotonesPaginacion(){
      if(this.programaciones.length !==5){
        this.ds= true;
      }else{
        this.ds= false;
      }
      if(this.desde===0){
        this.da= true;
      }else{
        this.da= false;
      }
  }
  
  listarProgramaciones(){
    this.cargando= true;

    if(this.periodoseleccionado){
      
      this.programacionService.porPeriodoPaginado(Number(this.periodoseleccionado),this.desde)
      .subscribe({
        next: ({programaciones, total})=>{
          this.programaciones=programaciones;
          this.totalRegistros=total;
          this.numeropaginas= Math.ceil(this.totalRegistros/5);
          this.cargando= false;
          this.controlBotonesPaginacion();
        }
      });
    }else{
      this.programacionService.listar(this.desde)
      .subscribe(({programaciones,total})=>{
        this.programaciones=programaciones;
        this.totalRegistros=total;
        this.numeropaginas= Math.ceil(this.totalRegistros/5);
        this.cargando= false;
        this.controlBotonesPaginacion();
      });
    }

  }

  cambiarPagina(valor:number){
    this.desde += valor;
    if(this.desde<0){
      this.desde=0;
    }else{
      if(this.desde>this.totalRegistros){
        this.desde -=valor;
      }
    }
    this.listarProgramaciones();
  }

  eliminarProgramacion(prog:Programacion){
    
    if(prog.numeromat!>0){
      Swal.fire({
        position: 'top-end',
        icon: 'info',
        title: 'No puede eliminar esta programacion',
        showConfirmButton: false,
        timer: 2500
      })
    }else{
      Swal.fire({
        title: 'Borrar Programación',
        text: "Desea borrar la programación de: "+prog.aula?.nombre,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Borrar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.programacionService.borrar(prog.id!)
          .subscribe(({ok,msg})=>{
            if(ok){
              this.listarProgramaciones();
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: msg,
                showConfirmButton: false,
                timer: 1000
              })
            }
          })
        }
      })
    }
    return true;
  }

  buscarMatriculas(nombre:string){

    if(nombre.length==0){
      this.listarProgramaciones();
    }else{
      this.programacionService.buscarPorDocente(nombre).subscribe((resp:Programacion[])=>{
          this.programaciones=resp;
          this.totalRegistros=resp.length;
          this.numeropaginas= Math.ceil(this.totalRegistros/5);
          this.da= true;
          this.ds= true;
      });
    }


    /*
    if(this.tipobusqueda===1){
      if(nombre.length==0){
        this.listarProgramaciones();
      }else{
        this.programacionService.buscarPorAula(nombre).subscribe((resp:Programacion[])=>{
            this.programaciones=resp;
            this.totalRegistros=resp.length;
            this.numeropaginas= Math.ceil(this.totalRegistros/5);
        });
      }
    }else{
      
    }
    */
  }
}
