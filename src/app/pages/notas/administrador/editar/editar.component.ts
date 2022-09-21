import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Ciclo } from 'src/app/models/ciclo.model';
import { Competencia } from 'src/app/models/competencia.model';
import { Evaluacion } from 'src/app/models/evaluacion.model';
import { Matricula } from 'src/app/models/matricula.model';
import { Periodo } from 'src/app/models/periodo.model';
import { Programacion } from 'src/app/models/programacion.model';
import { CicloService } from 'src/app/services/ciclo.service';
import { CompetenciaService } from 'src/app/services/competencia.service';
import { EvaluacionService } from 'src/app/services/evaluacion.service';
import { NotaService } from 'src/app/services/nota.service';
import { ProgramacionService } from 'src/app/services/programacion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css']
})
export class EditarComponent implements OnInit {

  public titulo: string = 'Editar Notas';
  public icono: string = ' bi bi-pen';
  public titulo2: string = 'Tabla Alumnos';
  public icono2: string = 'bi bi-table';
  public titulo3: string = 'Datos de la Asignación';
  public icono3: string = 'bi bi-card-checklist';
  public notaForm!: FormGroup;
  public periodos: Periodo[] = [];
  public programaciones: Programacion[] = [];
  public ciclos: Ciclo[] = [];
  public evaluaciones: Evaluacion[] = [];
  public matriculas: Matricula[] = [];
  public competencias: Competencia[] = [];
  public datos: any[] = [];
  public formSubmitted: boolean = false;
  public cargando: boolean = false;

  public periodonombre: string = "";
  public aulanombre: string = "";
  public areanombre: string = "";
  public docentenombre: string = "";

  public literal: boolean = false;
  public vigesimal: boolean = false;
  public valordefecto: string = "";
  public letras: any = [
    { id: 1, nombre: "AD" },
    { id: 2, nombre: "A" },
    { id: 3, nombre: "B" },
    { id: 4, nombre: "C" },
    { id: 5, nombre: "-" },
  ];

  constructor(private fb: FormBuilder, private cicloService: CicloService,
    private evaluacionService: EvaluacionService, private notaService: NotaService,
    private route: ActivatedRoute, private programacionService: ProgramacionService,
    private competenciaService: CompetenciaService) {

    this.cicloService.listar().subscribe(({ ok, ciclos }) => {
      if (ok) {
        this.ciclos = ciclos;
      }
    });
    this.evaluacionService.todo().subscribe(({ ok, evaluaciones }) => {
      if (ok) {
        this.evaluaciones = evaluaciones;
      }
    });
    this.programacionService.obtener(Number(this.route.snapshot.paramMap.get('id')))
      .subscribe({
        next: ({ ok, programacion }) => {
          if (ok) {
            this.periodonombre = programacion.periodo?.nombre || "";
            this.aulanombre = programacion.aula?.nombre || "";
            this.docentenombre = programacion.docente?.persona?.apellidopaterno + " " +
              programacion.docente?.persona?.apellidomaterno + " " +
              programacion.docente?.persona?.nombres;
            this.areanombre = programacion.area?.nombre || "";
            this.competenciaService.competenciasArea(Number(programacion.area?.id)).subscribe({
              next: ({ ok, competencias }) => {
                if (ok) {
                  this.competencias = competencias;
                }
              }
            });
          }
        }
      });
  }
  ngOnInit(): void {
    this.notaForm = this.fb.group({
      cicloId: ['', Validators.required],
      evaluacionId: ['', Validators.required],
      competenciaId: ['', Validators.required],
      areaId: [''],
      fecha: ['', Validators.required]
    });
  }

  campoRequerido(campo: string) {
    if (this.notaForm.get(campo)?.getError('required') && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }

  buscarMatriculas() {
    this.formSubmitted = true;
    if (this.notaForm.valid) {
      this.cargando = true;
      this.datos = [];
      this.notaService.notasProgramacionFechaEvaluacionCicloCompetencia(
        Number(this.route.snapshot.paramMap.get('id')),
        this.notaForm.controls['fecha'].value,
        Number(this.notaForm.get('evaluacionId')?.value),
        Number(this.notaForm.get('cicloId')?.value),
        Number(this.notaForm.get('competenciaId')?.value))
        .subscribe(({ ok, notas }) => {
          if (ok) {
            if (notas.length > 0) {
              this.datos = notas;
              let tipovalor = this.datos[0].matriculadetalle?.programacion?.aula?.tipovalor;
              if (tipovalor == "1") {
                this.literal = true;
                this.vigesimal = false;
                this.valordefecto = "-";
              } else {
                this.literal = false;
                this.vigesimal = true;
                this.valordefecto = "0";
              }
            }
            this.cargando = false;
          }
        });
    }
  }

  validacionDatos() {
    let result: boolean = false;
    this.datos.forEach(dato => {
      if (dato.valor === "") {
        result = true;
      }
    });
    return result;
  }

  actualizarNotas() {
    this.formSubmitted = true;
    if (this.notaForm.valid) {
      if (this.validacionDatos()) {
        Swal.fire('Ingresar las notas correctamente.');
      } else {
        Swal.fire({
          title: 'Actualizar',
          text: "¿Desea actualizar las notas?",
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          cancelButtonText: 'Cancelar',
          confirmButtonText: 'Actualizar'
        }).then((result) => {
          if (result.isConfirmed) {
            this.datos.forEach(dato => {
              this.notaService.actualizar(dato.id, dato)
                .subscribe(({ ok }) => {
                  if (ok) {
                  }
                });
            });
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Registro actualizado exitosamente',
              showConfirmButton: false,
              timer: 1500
            })
          }
        })
      }
    }

  }

  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }


}
