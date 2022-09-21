import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Tipodocumento } from 'src/app/models/tipodocumento.model';
import { MadreService } from 'src/app/services/madre.service';
import { PersonaService } from 'src/app/services/persona.service';
import { TipodocumentoService } from 'src/app/services/tipodocumento.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-madre',
  templateUrl: './crear-madre.component.html',
  styleUrls: ['./crear-madre.component.css']
})
export class CrearMadreComponent implements OnInit {

  public titulo: string = 'Nueva Madre';
  public icono: string = 'bi bi-plus-square';
  public titulo2: string = 'Datos de usuario';
  public icono2: string = 'bi bi-person-check-fill';
  public tipos: Tipodocumento[] = [];
  public madreForm!: FormGroup;
  public formSubmitted: boolean = false;
  public sexos: any = [
    { id: 1, nombre: "MASCULINO" },
    { id: 2, nombre: "FEMENINO" },
  ];
  public dnirepetido: boolean = false;

  constructor(private tipodocumentoService: TipodocumentoService,
    private fb: FormBuilder, private personaService: PersonaService,
    private madreService: MadreService, private router: Router) {

    this.tipodocumentoService.listar().subscribe({
      next: ({ ok, tipodocumentos }) => {
        if (ok) {
          this.tipos = tipodocumentos;
          this.madreForm.controls['tipodocumentoId'].setValue(this.tipos[0].id);
        }
      }
    });
  }

  ngOnInit(): void {
    this.madreForm = this.fb.group({
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
    if (this.madreForm.get(campo)?.getError('required') && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }
  campoEmail(campo: string) {
    if (this.madreForm.get(campo)?.getError('pattern') && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }
  validaDNI() {
    if ((this.madreForm.get('dni')?.value).length == 8
      && !this.madreForm.get('dni')?.getError('required')
      && !this.madreForm.get('dni')?.getError('pattern')) {
      this.madreService.searchDNI(this.madreForm.get('dni')?.value).subscribe({
        next: ({ ok }) => {
          if (ok) {
            this.madreForm.controls['dni'].setErrors({ error: true });
            this.dnirepetido = true;
          } else {
            this.madreForm.controls['dni'].setErrors(null);
            this.dnirepetido = false;
          }
        }
      });
    } else {
      this.dnirepetido = false;
    }
  }
  campoMaxLengh(campo: string, longitud: number) {
    if (this.madreForm.get(campo)?.value === "") {
      return;
    }
    if ((this.madreForm.get(campo)?.getError('maxlength')?.requiredLength == longitud) &&
      this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }
  campoMinLength(campo: string, longitud: number) {
    if (this.madreForm.get(campo)?.value === "") {
      return;
    }
    if ((this.madreForm.get(campo)?.getError('minlength')?.requiredLength == longitud) &&
      this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }
  campoNumeros(campo: string) {
    if (this.madreForm.controls[campo].getError('pattern') && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }
  guardarMadre() {
    this.formSubmitted = true;
    if (this.madreForm.valid) {
      Swal.fire({
        title: 'Guardar',
        text: "¿Desea crear la madre?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Guardar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.personaService.crear(this.madreForm.value)
            .subscribe({
              next: ({ ok, persona }) => {
                if (ok) {
                  let padreObj: any = {
                    personaId: persona.id,
                    nombreusuario: (this.madreForm.get('nombres')?.value).toLowerCase(),
                  }
                  this.madreService.crear(padreObj).subscribe({
                    next: ({ ok, msg }) => {
                      if (ok) {
                        this.router.navigateByUrl('dashboard/madres');
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
