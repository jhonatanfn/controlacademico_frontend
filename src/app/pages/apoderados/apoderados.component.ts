import { Component, OnInit } from '@angular/core';
import { Apoderado } from 'src/app/models/apoderado.model';
import { ApoderadoService } from 'src/app/services/apoderado.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-apoderados',
  templateUrl: './apoderados.component.html',
  styleUrls: ['./apoderados.component.css']
})
export class ApoderadosComponent implements OnInit {

  public apoderados:Apoderado[]=[];
  public cargando:boolean= true;
  public titulo:string='Tabla Apoderados';
  public icono:string='bi bi-table';
  public desde:number=0;
  public totalRegistros:number=0;
  public numeropaginas=0;
  public ds:boolean= true;
  public da:boolean=true;


  constructor(private apoderadoService:ApoderadoService) {
  }

  ngOnInit(): void {
    this.listarApoderados();
  }

  controlBotonesPaginacion(){
      if(this.apoderados.length !==5){
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
  
  listarApoderados(){
    this.cargando= true;
    this.apoderadoService.listar(this.desde)
    .subscribe(({apoderados,total})=>{
      this.apoderados=apoderados;
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
      if(this.desde>=this.totalRegistros){
        this.desde -=valor;
      }
    }
    this.listarApoderados();
  }

  eliminarApoderado(apoderado:Apoderado){

    this.apoderadoService.tieneAlumnos(apoderado.id!).subscribe({
      next: ({ok,msg})=>{
        if(ok){
          Swal.fire({
            position: 'top-end',
            icon: 'info',
            title: msg,
            showConfirmButton: false,
            timer: 1500
          })
        }else{
          Swal.fire({
            title: 'Borrar Apoderado',
            text: "Desea borrar a: "+apoderado.persona?.nombres,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Borrar'
          }).then((result) => {
            if (result.isConfirmed) {
              this.apoderadoService.borrar(apoderado.id!)
              .subscribe(({ok,msg})=>{
                if(ok){
                  this.listarApoderados();
                  Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: msg,
                    showConfirmButton: false,
                    timer: 1500
                  })
                }
              })
            }
          })
        }
      }
    })
  }

 

  buscarApoderado(termino:string){

    if(termino.length==0){
      this.listarApoderados();
    }else{
      this.apoderadoService.buscarPorNombres(termino)
      .subscribe((resp:Apoderado[])=>{
        this.apoderados=resp;
        this.totalRegistros=resp.length;
        this.cargando= false;
        this.controlBotonesPaginacion();
      });
    }
    
    /*
    if (this.busqueda == 1) {
      if(termino.length==0){
        this.listarApoderados();
      }else{
        this.apoderadoService.buscarPorDocumento(termino)
        .subscribe((resp:Apoderado[])=>{
          this.apoderados=resp;
          this.totalRegistros=resp.length;
          this.cargando= false;
          this.controlBotonesPaginacion();
        });
      }
    }
    */

 
    
  }

}
