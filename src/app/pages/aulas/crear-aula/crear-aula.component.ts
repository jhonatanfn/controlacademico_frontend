import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Grado } from 'src/app/models/grado.model';
import { Nivel } from 'src/app/models/nivel.model';
import { Seccion } from 'src/app/models/seccion.model';
import { AulaService } from 'src/app/services/aula.service';
import { GradoService } from 'src/app/services/grado.service';
import { NivelService } from 'src/app/services/nivel.service';
import { SeccionService } from 'src/app/services/seccion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-aula',
  templateUrl: './crear-aula.component.html',
  styleUrls: ['./crear-aula.component.css']
})
export class CrearAulaComponent implements OnInit {

  public titulo: string = "Crear Aula";
  public icono: string = "bi bi-plus-square";
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
    private fb: FormBuilder, private aulaService: AulaService, private router: Router) {

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
  }

  ngOnInit(): void {
    this.aulaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(40)]],
      nivelId: ['', Validators.required],
      gradoId: ['', Validators.required],
      seccionId: ['', Validators.required],
      tipovalor: ['', Validators.required],
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

  crearAula() {
    this.formSubmitted = true;
    if (this.aulaForm.valid) {
      this.aulaService.existeAula(
        this.aulaForm.get('nivelId')?.value,
        this.aulaForm.get('gradoId')?.value,
        this.aulaForm.get('seccionId')?.value).subscribe({
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
                title: 'Guardar',
                text: "¿Desea crear el aula?",
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                cancelButtonText: 'Cancelar',
                confirmButtonText: 'Guardar'
              }).then((result) => {
                if (result.isConfirmed) {

                  this.aulaService.crear(this.aulaForm.value)
                    .subscribe(({ ok, msg }) => {
                      if (ok) {
                        this.router.navigateByUrl('dashboard/aulas');
                        Swal.fire({
                          position: 'top-end',
                          icon: 'success',
                          title: msg,
                          showConfirmButton: false,
                          timer: 1000
                        })
                      }
                    });
                }
              });
            }
          }
        });
    }
  }
}
