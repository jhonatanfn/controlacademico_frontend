import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Apoderado } from 'src/app/models/apoderado.model';
import { Tipodocumento } from 'src/app/models/tipodocumento.model';
import { Usuario } from 'src/app/models/usuario.model';
import { AlumnoService } from 'src/app/services/alumno.service';
import { ApoderadoService } from 'src/app/services/apoderado.service';
import { PersonaService } from 'src/app/services/persona.service';
import { TipodocumentoService } from 'src/app/services/tipodocumento.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-alumno',
  templateUrl: './crear-alumno.component.html',
  styleUrls: ['./crear-alumno.component.css']
})
export class CrearAlumnoComponent implements OnInit {

  public titulo: string = 'Nuevo Alumno';
  public icono: string = 'bi bi-plus-square';
  public titulo2: string = 'Buscar Apoderado';
  public icono2: string = 'bi bi-search';
  public tipos: Tipodocumento[] = [];
  public alumnoForm!: FormGroup;
  public formSubmitted: boolean = false;
  public existeApoderado: boolean = false;
  public mensaje: string = "";
  public apoderadoObj: Apoderado = {};

  public apoderados: Apoderado[] = [];
  selectedApoderado!: any;
  public apoderado_numero: string = "";
  public apoderado_nombres: string = "";
  public apoderado_apellidopaterno: string = "";
  public apoderado_apellidomaterno: string = "";
  public usuarios: Usuario[] = [];
  public repetido: boolean = false;

  constructor(
    private tipodocuementoService: TipodocumentoService,
    private fb: FormBuilder, private personaService: PersonaService,
    private alumnoService: AlumnoService,
    private apoderadoService: ApoderadoService,
    private router: Router, private usuarioService: UsuarioService) {

    this.tipodocuementoService.listar()
      .subscribe(({ tipodocumentos }) => {
        this.tipos = tipodocumentos;
      });

    this.apoderadoService.todo().subscribe({
      next: ({ ok, apoderados }) => {
        if (ok) {
          this.apoderados = apoderados;
        }
      },
      error: (error) => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: error,
          showConfirmButton: false,
          timer: 2500
        })
      }
    });

    this.usuarioService.todo().subscribe({
      next: ({ ok, usuarios }) => {
        if (ok) {
          this.usuarios = usuarios;
        }
      },
      error: (error) => {
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
    this.alumnoForm = this.fb.group({
      tipodocumentoId: ['', Validators.required],
      numero: ['', [Validators.required,
      Validators.maxLength(8),
      Validators.minLength(8),
      Validators.pattern(/^\d+$/)]],
      nombres: ['', [Validators.required, Validators.maxLength(20)]],
      apellidopaterno: ['', [Validators.required, Validators.maxLength(10)]],
      apellidomaterno: ['', [Validators.required, Validators.maxLength(10)]],
      direccion: [''],
      telefono: [''],
      apoderadoId: ['', Validators.required],
      //nombreusuario:['',Validators.required],
      //emailusuario:['',[Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]]
    });
  }

  campoRequerido(campo: string) {
    if (this.alumnoForm.get(campo)?.getError('required') && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }
  campoMaxLengh(campo: string, longitud: number) {
    if (this.alumnoForm.get(campo)?.value === "") {
      return;
    }
    if ((this.alumnoForm.get(campo)?.getError('maxlength')?.requiredLength == longitud) &&
      this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }
  campoMinLength(campo: string, longitud: number) {
    if (this.alumnoForm.get(campo)?.value === "") {
      return;
    }
    if ((this.alumnoForm.get(campo)?.getError('minlength')?.requiredLength == longitud) &&
      this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }
  campoNumeros(campo: string) {
    if (this.alumnoForm.controls[campo].getError('pattern') && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }

  campoEmail(campo: string) {

    if (this.alumnoForm.get(campo)?.getError('pattern') && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }

  emailRepetido(campo: string) {

    if (this.alumnoForm.get('emailusuario')?.value === "") {
      return;
    }
    this.repetido = false;
    if (!this.alumnoForm.get(campo)?.getError('required') &&
      !this.alumnoForm.get(campo)?.getError('pattern') && this.formSubmitted) {

      this.usuarios.forEach(usuario => {
        if (usuario.email === this.alumnoForm.get('emailusuario')?.value) {
          this.repetido = true;
        }
      });
    }
    if (this.repetido) {
      return this.repetido;
    }
    return this.repetido;
  }

  apoderadoSeleccionado() {
    if (this.selectedApoderado) {
      this.existeApoderado = true;
      this.apoderado_numero = this.selectedApoderado[1];
      this.apoderado_nombres = this.selectedApoderado[2];
      this.apoderado_apellidopaterno = this.selectedApoderado[3];
      this.apoderado_apellidomaterno = this.selectedApoderado[4];
      this.alumnoForm.controls['apoderadoId'].setValue(this.selectedApoderado[0]);
    } else {
      this.existeApoderado = false;
      this.selectedApoderado = null;
      this.alumnoForm.controls['apoderadoId'].setValue('');
    }
  }

  guardarAlumno() {
    this.formSubmitted = true;
    if (this.alumnoForm.valid  /* && !this.repetido */) {
      Swal.fire({
        title: 'Guardar',
        text: "¿Desea crear el alumno?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Guardar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.personaService.crear(this.alumnoForm.value)
            .subscribe(({ ok, persona }) => {
              if (ok) {
                let alumnoObj: any = {
                  personaId: persona.id,
                  nombreusuario: (this.alumnoForm.get('nombres')?.value).toLowerCase(),
                  //emailusuario: this.alumnoForm.get('emailusuario')?.value,
                  apoderadoId: this.alumnoForm.get('apoderadoId')?.value
                }
                this.alumnoService.crear(alumnoObj)
                  .subscribe({
                    next: ({ ok, msg }) => {
                      if (ok) {
                        this.router.navigateByUrl('dashboard/alumnos');
                        Swal.fire({
                          position: 'top-end',
                          icon: 'success',
                          title: msg,
                          showConfirmButton: false,
                          timer: 1000
                        });
                      }
                    },
                    error: (error) => {
                      Swal.fire({
                        position: 'top-end',
                        icon: 'error',
                        title: "Se produjo un error. Hable con el administrador",
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
