import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Auxiliar } from 'src/app/models/auxiliar.model';
import { Tipodocumento } from 'src/app/models/tipodocumento.model';
import { AuxiliarService } from 'src/app/services/auxiliar.service';
import { PersonaService } from 'src/app/services/persona.service';
import { TipodocumentoService } from 'src/app/services/tipodocumento.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-auxiliar',
  templateUrl: './editar-auxiliar.component.html',
  styleUrls: ['./editar-auxiliar.component.css']
})
export class EditarAuxiliarComponent implements OnInit {

  public titulo: string = 'Editar Auxiliar';
  public icono: string = 'bi bi-pen';
  public tipos: Tipodocumento[] = [];
  public auxiliarForm!: FormGroup;
  public formSubmitted: boolean = false;
  public auxiliar!: Auxiliar;
  public sexos: any = [
    { id: 1, nombre: "MASCULINO" },
    { id: 2, nombre: "FEMENINO" },
  ];
  public dnirepetido: boolean = false;
  public dniusuarioeditar: string = "";

  constructor(
    private tipodocuementoService: TipodocumentoService,
    private fb: FormBuilder, private personaService: PersonaService,
    private auxiliarService: AuxiliarService,
    private route: ActivatedRoute) {
    this.tipodocuementoService.listar()
      .subscribe(({ tipodocumentos }) => {
        this.tipos = tipodocumentos;
      });
    this.auxiliarService.obtener(Number(this.route.snapshot.paramMap.get('id')))
      .subscribe(({ ok, auxiliar }) => {
        if (ok) {
          this.auxiliarForm.controls['dni'].setValue(auxiliar.persona?.dni);
          this.auxiliarForm.controls['nombres'].setValue(auxiliar.persona?.nombres);
          this.auxiliarForm.controls['apellidopaterno'].setValue(auxiliar.persona?.apellidopaterno);
          this.auxiliarForm.controls['apellidomaterno'].setValue(auxiliar.persona?.apellidomaterno);
          this.auxiliarForm.controls['sexo'].setValue(auxiliar.persona?.sexo);
          this.auxiliarForm.controls['fechanacimiento'].setValue(auxiliar.persona?.fechanacimiento);
          this.auxiliarForm.controls['tipodocumentoId'].setValue(auxiliar.persona?.tipodocumento.id);
          this.auxiliarForm.controls['domicilio'].setValue(auxiliar.persona?.domicilio);
          this.auxiliarForm.controls['telefono'].setValue(auxiliar.persona?.telefono);
          this.auxiliarForm.controls['nacionalidad'].setValue(auxiliar.persona?.nacionalidad);
          this.auxiliarForm.controls['distrito'].setValue(auxiliar.persona?.distrito);
          this.auxiliarForm.controls['correo'].setValue(auxiliar.persona?.correo);
          this.auxiliarForm.controls['id'].setValue(auxiliar.persona?.id);
          this.dniusuarioeditar = auxiliar.persona?.dni || '';
        }
      });
  }
  ngOnInit(): void {
    this.auxiliarForm = this.fb.group({
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
    if (this.auxiliarForm.get(campo)?.getError('required') && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }
  campoMaxLengh(campo: string, longitud: number) {
    if (this.auxiliarForm.get(campo)?.value === "") {
      return;
    }
    if ((this.auxiliarForm.get(campo)?.getError('maxlength')?.requiredLength == longitud) &&
      this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }
  campoNumeros(campo: string) {
    if (this.auxiliarForm.controls[campo].getError('pattern') && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }
  campoMinLength(campo: string, longitud: number) {
    if (this.auxiliarForm.get(campo)?.value === "") {
      return;
    }
    if ((this.auxiliarForm.get(campo)?.getError('minlength')?.requiredLength == longitud) &&
      this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }

  validaDNI() {
    if (this.dniusuarioeditar !== this.auxiliarForm.get('dni')?.value) {
      if ((this.auxiliarForm.get('dni')?.value).length == 8
        && !this.auxiliarForm.get('dni')?.getError('required')
        && !this.auxiliarForm.get('dni')?.getError('pattern')) {
        this.auxiliarService.searchDNI(this.auxiliarForm.get('dni')?.value).subscribe({
          next: ({ ok }) => {
            if (ok) {
              this.auxiliarForm.controls['dni'].setErrors({ error: true });
              this.dnirepetido = true;
            } else {
              this.auxiliarForm.controls['dni'].setErrors(null);
              this.dnirepetido = false;
            }
          }
        });
      } else {
        this.dnirepetido = false;
      }
    }
  }

  actualizarAuxiliar() {
    this.formSubmitted = true;
    if (this.auxiliarForm.valid) {
      Swal.fire({
        title: 'Actualizar',
        text: "¿Desea actualizar el auxiliar?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Actualizar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.personaService.actualizar(this.auxiliarForm.get('id')?.value, this.auxiliarForm.value)
            .subscribe(({ ok, msg }) => {
              if (ok) {
                Swal.fire({
                  position: 'top-end',
                  icon: 'success',
                  title: 'Auxiliar actualizado exitosamente.',
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
