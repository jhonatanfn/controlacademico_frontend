import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Tipodocumento } from 'src/app/models/tipodocumento.model';
import { PadreService } from 'src/app/services/padre.service';
import { PersonaService } from 'src/app/services/persona.service';
import { TipodocumentoService } from 'src/app/services/tipodocumento.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-padre',
  templateUrl: './crear-padre.component.html',
  styleUrls: ['./crear-padre.component.css']
})
export class CrearPadreComponent implements OnInit {

  public titulo: string = 'Nuevo Padre';
  public icono: string = 'bi bi-plus-square';
  public titulo2: string = 'Datos de usuario';
  public icono2: string = 'bi bi-person-check-fill';
  public tipos: Tipodocumento[] = [];
  public padreForm!: FormGroup;
  public formSubmitted: boolean = false;
  public sexos: any = [
    { id: 1, nombre: "MASCULINO" },
    { id: 2, nombre: "FEMENINO" },
  ];
  public dnirepetido: boolean = false;

  constructor(private tipodocumentoService: TipodocumentoService,
    private fb: FormBuilder, private personaService: PersonaService,
    private padreService: PadreService, private router: Router) {

    this.tipodocumentoService.listar().subscribe({
      next: ({ ok, tipodocumentos }) => {
        if (ok) {
          this.tipos = tipodocumentos;
          this.padreForm.controls['tipodocumentoId'].setValue(this.tipos[0].id);
        }
      }
    });

  }

  ngOnInit(): void {
    this.padreForm = this.fb.group({
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
    if (this.padreForm.get(campo)?.getError('required') && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }
  campoEmail(campo: string) {
    if (this.padreForm.get(campo)?.getError('pattern') && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }
  validaDNI() {
    if ((this.padreForm.get('dni')?.value).length == 8
      && !this.padreForm.get('dni')?.getError('required')
      && !this.padreForm.get('dni')?.getError('pattern')) {
      this.padreService.searchDNI(this.padreForm.get('dni')?.value).subscribe({
        next: ({ ok }) => {
          if (ok) {
            this.padreForm.controls['dni'].setErrors({ error: true });
            this.dnirepetido = true;
          } else {
            this.padreForm.controls['dni'].setErrors(null);
            this.dnirepetido = false;
          }
        }
      });
    } else {
      this.dnirepetido = false;
    }
  }
  campoMaxLengh(campo: string, longitud: number) {
    if (this.padreForm.get(campo)?.value === "") {
      return;
    }
    if ((this.padreForm.get(campo)?.getError('maxlength')?.requiredLength == longitud) &&
      this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }
  campoMinLength(campo: string, longitud: number) {
    if (this.padreForm.get(campo)?.value === "") {
      return;
    }
    if ((this.padreForm.get(campo)?.getError('minlength')?.requiredLength == longitud) &&
      this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }
  campoNumeros(campo: string) {
    if (this.padreForm.controls[campo].getError('pattern') && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }
  guardarPadre() {
    this.formSubmitted = true;
    if (this.padreForm.valid) {
      Swal.fire({
        title: 'Guardar',
        text: "¿Desea crear el padre?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Guardar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.personaService.crear(this.padreForm.value)
            .subscribe({
              next: ({ ok, persona }) => {
                if (ok) {
                  let padreObj: any = {
                    personaId: persona.id,
                    nombreusuario: (this.padreForm.get('nombres')?.value).toLowerCase(),
                  }
                  this.padreService.crear(padreObj).subscribe({
                    next: ({ ok, msg }) => {
                      if (ok) {
                        this.router.navigateByUrl('dashboard/padres');
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
