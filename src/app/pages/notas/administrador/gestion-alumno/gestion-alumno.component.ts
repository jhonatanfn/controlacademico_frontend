import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Ciclo } from 'src/app/models/ciclo.model';
import { Competencia } from 'src/app/models/competencia.model';
import { Evaluacion } from 'src/app/models/evaluacion.model';
import { Matriculadetalle } from 'src/app/models/matriculadetalle';
import { Nota } from 'src/app/models/nota.model';
import { Periodo } from 'src/app/models/periodo.model';
import { Programacion } from 'src/app/models/programacion.model';
import { CicloService } from 'src/app/services/ciclo.service';
import { MatriculadetalleService } from 'src/app/services/matriculadetalle.service';
import { NotaService } from 'src/app/services/nota.service';
import { ProgramacionService } from 'src/app/services/programacion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gestion-alumno',
  templateUrl: './gestion-alumno.component.html',
  styleUrls: ['./gestion-alumno.component.css']
})
export class GestionAlumnoComponent implements OnInit {

  public titulo: string = 'Consultar Notas';
  public icono: string = 'bi bi-mortarboard';
  public titulo2: string = 'Tabla Alumnos';
  public icono2: string = 'bi bi-table';
  public titulo3: string = 'Datos de la Asignación';
  public icono3: string = 'bi bi-card-checklist';
  public notaForm!: FormGroup;
  public periodos: Periodo[] = [];
  public programaciones: Programacion[] = [];
  public ciclos: Ciclo[] = [];
  public evaluaciones: Evaluacion[] = [];
  public matriculadetalles: Matriculadetalle[] = [];
  public competencias: Competencia[] = [];
  public datos: any[] = [];
  public formSubmitted: boolean = false;
  public periodonombre: string = "";
  public aulanombre: string = "";
  public areanombre: string = "";
  public docentenombre: string = "";
  public cargando: boolean = false;

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
  public notas: Nota[] = [];

  constructor(private fb: FormBuilder, private cicloService: CicloService,
    private notaService: NotaService, private route: ActivatedRoute,
    private programacionService: ProgramacionService,
    private matriculadetalleService: MatriculadetalleService) {

    this.cicloService.listar().subscribe(({ ok, ciclos }) => {
      if (ok) {
        this.ciclos = ciclos;
      }
    });
    this.programacionService.obtener(Number(this.route.snapshot.paramMap.get('id')))
      .subscribe({
        next: ({ ok, programacion }) => {
          if (ok) {
            
            this.periodonombre = programacion.periodo?.nombre || "";
            this.aulanombre = programacion.aula?.nombre || "";
            this.areanombre = programacion.area?.nombre || "";
            this.docentenombre = programacion.docente?.persona?.apellidopaterno + " " +
              programacion.docente?.persona?.apellidomaterno + " " +
              programacion.docente?.persona?.nombres;
            
            let tipovalor = programacion.aula?.tipovalor;
            if (tipovalor == "1") {
              this.literal = true;
              this.vigesimal = false;
              this.valordefecto = "-";
            } else {
              this.literal = false;
              this.vigesimal = true;
              this.valordefecto = "0";
            }

            this.matriculadetalleService.matriculadetallesPeriodoAulaArea(
              Number(programacion.periodo?.id),
              Number(programacion.aula?.id),
              Number(programacion.area?.id)
            ).subscribe({
              next: ({ ok, matriculadetalles }) => {
                if (ok) {
                  this.matriculadetalles = matriculadetalles;
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
      matriculadetalleId: ['', Validators.required]
    });
  }
  campoRequerido(campo: string) {
    if (this.notaForm.get(campo)?.getError('required') && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }

  buscarNotas() {
    this.formSubmitted = true;
    if (this.notaForm.valid) {
      this.cargando = true;
      this.listarNotas();
    }
  }

  listarNotas(){
    this.notaService.notasCicloMatriculadetalle(
      Number(this.notaForm.get('cicloId')?.value),
      Number(this.notaForm.get('matriculadetalleId')?.value)
    ).subscribe({
      next: ({ ok, notas }) => {
        if (ok) {
          this.notas = notas;
        }
        this.cargando = false;
      }
    });
  }

  eliminarNota(nota:Nota){
  
    this.notaService.cambiarEstado(Number(nota.id),nota).subscribe({
      next: ({ok, msg})=>{
        if(ok){
          this.listarNotas();
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: msg,
            showConfirmButton: false,
            timer: 1000
          });
        }
      }
    })

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

  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

}
