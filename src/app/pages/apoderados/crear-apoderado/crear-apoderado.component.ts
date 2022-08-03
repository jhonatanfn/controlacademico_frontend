import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Apoderado } from 'src/app/models/apoderado.model';
import { Tipodocumento } from 'src/app/models/tipodocumento.model';
import { Usuario } from 'src/app/models/usuario.model';
import { ApoderadoService } from 'src/app/services/apoderado.service';
import { MenuService } from 'src/app/services/menu.service';
import { PersonaService } from 'src/app/services/persona.service';
import { TipodocumentoService } from 'src/app/services/tipodocumento.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-apoderado',
  templateUrl: './crear-apoderado.component.html',
  styleUrls: ['./crear-apoderado.component.css']
})
export class CrearApoderadoComponent implements OnInit {

  public titulo: string = '';
  public icono: string = '';
  public titulo2: string = 'Datos de usuario';
  public icono2: string = 'bi bi-person-check-fill';
  public tipos: Tipodocumento[] = [];
  public apoderadoForm!: FormGroup;
  public formSubmitted: boolean = false;
  public usuarios: Usuario[] = [];
  public repetido: boolean = false;

  constructor(private menuService: MenuService,
    private tipodocuementoService: TipodocumentoService,
    private fb: FormBuilder, private personaService: PersonaService,
    private apoderadoService: ApoderadoService, private router: Router,
    private usuarioService: UsuarioService) {

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
    this.apoderadoForm = this.fb.group({
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
      //nombreusuario: ['', Validators.required],
      //emailusuario: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]]
    });
  }

  campoRequerido(campo: string) {
    if (this.apoderadoForm.get(campo)?.getError('required') && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }
  campoEmail(campo: string) {

    if (this.apoderadoForm.get(campo)?.getError('pattern') && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }
  campoMaxLengh(campo: string, longitud: number) {
    if (this.apoderadoForm.get(campo)?.value === "") {
      return;
    }
    if ((this.apoderadoForm.get(campo)?.getError('maxlength')?.requiredLength == longitud) &&
      this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }
  campoMinLength(campo: string, longitud: number) {
    if (this.apoderadoForm.get(campo)?.value === "") {
      return;
    }
    if ((this.apoderadoForm.get(campo)?.getError('minlength')?.requiredLength == longitud) &&
      this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }
  campoNumeros(campo: string) {
    if (this.apoderadoForm.controls[campo].getError('pattern') && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }

  emailRepetido(campo: string) {

    if (this.apoderadoForm.get('emailusuario')?.value === "") {
      return;
    }
    this.repetido = false;
    if (!this.apoderadoForm.get(campo)?.getError('required') &&
      !this.apoderadoForm.get(campo)?.getError('pattern') && this.formSubmitted) {

      this.usuarios.forEach(usuario => {
        if (usuario.email === this.apoderadoForm.get('emailusuario')?.value) {
          this.repetido = true;
        }
      });
    }
    if (this.repetido) {
      return this.repetido;
    }
    return this.repetido;
  }

  guardarApoderado() {

    this.formSubmitted = true;
    if (this.apoderadoForm.valid  /* && !this.repetido */ ) {

      Swal.fire({
        title: 'Guardar',
        text: "¿Desea crear el apoderado?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Guardar'
      }).then((result) => {
        if (result.isConfirmed) {

          this.personaService.crear(this.apoderadoForm.value)
            .subscribe(({ ok, persona }) => {
              if (ok) {
                let apoderadoObj: any = {
                  personaId: persona.id,
                  nombreusuario: (this.apoderadoForm.get('nombres')?.value).toLowerCase(),
                  //emailusuario: this.apoderadoForm.get('emailusuario')?.value
                }
                this.apoderadoService.crear(apoderadoObj)
                  .subscribe(({ ok, msg }) => {
                    if (ok) {
                      this.router.navigateByUrl('dashboard/apoderados');
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
