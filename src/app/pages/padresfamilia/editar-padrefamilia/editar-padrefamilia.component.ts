import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Padre } from 'src/app/models/padre.model';
import { Tipodocumento } from 'src/app/models/tipodocumento.model';
import { MadreService } from 'src/app/services/madre.service';
import { PadreService } from 'src/app/services/padre.service';
import { PersonaService } from 'src/app/services/persona.service';
import { TipodocumentoService } from 'src/app/services/tipodocumento.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-padrefamilia',
  templateUrl: './editar-padrefamilia.component.html',
  styleUrls: ['./editar-padrefamilia.component.css']
})
export class EditarPadrefamiliaComponent implements OnInit {

  public titulo: string = 'Editar Familiar';
  public icono: string = 'bi bi-pen';
  public tipos: Tipodocumento[] = [];
  public familiarForm!: FormGroup;
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
    private fb: FormBuilder, private personaService: PersonaService,
    private padreService: PadreService, private madreService: MadreService,
    private route: ActivatedRoute) {

    this.tipodocuementoService.listar()
      .subscribe(({ tipodocumentos }) => {
        this.tipos = tipodocumentos;
      });

    if (this.route.snapshot.paramMap.get('name') == "p") {

      this.padreService.obtener(Number(this.route.snapshot.paramMap.get('id')))
        .subscribe(({ ok, padre }) => {
          if (ok) {
            this.familiarForm.controls['dni'].setValue(padre.persona?.dni);
            this.familiarForm.controls['nombres'].setValue(padre.persona?.nombres);
            this.familiarForm.controls['apellidopaterno'].setValue(padre.persona?.apellidopaterno);
            this.familiarForm.controls['apellidomaterno'].setValue(padre.persona?.apellidomaterno);
            this.familiarForm.controls['sexo'].setValue(padre.persona?.sexo);
            this.familiarForm.controls['fechanacimiento'].setValue(padre.persona?.fechanacimiento);
            this.familiarForm.controls['tipodocumentoId'].setValue(padre.persona?.tipodocumento.id);
            this.familiarForm.controls['domicilio'].setValue(padre.persona?.domicilio);
            this.familiarForm.controls['telefono'].setValue(padre.persona?.telefono);
            this.familiarForm.controls['nacionalidad'].setValue(padre.persona?.nacionalidad);
            this.familiarForm.controls['distrito'].setValue(padre.persona?.distrito);
            this.familiarForm.controls['correo'].setValue(padre.persona?.correo);
            this.familiarForm.controls['id'].setValue(padre.persona?.id);
            this.dniusuarioeditar = padre.persona?.dni || '';
          }
        });
    }

    if (this.route.snapshot.paramMap.get('name') == "m") {
      this.madreService.obtener(Number(this.route.snapshot.paramMap.get('id')))
        .subscribe(({ ok, madre }) => {
          if (ok) {
            this.familiarForm.controls['dni'].setValue(madre.persona?.dni);
            this.familiarForm.controls['nombres'].setValue(madre.persona?.nombres);
            this.familiarForm.controls['apellidopaterno'].setValue(madre.persona?.apellidopaterno);
            this.familiarForm.controls['apellidomaterno'].setValue(madre.persona?.apellidomaterno);
            this.familiarForm.controls['sexo'].setValue(madre.persona?.sexo);
            this.familiarForm.controls['fechanacimiento'].setValue(madre.persona?.fechanacimiento);
            this.familiarForm.controls['tipodocumentoId'].setValue(madre.persona?.tipodocumento.id);
            this.familiarForm.controls['domicilio'].setValue(madre.persona?.domicilio);
            this.familiarForm.controls['telefono'].setValue(madre.persona?.telefono);
            this.familiarForm.controls['nacionalidad'].setValue(madre.persona?.nacionalidad);
            this.familiarForm.controls['distrito'].setValue(madre.persona?.distrito);
            this.familiarForm.controls['correo'].setValue(madre.persona?.correo);
            this.familiarForm.controls['id'].setValue(madre.persona?.id);
            this.dniusuarioeditar = madre.persona?.dni || '';
          }
        });
    }
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
    if (this.familiarForm.get(campo)?.getError('required') && this.formSubmitted) {
      return true;
    } else {
      return false;
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
  campoNumeros(campo: string) {
    if (this.familiarForm.controls[campo].getError('pattern') && this.formSubmitted) {
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

  validaDNI() {

    if (this.route.snapshot.paramMap.get('name') == "p") {

      if (this.dniusuarioeditar !== this.familiarForm.get('dni')?.value) {
        if ((this.familiarForm.get('dni')?.value).length == 8
          && !this.familiarForm.get('dni')?.getError('required')
          && !this.familiarForm.get('dni')?.getError('pattern')) {
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
        } else {
          this.dnirepetido = false;
        }
      }

    }
    if(this.route.snapshot.paramMap.get('name') == "m"){

      if (this.dniusuarioeditar !== this.familiarForm.get('dni')?.value) {
        if ((this.familiarForm.get('dni')?.value).length == 8
          && !this.familiarForm.get('dni')?.getError('required')
          && !this.familiarForm.get('dni')?.getError('pattern')) {
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
        } else {
          this.dnirepetido = false;
        }
      }

    }
  }

  actualizarFamiliar() {
    this.formSubmitted = true;
    if (this.familiarForm.valid) {
      Swal.fire({
        title: 'Actualizar',
        text: "¿Desea actualizar el familiar?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Actualizar'
      }).then((result) => {
        if (result.isConfirmed) {

          this.personaService.actualizar(this.familiarForm.get('id')?.value, this.familiarForm.value)
            .subscribe(({ ok }) => {
              if (ok) {
                Swal.fire({
                  position: 'top-end',
                  icon: 'success',
                  title: 'Familiar actualizado exitosamente.',
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
