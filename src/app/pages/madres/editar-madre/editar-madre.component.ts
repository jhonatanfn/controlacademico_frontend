import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Madre } from 'src/app/models/madre.model';
import { Tipodocumento } from 'src/app/models/tipodocumento.model';
import { MadreService } from 'src/app/services/madre.service';
import { PersonaService } from 'src/app/services/persona.service';
import { TipodocumentoService } from 'src/app/services/tipodocumento.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-madre',
  templateUrl: './editar-madre.component.html',
  styleUrls: ['./editar-madre.component.css']
})
export class EditarMadreComponent implements OnInit {

  public titulo: string = 'Editar Madre';
  public icono: string = 'bi bi-pen';
  public tipos: Tipodocumento[] = [];
  public madreForm!: FormGroup;
  public formSubmitted: boolean = false;
  public madre!: Madre;
  public sexos: any = [
    { id: 1, nombre: "MASCULINO" },
    { id: 2, nombre: "FEMENINO" },
  ];
  public dnirepetido: boolean = false;
  public dniusuarioeditar: string = "";

  constructor(
    private tipodocuementoService: TipodocumentoService,
    private fb: FormBuilder, private personaService: PersonaService, private madreService: MadreService,
    private route: ActivatedRoute) {
    this.tipodocuementoService.listar()
      .subscribe(({ tipodocumentos }) => {
        this.tipos = tipodocumentos;
      });
    this.madreService.obtener(Number(this.route.snapshot.paramMap.get('id')))
      .subscribe(({ ok, madre }) => {
        if (ok) {
          this.madreForm.controls['dni'].setValue(madre.persona?.dni);
          this.madreForm.controls['nombres'].setValue(madre.persona?.nombres);
          this.madreForm.controls['apellidopaterno'].setValue(madre.persona?.apellidopaterno);
          this.madreForm.controls['apellidomaterno'].setValue(madre.persona?.apellidomaterno);
          this.madreForm.controls['sexo'].setValue(madre.persona?.sexo);
          this.madreForm.controls['fechanacimiento'].setValue(madre.persona?.fechanacimiento);
          this.madreForm.controls['tipodocumentoId'].setValue(madre.persona?.tipodocumento.id);
          this.madreForm.controls['domicilio'].setValue(madre.persona?.domicilio);
          this.madreForm.controls['telefono'].setValue(madre.persona?.telefono);
          this.madreForm.controls['nacionalidad'].setValue(madre.persona?.nacionalidad);
          this.madreForm.controls['distrito'].setValue(madre.persona?.distrito);
          this.madreForm.controls['correo'].setValue(madre.persona?.correo);
          this.madreForm.controls['id'].setValue(madre.persona?.id);
          this.dniusuarioeditar = madre.persona?.dni || '';
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
      fechanacimiento: ['', Validators.required],
      tipodocumentoId: ['', Validators.required],
      domicilio: [''],
      telefono: [''],
      nacionalidad: [''],
      distrito: [''],
      correo: [''],
      id: ['']
    });
  }
  campoRequerido(campo: string) {
    if (this.madreForm.get(campo)?.getError('required') && this.formSubmitted) {
      return true;
    } else {
      return false;
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
  campoNumeros(campo: string) {
    if (this.madreForm.controls[campo].getError('pattern') && this.formSubmitted) {
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

  validaDNI() {
    if (this.dniusuarioeditar !== this.madreForm.get('dni')?.value) {
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
  }

  actualizarMadre() {
    this.formSubmitted = true;
    if (this.madreForm.valid) {
      Swal.fire({
        title: 'Actualizar',
        text: "¿Desea actualizar la madre?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Actualizar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.personaService.actualizar(this.madreForm.get('id')?.value, this.madreForm.value)
            .subscribe(({ ok, msg }) => {
              if (ok) {
                Swal.fire({
                  position: 'top-end',
                  icon: 'success',
                  title: 'Madre actualizada exitosamente.',
                  showConfirmButton: false,
                  timer: 1000
                })
              }
            });
        }
      });
    }
  }

}
