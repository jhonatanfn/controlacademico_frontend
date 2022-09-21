import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Padre } from 'src/app/models/padre.model';
import { Tipodocumento } from 'src/app/models/tipodocumento.model';
import { PadreService } from 'src/app/services/padre.service';
import { PersonaService } from 'src/app/services/persona.service';
import { TipodocumentoService } from 'src/app/services/tipodocumento.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-padre',
  templateUrl: './editar-padre.component.html',
  styleUrls: ['./editar-padre.component.css']
})
export class EditarPadreComponent implements OnInit {

  public titulo: string = 'Editar Padre';
  public icono: string = 'bi bi-pen';
  public tipos: Tipodocumento[] = [];
  public padreForm!: FormGroup;
  public formSubmitted: boolean = false;
  public padre!: Padre;
  public sexos: any = [
    { id: 1, nombre: "MASCULINO" },
    { id: 2, nombre: "FEMENINO" },
  ];
  public dnirepetido: boolean = false;
  public dniusuarioeditar: string = "";

  constructor(
    private tipodocuementoService: TipodocumentoService,
    private fb: FormBuilder, private personaService: PersonaService, private padreService: PadreService,
    private route: ActivatedRoute) {
    this.tipodocuementoService.listar()
      .subscribe(({ tipodocumentos }) => {
        this.tipos = tipodocumentos;
      });
    this.padreService.obtener(Number(this.route.snapshot.paramMap.get('id')))
      .subscribe(({ ok, padre }) => {
        if (ok) {
          this.padreForm.controls['dni'].setValue(padre.persona?.dni);
          this.padreForm.controls['nombres'].setValue(padre.persona?.nombres);
          this.padreForm.controls['apellidopaterno'].setValue(padre.persona?.apellidopaterno);
          this.padreForm.controls['apellidomaterno'].setValue(padre.persona?.apellidomaterno);
          this.padreForm.controls['sexo'].setValue(padre.persona?.sexo);
          this.padreForm.controls['fechanacimiento'].setValue(padre.persona?.fechanacimiento);
          this.padreForm.controls['tipodocumentoId'].setValue(padre.persona?.tipodocumento.id);
          this.padreForm.controls['domicilio'].setValue(padre.persona?.domicilio);
          this.padreForm.controls['telefono'].setValue(padre.persona?.telefono);
          this.padreForm.controls['nacionalidad'].setValue(padre.persona?.nacionalidad);
          this.padreForm.controls['distrito'].setValue(padre.persona?.distrito);
          this.padreForm.controls['correo'].setValue(padre.persona?.correo);
          this.padreForm.controls['id'].setValue(padre.persona?.id);
          this.dniusuarioeditar = padre.persona?.dni || '';
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
    if (this.padreForm.get(campo)?.getError('required') && this.formSubmitted) {
      return true;
    } else {
      return false;
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
  campoNumeros(campo: string) {
    if (this.padreForm.controls[campo].getError('pattern') && this.formSubmitted) {
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

  validaDNI() {
    if (this.dniusuarioeditar !== this.padreForm.get('dni')?.value) {
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
  }

  actualizarPadre() {
    this.formSubmitted = true;
    if (this.padreForm.valid) {
      Swal.fire({
        title: 'Actualizar',
        text: "¿Desea actualizar el padre?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Actualizar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.personaService.actualizar(this.padreForm.get('id')?.value, this.padreForm.value)
            .subscribe(({ ok, msg }) => {
              if (ok) {
                Swal.fire({
                  position: 'top-end',
                  icon: 'success',
                  title: 'Padre actualizado exitosamente.',
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
