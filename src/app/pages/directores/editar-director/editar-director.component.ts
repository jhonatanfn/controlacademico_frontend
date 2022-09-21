import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Director } from 'src/app/models/director.model';
import { Tipodocumento } from 'src/app/models/tipodocumento.model';
import { DirectorService } from 'src/app/services/director.service';
import { PersonaService } from 'src/app/services/persona.service';
import { TipodocumentoService } from 'src/app/services/tipodocumento.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-director',
  templateUrl: './editar-director.component.html',
  styleUrls: ['./editar-director.component.css']
})
export class EditarDirectorComponent implements OnInit {

  public titulo: string = 'Editar Director';
  public icono: string = 'bi bi-pen';
  public tipos: Tipodocumento[] = [];
  public directorForm!: FormGroup;
  public formSubmitted: boolean = false;
  public director!: Director;
  public sexos: any = [
    { id: 1, nombre: "MASCULINO" },
    { id: 2, nombre: "FEMENINO" },
  ];
  public vigentes: any = [
    { id: 1, nombre: "SI" },
    { id: 2, nombre: "NO" },
  ];
  public dnirepetido: boolean = false;
  public dniusuarioeditar: string = "";

  constructor(
    private tipodocuementoService: TipodocumentoService,
    private fb: FormBuilder, private personaService: PersonaService,
    private directorService: DirectorService,
    private route: ActivatedRoute,private router: Router) {
    this.tipodocuementoService.listar()
      .subscribe(({ tipodocumentos }) => {
        this.tipos = tipodocumentos;
      });
    this.directorService.obtener(Number(this.route.snapshot.paramMap.get('id')))
      .subscribe(({ ok, director }) => {
        if (ok) {
          this.directorForm.controls['dni'].setValue(director.persona?.dni);
          this.directorForm.controls['nombres'].setValue(director.persona?.nombres);
          this.directorForm.controls['apellidopaterno'].setValue(director.persona?.apellidopaterno);
          this.directorForm.controls['apellidomaterno'].setValue(director.persona?.apellidomaterno);
          this.directorForm.controls['sexo'].setValue(director.persona?.sexo);
          this.directorForm.controls['fechanacimiento'].setValue(director.persona?.fechanacimiento);
          this.directorForm.controls['tipodocumentoId'].setValue(director.persona?.tipodocumento.id);
          this.directorForm.controls['domicilio'].setValue(director.persona?.domicilio);
          this.directorForm.controls['telefono'].setValue(director.persona?.telefono);
          this.directorForm.controls['nacionalidad'].setValue(director.persona?.nacionalidad);
          this.directorForm.controls['distrito'].setValue(director.persona?.distrito);
          this.directorForm.controls['correo'].setValue(director.persona?.correo);
          this.directorForm.controls['observacion'].setValue(director.observacion);
          this.directorForm.controls['vigente'].setValue(director.vigente);
          this.directorForm.controls['id'].setValue(director.persona?.id);
          this.directorForm.controls['directorId'].setValue(director.id);
          this.dniusuarioeditar = director.persona?.dni || '';
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
      fechanacimiento: ['', Validators.required],
      tipodocumentoId: ['', Validators.required],
      domicilio: [''],
      telefono: [''],
      nacionalidad: [''],
      distrito: [''],
      correo: [''],
      observacion: [''],
      vigente: [''],
      directorId: [''],
      id: ['']
    });
  }
  campoRequerido(campo: string) {
    if (this.directorForm.get(campo)?.getError('required') && this.formSubmitted) {
      return true;
    } else {
      return false;
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
  campoNumeros(campo: string) {
    if (this.directorForm.controls[campo].getError('pattern') && this.formSubmitted) {
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

  validaDNI() {
    if (this.dniusuarioeditar !== this.directorForm.get('dni')?.value) {
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
  }

  actualizarDirector() {
    this.formSubmitted = true;
    if (this.directorForm.valid) {
      Swal.fire({
        title: 'Actualizar',
        text: "¿Desea actualizar el director?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Actualizar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.personaService.actualizar(this.directorForm.get('id')?.value, this.directorForm.value)
            .subscribe(({ ok, persona }) => {
              if (ok) {
                let directorObj: Director = {
                  observacion: this.directorForm.get('observacion')?.value,
                  vigente: this.directorForm.get('vigente')?.value,
                  personaId: Number(persona.id)
                };
                this.directorService.actualizar(this.directorForm.get('directorId')?.value, directorObj)
                  .subscribe({
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
            });
        }
      })
    }
  }

}
