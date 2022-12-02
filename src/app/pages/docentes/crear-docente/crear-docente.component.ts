import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Tipodocumento } from 'src/app/models/tipodocumento.model';
import { DocenteService } from 'src/app/services/docente.service';
import { PersonaService } from 'src/app/services/persona.service';
import { TipodocumentoService } from 'src/app/services/tipodocumento.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-docente',
  templateUrl: './crear-docente.component.html',
  styleUrls: ['./crear-docente.component.css']
})
export class CrearDocenteComponent implements OnInit {

  public titulo: string = 'Nuevo Docente';
  public icono: string = 'bi bi-plus-square';
  public titulo2: string = 'Datos de usuario';
  public icono2: string = 'bi bi-person-check-fill';
  public tipos: Tipodocumento[] = [];
  public docenteForm!: FormGroup;
  public formSubmitted: boolean = false;
  public sexos: any = [
    { id: 1, nombre: "MASCULINO" },
    { id: 2, nombre: "FEMENINO" },
  ];
  public dnirepetido: boolean = false;

  constructor(private tipodocumentoService: TipodocumentoService,
    private fb: FormBuilder, private personaService: PersonaService,
    private docenteService: DocenteService, private router: Router) {
    this.tipodocumentoService.listar().subscribe({
      next: ({ ok, tipodocumentos }) => {
        if (ok) {
          this.tipos = tipodocumentos;
          this.docenteForm.controls['tipodocumentoId'].setValue(this.tipos[0].id);
        }
      }
    });
  }

  ngOnInit(): void {
    this.docenteForm = this.fb.group({
      dni: ['', [
        Validators.required,
        Validators.maxLength(8),
        Validators.minLength(8),
        Validators.pattern(/^\d+$/)]
      ],
      nombres: ['', [Validators.required, Validators.maxLength(50)]],
      apellidopaterno: ['', [Validators.required, Validators.maxLength(20)]],
      apellidomaterno: ['', [Validators.required, Validators.maxLength(20)]],
      sexo: ['', Validators.required],
      tipodocumentoId: ['', Validators.required],
      domicilio: [''],
      telefono: [''],
      nacionalidad: [''],
      distrito: [''],
      fechanacimiento: ['', Validators.required],
      correo: ['']
    });
  }

  campoRequerido(campo: string) {
    if (this.docenteForm.get(campo)?.getError('required') && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }
  campoEmail(campo: string) {
    if (this.docenteForm.get(campo)?.getError('pattern') && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }
  validaDNI() {
    if ((this.docenteForm.get('dni')?.value).length == 8
      && !this.docenteForm.get('dni')?.getError('required')
      && !this.docenteForm.get('dni')?.getError('pattern')) {
      this.docenteService.searchDNI(this.docenteForm.get('dni')?.value).subscribe({
        next: ({ ok }) => {
          if (ok) {
            this.docenteForm.controls['dni'].setErrors({ error: true });
            this.dnirepetido = true;
          } else {
            this.docenteForm.controls['dni'].setErrors(null);
            this.dnirepetido = false;
          }
        }
      });
    } else {
      this.dnirepetido = false;
    }
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
    if (this.docenteForm.controls[campo].getError('pattern') && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }
  guardarDocente() {
    this.formSubmitted = true;
    if (this.docenteForm.valid) {
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
            .subscribe({
              next: ({ ok, persona }) => {
                if (ok) {
                  let docenteObj: any = {
                    personaId: persona.id,
                    nombreusuario: (this.docenteForm.get('nombres')?.value).trim().toLowerCase(),
                    dniusuario: (this.docenteForm.get('dni')?.value).trim(),
                  }
                  this.docenteService.crear(docenteObj).subscribe({
                    next: ({ ok, msg }) => {
                      if (ok) {
                        this.router.navigateByUrl('dashboard/docentes');
                        Swal.fire({
                          position: 'top-end',
                          icon: 'success',
                          title: msg,
                          showConfirmButton: false,
                          timer: 1000
                        });
                      }
                    }
                  });
                }
              }
            });
        }
      })
    }
  }
}
