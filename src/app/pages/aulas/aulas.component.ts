import { Component, OnInit } from '@angular/core';
import { Aula } from 'src/app/models/aula.model';
import { AulaService } from 'src/app/services/aula.service';
import { MenuService } from 'src/app/services/menu.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-aulas',
  templateUrl: './aulas.component.html',
  styleUrls: ['./aulas.component.css']
})
export class AulasComponent implements OnInit {

  public aulas:Aula[]=[];
  public cargando:boolean= true;
  public titulo:string='';
  public icono:string='';
  public desde:number=0;
  public totalRegistros:number=0;
  public numeropaginas=0;
  public ds:boolean= true;
  public da:boolean=true;

  constructor(private menuService:MenuService,private aulaService:AulaService) {
    this.menuService.getTituloRuta()
    .subscribe(({titulo,icono})=>{
      this.titulo=titulo;
      this.icono=icono;
    });
  }

  ngOnInit(): void {
    this.listarAulas();
  }

  controlBotonesPaginacion(){
      if(this.aulas.length !==5){
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
  
  listarAulas(){
    this.cargando= true;
    this.aulaService.listar(this.desde)
    .subscribe(({aulas,total})=>{
      this.aulas=aulas;
      this.totalRegistros=total;
      this.numeropaginas= Math.ceil(this.totalRegistros/5);
      this.cargando= false;
      this.controlBotonesPaginacion();
    });
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
    this.listarAulas();
  }

  eliminarAula(aula:Aula){

    this.aulaService.tieneProgramaciones(aula.id!)
    .subscribe({
      next: ({ok,msg})=>{
        if(ok){
          Swal.fire({
            position: 'top-end',
            icon: 'info',
            title: msg,
            showConfirmButton: false,
            timer: 1000
          })
        }else{
          Swal.fire({
            title: 'Borrar Aula',
            text: "Desea borrar a: "+aula.nombre,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Borrar'
          }).then((result) => {
            if (result.isConfirmed) {
              this.aulaService.borrar(aula.id!)
              .subscribe(({ok,msg})=>{
                if(ok){
                  this.listarAulas();
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
      }
    })
  }

  buscarAula(termino:string){
    if(termino.length==0){
      this.listarAulas();
    }else{
      this.aulaService.buscarPorNombre(termino)
      .subscribe((resp:Aula[])=>{
        this.aulas=resp;
        this.totalRegistros=resp.length;
        this.cargando= false;
        this.controlBotonesPaginacion();
      });
    }
  }

}
