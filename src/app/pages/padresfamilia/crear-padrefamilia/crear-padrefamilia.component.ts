import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Tipodocumento } from 'src/app/models/tipodocumento.model';
import { MadreService } from 'src/app/services/madre.service';
import { PadreService } from 'src/app/services/padre.service';
import { PersonaService } from 'src/app/services/persona.service';
import { TipodocumentoService } from 'src/app/services/tipodocumento.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-padrefamilia',
  templateUrl: './crear-padrefamilia.component.html',
  styleUrls: ['./crear-padrefamilia.component.css']
})
export class CrearPadrefamiliaComponent implements OnInit {

  public titulo: string = 'Nuevo familiar';
  public icono: string = 'bi bi-plus-square';
  public titulo2: string = 'Datos de usuario';
  public icono2: string = 'bi bi-person-check-fill';
  public tipos: Tipodocumento[] = [];
  public familiarForm!: FormGroup;
  public formSubmitted: boolean = false;
  public sexos: any = [
    { id: 1, nombre: "MASCULINO" },
    { id: 2, nombre: "FEMENINO" },
  ];
  public dnirepetido: boolean = false;
  public tipofamilias: any[] = [
    { id: 1, nombre: "PADRE" },
    { id: 2, nombre: "MADRE" },
  ];
  public familiarseleccionado: boolean = false;

  constructor(private tipodocumentoService: TipodocumentoService,
    private fb: FormBuilder, private personaService: PersonaService,
    private padreService: PadreService, private madreService: MadreService,
    private router: Router) {

    this.tipodocumentoService.listar().subscribe({
      next: ({ ok, tipodocumentos }) => {
        if (ok) {
          this.tipos = tipodocumentos;
          this.familiarForm.controls['tipodocumentoId'].setValue(this.tipos[0].id);
        }
      }
    });

  }

  ngOnInit(): void {
    this.familiarForm = this.fb.group({
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
      familiar: ['', Validators.required]
    });
  }

  campoRequerido(campo: string) {
    if (this.familiarForm.get(campo)?.getError('required') && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }
  campoEmail(campo: string) {
    if (this.familiarForm.get(campo)?.getError('pattern') && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }
  seleccionFamiliar() {
    this.familiarseleccionado = false;
    this.validaDNI();
  }
  validaDNI() {

    if (this.familiarForm.get('familiar')?.value) {

      this.familiarseleccionado = false;
      if ((this.familiarForm.get('dni')?.value).length == 8
        && !this.familiarForm.get('dni')?.getError('required')
        && !this.familiarForm.get('dni')?.getError('pattern')) {

        if (this.familiarForm.get('familiar')?.value == 1) {

          this.padreService.searchDNI(this.familiarForm.get('dni')?.value).subscribe({
            next: ({ ok }) => {
              if (ok) {
                this.familiarForm.controls['dni'].setErrors({ error: true });
                this.dnirepetido = true;
              } else {
                this.familiarForm.controls['dni'].setErrors(null);
                this.dnirepetido = false;
              }
            }
          });

        }
        if (this.familiarForm.get('familiar')?.value == 2) {

          this.madreService.searchDNI(this.familiarForm.get('dni')?.value).subscribe({
            next: ({ ok }) => {
              if (ok) {
                this.familiarForm.controls['dni'].setErrors({ error: true });
                this.dnirepetido = true;
              } else {
                this.familiarForm.controls['dni'].setErrors(null);
                this.dnirepetido = false;
              }
            }
          });
        }
      } else {
        this.dnirepetido = false;
      }
    } else {
      this.familiarseleccionado = true;
    }
  }

  campoMaxLengh(campo: string, longitud: number) {
    if (this.familiarForm.get(campo)?.value === "") {
      return;
    }
    if ((this.familiarForm.get(campo)?.getError('maxlength')?.requiredLength == longitud) &&
      this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }
  campoMinLength(campo: string, longitud: number) {
    if (this.familiarForm.get(campo)?.value === "") {
      return;
    }
    if ((this.familiarForm.get(campo)?.getError('minlength')?.requiredLength == longitud) &&
      this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }
  campoNumeros(campo: string) {
    if (this.familiarForm.controls[campo].getError('pattern') && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }
  guardarFamiliar() {
    this.formSubmitted = true;
    if (this.familiarForm.valid) {

      Swal.fire({
        title: 'Guardar',
        text: "¿Desea crear el familiar?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Guardar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.personaService.crear(this.familiarForm.value)
            .subscribe({
              next: ({ ok, persona }) => {
                if (ok) {
                  let familiarObj: any = {
                    personaId: persona.id,
                    nombreusuario: (this.familiarForm.get('nombres')?.value).trim().toLowerCase(),
                    dniusuario: (this.familiarForm.get('dni')?.value).trim(),
                    vive: true
                  }
                  if (this.familiarForm.get('familiar')?.value == 1) {

                    this.padreService.crear(familiarObj).subscribe({
                      next: ({ ok, msg }) => {
                        if (ok) {
                          this.router.navigateByUrl('dashboard/familiares');
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

                  if (this.familiarForm.get('familiar')?.value == 2) {

                    this.madreService.crear(familiarObj).subscribe({
                      next: ({ ok, msg }) => {
                        if (ok) {
                          this.router.navigateByUrl('dashboard/familiares');
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
              }
            });
        }
      })
    }
  }

}
