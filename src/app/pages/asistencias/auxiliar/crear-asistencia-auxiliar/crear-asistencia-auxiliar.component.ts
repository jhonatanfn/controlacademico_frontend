import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { AsistenciaService } from 'src/app/services/asistencia.service';
import { AulaService } from 'src/app/services/aula.service';
import { MatriculadetalleService } from 'src/app/services/matriculadetalle.service';
import { PeriodoService } from 'src/app/services/periodo.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-asistencia-auxiliar',
  templateUrl: './crear-asistencia-auxiliar.component.html',
  styleUrls: ['./crear-asistencia-auxiliar.component.css']
})
export class CrearAsistenciaAuxiliarComponent implements OnInit {

  public titulo: string = 'Crear Asistencias';
  public icono: string = 'bi bi-plus-square';
  public titulo2: string = 'Tabla Alumnos';
  public icono2: string = 'bi bi-table';
  public titulo3: string = 'Datos de la Asignación';
  public icono3: string = 'bi bi-card-checklist';
  public asisForm!: FormGroup;
  public datos: any[] = [];
  public formSubmitted: boolean = false;
  public messageInfo: string = "";
  public periodoId: number = 0;
  public periodonombre: string = "";
  public aulanombre: string = "";
  public cargando: boolean = false;

  constructor(private fb: FormBuilder,
    private matriculadetalleService: MatriculadetalleService,
    private asistenciaService: AsistenciaService,
    private route: ActivatedRoute, private periodoService: PeriodoService,
    private aulaService: AulaService) {

    this.aulaService.obtener(Number(this.route.snapshot.paramMap.get('id'))).subscribe({
      next: ({ ok, aula }) => {
        if (ok) {
          this.aulanombre = aula.nombre;
        }
      }
    });

  }

  ngOnInit(): void {
    this.asisForm = this.fb.group({
      fecha: [moment().format("YYYY-MM-DD"), Validators.required],
      matriculadetalleId: [''],
      situacionId: [''],
      aulaId: [Number(this.route.snapshot.paramMap.get('id'))]
    });
    this.buscarMatriculas();
  }

  campoRequerido(campo: string) {
    if (this.asisForm.get(campo)?.getError('required') && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }

  buscarMatriculas() {
    this.cargando = true;
    this.periodoService.porNombre(moment().format('YYYY')).subscribe({
      next: ({ ok, periodo }) => {
        if (ok) {
          this.periodonombre = periodo.nombre;
          this.asistenciaService.existeAsistencia(Number(periodo.id),
            Number(this.asisForm.get('aulaId')?.value), moment().format("YYYY-MM-DD")).subscribe({
              next: ({ ok, msg }) => {
                if (!ok) {
                  this.periodoId = Number(periodo.id);
                  this.matriculadetalleService.listadoAlumnos(this.periodoId,
                    Number(this.asisForm.get('aulaId')?.value))
                    .subscribe({
                      next: ({ ok, msg, matriculadetalles }) => {
                        if (ok) {
                          this.datos = [];
                          matriculadetalles.forEach(matriculadetalle => {
                            this.datos.push({
                              matriculadetalleId: matriculadetalle.id,
                              matriculadetalle: matriculadetalle,
                              situacionId: 14,
                              color: "success",
                              texto: "ASISTIÓ"
                            });
                          });
                          this.cargando = false;
                        } else {
                          this.messageInfo = msg;
                        }
                      },
                      error: (error) => {
                        Swal.fire({
                          position: 'top-end',
                          icon: 'error',
                          title: error.error.msg,
                          showConfirmButton: false,
                          timer: 1000
                        });
                      }
                    });
                } else {
                  this.messageInfo = msg;
                }
              }
            });
            this.cargando= false;
        }
      }
    });
  }

  cambiarEstado(dato: any) {
    if (dato.color == "success") {
      dato.color = "danger";
      dato.texto = "FALTO";
    } else {
      if (dato.color == "danger") {
        dato.color = "warning";
        dato.texto = "TARDANZA";
      } else {
        if (dato.color == "warning") {
          dato.color = "primary";
          dato.texto = "JUSTIFICÓ";
        } else {
          dato.color = "success";
          dato.texto = "ASISTIÓ";
        }
      }
    }
  }

  guardarAsistencias() {
    this.formSubmitted = true;
    if (this.asisForm.valid) {
      Swal.fire({
        title: 'Guardar',
        text: "¿Desea guardar las asistencias?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Guardar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.datos.forEach(dato => {
            if (dato.color == "danger") {
              dato.situacionId = 4;
            } else {
              if (dato.color == "success") {
                dato.situacionId = 14;
              } else {
                if(dato.color =="primary"){
                  dato.situacionId = 24;
                }else{
                  dato.situacionId = 34;
                }
              }
            }
            this.asistenciaService.crear(dato)
              .subscribe(({ ok }) => {
                if (ok) {
                }
              });
          });
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Asistencia guardada exitosamente',
            showConfirmButton: false,
            timer: 1000
          });
        }
      });
    }
  }

}
