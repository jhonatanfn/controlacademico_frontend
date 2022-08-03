import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators'
import { Tipodocumento } from 'src/app/models/tipodocumento.model';
import { Usuario } from 'src/app/models/usuario.model';
import { DocenteService } from 'src/app/services/docente.service';
import { MenuService } from 'src/app/services/menu.service';
import { PersonaService } from 'src/app/services/persona.service';
import { TipodocumentoService } from 'src/app/services/tipodocumento.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-docente',
  templateUrl: './crear-docente.component.html',
  styleUrls: ['./crear-docente.component.css']
})
export class CrearDocenteComponent implements OnInit {

  public titulo: string = '';
  public icono: string = '';
  public titulo2: string = 'Datos de usuario';
  public icono2: string = 'bi bi-person-check-fill';
  public tipos: Tipodocumento[] = [];
  public docenteForm!: FormGroup;
  public formSubmitted: boolean = false;
  public usuarios:Usuario[]=[];
  public repetido:boolean=  false;

  constructor(private menuService: MenuService,
    private tipodocuementoService: TipodocumentoService,
    private fb: FormBuilder, private personaService: PersonaService,
    private docenteService: DocenteService, private usuarioService:UsuarioService,
    private router:Router) {

    this.menuService.getTituloRuta()
      .subscribe(({ titulo, icono }) => {
        this.titulo = titulo;
        this.icono = icono;
      });

    this.tipodocuementoService.listar()
      .subscribe(({ tipodocumentos }) => {
        this.tipos = tipodocumentos;
    });

    this.usuarioService.todo().subscribe({
      next: ({ok,usuarios})=>{
        if(ok){
          this.usuarios= usuarios;
        }
      },
      error: (error)=>{
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Se produjo un error. Hable con el administrador',
          showConfirmButton: false,
          timer: 1000
        })
      }
    });

  }

  ngOnInit(): void {
    this.docenteForm = this.fb.group({
      tipodocumentoId: ['', Validators.required],
      numero: ['', [
        Validators.required, 
        Validators.maxLength(8), 
        Validators.minLength(8),
        Validators.pattern(/^\d+$/)]
      ],
      nombres: ['', [Validators.required, Validators.maxLength(50)]],
      apellidopaterno: ['', [Validators.required, Validators.maxLength(20)]],
      apellidomaterno: ['', [Validators.required, Validators.maxLength(20)]],
      direccion: [''],
      telefono: [''],
      //nombreusuario:['',Validators.required],
      //emailusuario:['',[Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]]
    });
  }

  campoRequerido(campo: string) {
   
    if (this.docenteForm.get(campo)?.getError('required') && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }
  campoEmail(campo: string){
   
    if (this.docenteForm.get(campo)?.getError('pattern') && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }

  emailRepetido(campo:string){
    
    if(this.docenteForm.get('emailusuario')?.value ===""){
      return;
    }
    this.repetido= false;
    if(!this.docenteForm.get(campo)?.getError('required') && 
      !this.docenteForm.get(campo)?.getError('pattern') && this.formSubmitted){

        this.usuarios.forEach(usuario=>{
          if(usuario.email===this.docenteForm.get('emailusuario')?.value){
            this.repetido=true;
          }
        });
      }
      if(this.repetido){
        return this.repetido; 
      }
      return this.repetido;
  }


  campoMaxLengh(campo: string, longitud: number) {

    if (this.docenteForm.get(campo)?.value === "") {
      return;
    }
    if ((this.docenteForm.get(campo)?.getError('maxlength')?.requiredLength == longitud) &&
      this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }

  campoMinLength(campo: string, longitud: number) {
    if (this.docenteForm.get(campo)?.value === "") {
      return;
    }
    if ((this.docenteForm.get(campo)?.getError('minlength')?.requiredLength == longitud) &&
      this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }

  campoNumeros(campo: string) {
    if(this.docenteForm.controls[campo].getError('pattern') && this.formSubmitted){
      return true;
    }else{
      return false;
    }
  }

  guardarDocente() {
    this.formSubmitted = true;
   
    if (this.docenteForm.valid /*&& !this.repetido */) {
      Swal.fire({
        title: 'Guardar',
        text: "¿Desea crear el docente?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Guardar'
      }).then((result) => {
        if (result.isConfirmed) {

          this.personaService.crear(this.docenteForm.value)
            .subscribe(({ ok, persona }) => {
              if (ok) {
                let docenteObj:any={
                  personaId:persona.id,
                  nombreusuario: (this.docenteForm.get('nombres')?.value).toLowerCase(),
                  //emailusuario: this.docenteForm.get('emailusuario')?.value
                }
                this.docenteService.crear(docenteObj)
                  .subscribe(({ ok, msg }) => {
                    if (ok) {
                      this.router.navigateByUrl('dashboard/docentes');
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
            });
        }
      })
    }
  }
}
