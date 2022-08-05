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
          this.docenteForm.controls['tipodocumentoId'].setValue(docente.persona?.tipodocumento.id);
          this.docenteForm.controls['numero'].setValue(docente.persona?.numero);
          this.docenteForm.controls['nombres'].setValue(docente.persona?.nombres.toUpperCase());
          this.docenteForm.controls['apellidopaterno'].setValue(docente.persona?.apellidopaterno.toUpperCase());
          this.docenteForm.controls['apellidomaterno'].setValue(docente.persona?.apellidomaterno.toUpperCase());
          this.docenteForm.controls['direccion'].setValue(docente.persona?.direccion?.toUpperCase());
          this.docenteForm.controls['telefono'].setValue(docente.persona?.telefono);
          this.docenteForm.controls['id'].setValue(docente.persona?.id);
        }

      });

  }

  ngOnInit(): void {
    this.docenteForm = this.fb.group({
      tipodocumentoId: ['', Validators.required],
      numero: ['', [Validators.required, Validators.maxLength(8),
        Validators.minLength(8),
        Validators.pattern(/^\d+$/)]],
      nombres: ['', [Validators.required, Validators.maxLength(50)]],
      apellidopaterno: ['', [Validators.required, Validators.maxLength(20)]],
      apellidomaterno: ['', [Validators.required, Validators.maxLength(20)]],
      direccion: [''],
      telefono: [''],
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
    if(this.docenteForm.controls[campo].getError('pattern') && this.formSubmitted){
      return true;
    }else{
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
            .subscribe(({ ok, msg, persona }) => {
              if (ok) {
                this.docenteForm.controls['nombres'].setValue(persona?.nombres.toUpperCase());
                this.docenteForm.controls['apellidopaterno'].setValue(persona?.apellidopaterno.toUpperCase());
                this.docenteForm.controls['apellidomaterno'].setValue(persona?.apellidomaterno.toUpperCase());
                this.docenteForm.controls['direccion'].setValue(persona?.direccion?.toUpperCase());
                Swal.fire({
                  position: 'top-end',
                  icon: 'success',
                  title: 'Docente actualizado exitosamente.',
                  showConfirmButton: false,
                  timer: 1500
                })
              }
            });
        }
      })
    }

  }

}
