import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
import { Institucion } from 'src/app/models/institucion.model';
import { InstitucionService } from 'src/app/services/institucion.service';
import { MatriculadetalleService } from 'src/app/services/matriculadetalle.service';
import { Matriculadetalle } from 'src/app/models/matriculadetalle';
import { Alumno } from 'src/app/models/alumno.model';
import { Aula } from 'src/app/models/aula.model';
import { Periodo } from 'src/app/models/periodo.model';
import { Programacion } from 'src/app/models/programacion.model';
import { AlumnoService } from 'src/app/services/alumno.service';
import { AulaService } from 'src/app/services/aula.service';
import { MatriculaService } from 'src/app/services/matricula.service';
import { PeriodoService } from 'src/app/services/periodo.service';
import { ProgramacionService } from 'src/app/services/programacion.service';

@Component({
  selector: 'app-crear-matricula',
  templateUrl: './crear-matricula.component.html',
  styleUrls: ['./crear-matricula.component.css']
})
export class CrearMatriculaComponent implements OnInit {

  public titulo1: string = "Matricula";
  public icono1: string = "bi bi-card-text";
  public titulo2: string = "Asignaciones";
  public icono2: string = "bi bi-pc-display-horizontal";
  public titulo3: string = "Buscar Alumno";
  public icono3: string = "bi bi-search";
  public matriculaForm!: FormGroup;
  public formSubmitted: boolean = false;
  public periodos: Periodo[] = [];
  public aulas: Aula[] = [];
  public programaciones: Programacion[] = [];
  public programacionesprint: Programacion[] = [];
  public alumno: Alumno = {
    vivecon: 0,
    tienediscapacidad: 0,
    personaId: 0,
    padreId: 0,
    madreId: 0,
  };
  public existeAlumno: boolean = false;
  public messageError: string = "No hay alumno";
  public alumnos: Alumno[] = [];
  selectedAlumno!: any;
  public alumno_numero: string = "";
  public alumno_nombres: string = "";
  public alumno_apellidopaterno: string = "";
  public alumno_apellidomaterno: string = "";
  public alumno_img: string = "";
  public printButton: boolean = true;
  public saveButton: boolean = false;
  public institucion!: Institucion;
  public periodoanterior: any;

  constructor(private fb: FormBuilder,
    private periodoService: PeriodoService,
    private aulaService: AulaService,
    private programacionService: ProgramacionService,
    private matriculaService: MatriculaService,
    private alumnoService: AlumnoService,
    private institucionService: InstitucionService,
    private matriculadetalleService: MatriculadetalleService,
    private router: Router) {

    this.periodoService.todo().subscribe(({ ok, periodos }) => {
      if (ok) {
        this.periodos = periodos;
      }
    });
    this.aulaService.todo().subscribe(({ ok, aulas }) => {
      if (ok) {
        this.aulas = aulas;
      }
    });
    this.alumnoService.todo().subscribe({
      next: ({ ok, alumnos }) => {
        if (ok) {
          this.alumnos = alumnos;
        }
      }
    });
    this.institucion = this.institucionService.institucion;
  }

  ngOnInit(): void {
    this.matriculaForm = this.fb.group({
      periodoId: ['', Validators.required],
      aulaId: ['', Validators.required],
      alumnoId: ['', Validators.required],
    });
  }

  campoRequerido(campo: string) {
    if (this.matriculaForm.get(campo)?.getError('required') && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }

  campoInvalido(campo: string) {
    if (this.matriculaForm.get(campo)?.getError && this.formSubmitted && this.existeAlumno == false) {
      return true;
    } else {
      return false;
    }
  }
  alumnoSeleccionado() {
    if (this.selectedAlumno) {
      this.existeAlumno = true;
      this.alumno_numero = this.selectedAlumno[1];
      this.alumno_nombres = this.selectedAlumno[2];
      this.alumno_apellidopaterno = this.selectedAlumno[3];
      this.alumno_apellidomaterno = this.selectedAlumno[4];
      this.alumno_img = this.selectedAlumno[5];
      this.matriculaForm.controls['alumnoId'].setValue(this.selectedAlumno[0]);
    } else {
      this.existeAlumno = false;
      this.selectedAlumno = null;
      this.matriculaForm.controls['alumnoId'].setValue('');
    }
    this.programaciones = [];
  }

  generarMatricula() {
    this.formSubmitted = true;
    if (this.matriculaForm.valid) {
      let arrAula = (this.matriculaForm.get('aulaId')?.value).split(',');
      this.matriculadetalleService.existeMatriculadetalle(this.matriculaForm.get('periodoId')?.value,
        Number(arrAula[0]), this.matriculaForm.get('alumnoId')?.value)
        .subscribe(({ ok, msg }) => {
          if (ok) {
            Swal.fire(msg);
          } else {
            this.matriculadetalleService.listarmatriculadetallesAnterior(
              Number(this.matriculaForm.get('alumnoId')?.value))
              .subscribe({
                next: ({ ok }) => {
                  if (ok) {
                    this.matriculadetalleService.aprobadoAlumno(Number(this.matriculaForm.get('alumnoId')?.value))
                      .subscribe({
                        next: ({ ok, msg }) => {
                          if (ok) {
                            this.programacionService.porPeriodoAula(this.matriculaForm.get('periodoId')?.value,
                              this.matriculaForm.get('aulaId')?.value).subscribe(({ ok, programaciones }) => {
                                if (ok) {
                                  this.programaciones = programaciones;
                                  this.saveButton = false;
                                }
                              });
                          } else {
                            Swal.fire(msg);
                          }
                        }
                      });
                  } else {
                    this.programacionService.porPeriodoAula(this.matriculaForm.get('periodoId')?.value,
                      this.matriculaForm.get('aulaId')?.value).subscribe(({ ok, programaciones }) => {
                        if (ok) {
                          this.programaciones = programaciones;
                          this.saveButton = false;
                        }
                      });
                  }
                }
              });
          }
        });
    }
  }

  guardarMatricula() {
    this.formSubmitted = true;
    if (this.matriculaForm.valid && this.programaciones.length > 0) {
      Swal.fire({
        title: 'Guardar',
        text: "¿Desea crear la matricula?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Guardar'
      }).then((result) => {
        if (result.isConfirmed) {
          let matriculaObj = {
            alumnoId: this.matriculaForm.get('alumnoId')?.value
          }
          this.matriculaService.crear(matriculaObj).subscribe({
            next: ({ ok,msg, matricula }) => {
              if (ok) {
                this.programaciones.forEach(programacion => {
                  let matriculadetalleObj: Matriculadetalle = {
                    programacionId: Number(programacion.id),
                    matriculaId: Number(matricula.id),
                  };
                  this.matriculadetalleService.crear(matriculadetalleObj).subscribe({
                    next: ({ ok }) => {
                      if (ok) { }
                    }
                  })
                });
                this.router.navigateByUrl('dashboard/matriculas');
                Swal.fire({
                  position: 'top-end',
                  icon: 'success',
                  title: msg,
                  showConfirmButton: false,
                  timer: 1000
                });
              }
            }
          });
        }
      });
    }
  }
}
