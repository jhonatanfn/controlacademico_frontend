import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Grado } from 'src/app/models/grado.model';
import { Nivel } from 'src/app/models/nivel.model';
import { Seccion } from 'src/app/models/seccion.model';
import { AulaService } from 'src/app/services/aula.service';
import { GradoService } from 'src/app/services/grado.service';
import { NivelService } from 'src/app/services/nivel.service';
import { SeccionService } from 'src/app/services/seccion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-aula',
  templateUrl: './editar-aula.component.html',
  styleUrls: ['./editar-aula.component.css']
})
export class EditarAulaComponent implements OnInit {

  public titulo: string = "Editar Aula";
  public icono: string = "bi bi-pen";
  public niveles: Nivel[] = [];
  public grados: Grado[] = [];
  public secciones: Seccion[] = [];
  public aulaForm!: FormGroup;
  public formSubmitted: boolean = false;
  public tipovalores: any[] = [
    { id: 1, nombre: "LITERAL" },
    { id: 2, nombre: "VIGESIMAL" }
  ];

  constructor(private nivelService: NivelService,
    private gradoService: GradoService, private seccionService: SeccionService,
    private fb: FormBuilder, private aulaService: AulaService,
    private route: ActivatedRoute) {

    this.nivelService.todo()
      .subscribe(({ niveles }) => {
        this.niveles = niveles;
      });

    this.gradoService.todo()
      .subscribe(({ grados }) => {
        this.grados = grados;
      });

    this.seccionService.todo()
      .subscribe(({ secciones }) => {
        this.secciones = secciones;
      });

    this.aulaService.obtener(Number(this.route.snapshot.paramMap.get('id')))
      .subscribe(({ ok, aula }) => {
        if (ok) {
          this.aulaForm.controls['nombre'].setValue(aula.nombre.toUpperCase());
          this.aulaForm.controls['nivelId'].setValue(aula.nivel.id);
          this.aulaForm.controls['gradoId'].setValue(aula.grado.id);
          this.aulaForm.controls['seccionId'].setValue(aula.seccion.id);
          this.aulaForm.controls['tipovalor'].setValue(aula.tipovalor);
          this.aulaForm.controls['id'].setValue(aula.id);
        }
      });

  }

  ngOnInit(): void {
    this.aulaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(40)]],
      nivelId: ['', Validators.required],
      gradoId: ['', Validators.required],
      seccionId: ['', Validators.required],
      tipovalor: ['', Validators.required],
      id: ['']
    });
  }

  campoRequerido(campo: string) {
    if (this.aulaForm.get(campo)?.getError('required') && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }

  campoMaxLengh(campo: string, longitud: number) {
    if (this.aulaForm.get(campo)?.value === "") {
      return;
    }
    if ((this.aulaForm.get(campo)?.getError('maxlength')?.requiredLength == longitud) &&
      this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }

  actualizarAula() {
    this.formSubmitted = true;
    if (this.aulaForm.valid) {

      this.aulaService.existeAulaEditar(
        this.aulaForm.get('nivelId')?.value,
        this.aulaForm.get('gradoId')?.value,
        this.aulaForm.get('seccionId')?.value,
        this.aulaForm.get('id')?.value
      ).subscribe({
        next: ({ ok, msg }) => {
          if (ok) {
            Swal.fire({
              position: 'top-end',
              icon: 'info',
              title: msg,
              showConfirmButton: false,
              timer: 1000
            });
          } else {

            Swal.fire({
              title: 'Actualizar',
              text: "¿Desea actualizar el aula?",
              icon: 'question',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              cancelButtonText: 'Cancelar',
              confirmButtonText: 'Actualizar'
            }).then((result) => {
              if (result.isConfirmed) {
                this.aulaService.actualizar(this.aulaForm.get('id')?.value, this.aulaForm.value)
                  .subscribe(({ ok, msg, aula }) => {
                    if (ok) {
                      this.aulaForm.controls['nombre'].setValue(aula.nombre.toUpperCase());
                      Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: msg,
                        showConfirmButton: false,
                        timer: 1500
                      })
                    }
                  });
              }
            })
          }
        }
      });
    }
  }
}
