import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Docente } from 'src/app/models/docente.model';
import { Tipodocumento } from 'src/app/models/tipodocumento.model';
import { DocenteService } from 'src/app/services/docente.service';
import { PersonaService } from 'src/app/services/persona.service';
import { TipodocumentoService } from 'src/app/services/tipodocumento.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-docente',
  templateUrl: './editar-docente.component.html',
  styleUrls: ['./editar-docente.component.css']
})
export class EditarDocenteComponent implements OnInit {

  public titulo: string = 'Editar Docente';
  public icono: string = 'bi bi-pen';
  public tipos: Tipodocumento[] = [];
  public docenteForm!: FormGroup;
  public formSubmitted: boolean = false;
  public docente!: Docente;
  public sexos: any = [
    { id: 1, nombre: "MASCULINO" },
    { id: 2, nombre: "FEMENINO" },
  ];
  public dnirepetido: boolean = false;
  public dniusuarioeditar: string = "";

  constructor(
    private tipodocuementoService: TipodocumentoService,
    private fb: FormBuilder, private personaService: PersonaService,
    private docenteService: DocenteService,
    private route: ActivatedRoute) {
    this.tipodocuementoService.listar()
      .subscribe(({ tipodocumentos }) => {
        this.tipos = tipodocumentos;
      });
    this.docenteService.obtener(Number(this.route.snapshot.paramMap.get('id')))
      .subscribe(({ ok, docente }) => {
        if (ok) {
          this.docenteForm.controls['dni'].setValue(docente.persona?.dni);
          this.docenteForm.controls['nombres'].setValue(docente.persona?.nombres);
          this.docenteForm.controls['apellidopaterno'].setValue(docente.persona?.apellidopaterno);
          this.docenteForm.controls['apellidomaterno'].setValue(docente.persona?.apellidomaterno);
          this.docenteForm.controls['sexo'].setValue(docente.persona?.sexo);
          this.docenteForm.controls['fechanacimiento'].setValue(docente.persona?.fechanacimiento);
          this.docenteForm.controls['tipodocumentoId'].setValue(docente.persona?.tipodocumento.id);
          this.docenteForm.controls['domicilio'].setValue(docente.persona?.domicilio);
          this.docenteForm.controls['telefono'].setValue(docente.persona?.telefono);
          this.docenteForm.controls['nacionalidad'].setValue(docente.persona?.nacionalidad);
          this.docenteForm.controls['distrito'].setValue(docente.persona?.distrito);
          this.docenteForm.controls['correo'].setValue(docente.persona?.correo);
          this.docenteForm.controls['id'].setValue(docente.persona?.id);
          this.dniusuarioeditar = docente.persona?.dni || '';
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
    if (this.docenteForm.get(campo)?.getError('required') && this.formSubmitted) {
      return true;
    } else {
      return false;
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
  campoNumeros(campo: string) {
    if (this.docenteForm.controls[campo].getError('pattern') && this.formSubmitted) {
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

  validaDNI() {
    if (this.dniusuarioeditar !== this.docenteForm.get('dni')?.value) {
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
  }

  actualizarDocente() {
    this.formSubmitted = true;
    if (this.docenteForm.valid) {
      Swal.fire({
        title: 'Actualizar',
        text: "¿Desea actualizar el docente?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Actualizar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.personaService.actualizar(this.docenteForm.get('id')?.value, this.docenteForm.value)
            .subscribe(({ ok, msg }) => {
              if (ok) {
                Swal.fire({
                  position: 'top-end',
                  icon: 'success',
                  title: 'Docente actualizado exitosamente.',
                  showConfirmButton: false,
                  timer: 1000
                })
              }
            });
        }
      })
    }
  }
}
