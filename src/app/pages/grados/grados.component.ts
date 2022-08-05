import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Grado } from 'src/app/models/grado.model';
import { GradoService } from 'src/app/services/grado.service';
import { MenuService } from 'src/app/services/menu.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-grados',
  templateUrl: './grados.component.html',
  styleUrls: ['./grados.component.css']
})
export class GradosComponent implements OnInit {

  public grados:Grado[]=[];
  public cargando:boolean= true;
  public titulo:string='Tabla Grados';
  public icono:string='bi bi-table';
  public desde:number=0;
  public totalRegistros:number=0;
  public numeropaginas=0;
  public ds:boolean= true;
  public da:boolean=true;

  public gradoForm!:FormGroup;
  public formSubmitted:boolean= false;
  public boton:string="";
  public isSave:boolean=true;
  public titulogrado:string="";

  @ViewChild('closebutton') closebutton:any;

  constructor(private gradoService:GradoService, private fb:FormBuilder) {
  }

  ngOnInit(): void {
    this.listarGrados();
    this.gradoForm= this.fb.group({
      gradoId:[''],
      nombre:['',[Validators.required,Validators.maxLength(30)]]
     });
  }

  campoRequerido(campo: string) {
    if (this.gradoForm.get(campo)?.getError('required') && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }
  campoMaxLengh(campo: string, longitud: number) {
    if (this.gradoForm.get(campo)?.value === "") {
      return;
    }
    if ((this.gradoForm.get(campo)?.getError('maxlength')?.requiredLength == longitud) &&
      this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }

  controlBotonesPaginacion(){
      if(this.grados.length !==5){
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
  
  listarGrados(){
    this.cargando= true;
    this.gradoService.listar(this.desde)
    .subscribe(({grados,total})=>{
      this.grados=grados;
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
    this.listarGrados();
  }

  crearGrado(){
    this.formSubmitted= false;
    this.gradoForm.controls['nombre'].setValue('');
    this.boton="Guardar";
    this.isSave= true;
    this.titulogrado="Nuevo Grado";
  }

  guardarGrado(){

    this.formSubmitted= true;

      if(this.gradoForm.valid){

        if(this.isSave){
          this.gradoService.crear(this.gradoForm.value)
          .subscribe(({ok,msg})=>{
            if(ok){
              this.closebutton.nativeElement.click();
              this.listarGrados();
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: msg,
                showConfirmButton: false,
                timer: 1000
              })
            }
          },(error)=>{
            Swal.fire({
              position: 'top-end',
              icon: 'error',
              title: error.error.msg,
              showConfirmButton: false,
              timer: 1500
            })
          })
        }else{

         this.gradoService.actualizar(this.gradoForm.get('gradoId')?.value,this.gradoForm.value)
         .subscribe(({ok,msg})=>{
           if(ok){
            this.closebutton.nativeElement.click();
            this.listarGrados();
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: msg,
              showConfirmButton: false,
              timer: 1000
            })
           }
         },(error)=>{
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: error.error.msg,
            showConfirmButton: false,
            timer: 1000
          })
         })
        }
      }
  }

  eliminarGrado(grado:Grado){
    
    this.gradoService.tieneAulas(grado.id!)
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
            title: 'Borrar Grado',
            text: "Desea borrar a: "+grado.nombre,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Borrar'
          }).then((result) => {
            if (result.isConfirmed) {
              this.gradoService.borrar(grado.id!)
              .subscribe(({ok,msg})=>{
                if(ok){
                  this.listarGrados();
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

  editarGrado(grado:Grado){
    this.gradoForm.controls['gradoId'].setValue(grado.id);
    this.gradoForm.controls['nombre'].setValue(grado.nombre.toUpperCase());
    this.boton="Actualizar";
    this.isSave= false;
    this.titulogrado= "Editar Grado";
  }

  buscarGrado(termino:string){
    if(termino.length==0){
      this.listarGrados();
    }else{
      this.gradoService.buscarPorNombre(termino)
      .subscribe((resp:Grado[])=>{
        this.grados=resp;
        this.totalRegistros=resp.length;
        this.cargando= false;
        this.controlBotonesPaginacion();
      });
    }
  }

}
