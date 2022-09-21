import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Tipodocumento } from 'src/app/models/tipodocumento.model';
import { DirectorService } from 'src/app/services/director.service';
import { PersonaService } from 'src/app/services/persona.service';
import { TipodocumentoService } from 'src/app/services/tipodocumento.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-director',
  templateUrl: './crear-director.component.html',
  styleUrls: ['./crear-director.component.css']
})
export class CrearDirectorComponent implements OnInit {

  public titulo: string = 'Nuevo Director';
  public icono: string = 'bi bi-plus-square';
  public titulo2: string = 'Datos de usuario';
  public icono2: string = 'bi bi-person-check-fill';
  public tipos: Tipodocumento[] = [];
  public directorForm!: FormGroup;
  public formSubmitted: boolean = false;
  public sexos: any = [
    { id: 1, nombre: "MASCULINO" },
    { id: 2, nombre: "FEMENINO" },
  ];
  public dnirepetido: boolean = false;

  constructor(private tipodocumentoService: TipodocumentoService,
    private fb: FormBuilder, private personaService: PersonaService,
    private directorService: DirectorService, private router: Router) {
    this.tipodocumentoService.listar().subscribe({
      next: ({ ok, tipodocumentos }) => {
        if (ok) {
          this.tipos = tipodocumentos;
          this.directorForm.controls['tipodocumentoId'].setValue(this.tipos[0].id);
        }
      }
    });
  }

  ngOnInit(): void {
    this.directorForm = this.fb.group({
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
      correo: [''],
      observacion: ['']
    });
  }

  campoRequerido(campo: string) {
    if (this.directorForm.get(campo)?.getError('required') && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }
  campoEmail(campo: string) {
    if (this.directorForm.get(campo)?.getError('pattern') && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }
  validaDNI() {
    if ((this.directorForm.get('dni')?.value).length == 8
      && !this.directorForm.get('dni')?.getError('required')
      && !this.directorForm.get('dni')?.getError('pattern')) {
      this.directorService.searchDNI(this.directorForm.get('dni')?.value).subscribe({
        next: ({ ok }) => {
          if (ok) {
            this.directorForm.controls['dni'].setErrors({ error: true });
            this.dnirepetido = true;
          } else {
            this.directorForm.controls['dni'].setErrors(null);
            this.dnirepetido = false;
          }
        }
      });
    } else {
      this.dnirepetido = false;
    }
  }
  campoMaxLengh(campo: string, longitud: number) {
    if (this.directorForm.get(campo)?.value === "") {
      return;
    }
    if ((this.directorForm.get(campo)?.getError('maxlength')?.requiredLength == longitud) &&
      this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }
  campoMinLength(campo: string, longitud: number) {
    if (this.directorForm.get(campo)?.value === "") {
      return;
    }
    if ((this.directorForm.get(campo)?.getError('minlength')?.requiredLength == longitud) &&
      this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }
  campoNumeros(campo: string) {
    if (this.directorForm.controls[campo].getError('pattern') && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }
  guardarDirector() {
    this.formSubmitted = true;
    if (this.directorForm.valid) {
      Swal.fire({
        title: 'Guardar',
        text: "¿Desea crear el director?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Guardar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.personaService.crear(this.directorForm.value)
            .subscribe({
              next: ({ ok, persona }) => {
                if (ok) {
                  let directorObj: any = {
                    personaId: persona.id,
                    observacion: this.directorForm.get('observacion')?.value
                  }
                  this.directorService.crear(directorObj).subscribe({
                    next: ({ ok, msg }) => {
                      if (ok) {
                        this.router.navigateByUrl('dashboard/directores');
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
