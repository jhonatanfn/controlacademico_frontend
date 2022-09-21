import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { AsistenciaService } from 'src/app/services/asistencia.service';
import { AulaService } from 'src/app/services/aula.service';
import { PeriodoService } from 'src/app/services/periodo.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-asistencia-auxiliar',
  templateUrl: './editar-asistencia-auxiliar.component.html',
  styleUrls: ['./editar-asistencia-auxiliar.component.css']
})
export class EditarAsistenciaAuxiliarComponent implements OnInit {

  public titulo: string = 'Editar Asistencias';
  public icono: string = 'bi bi-pen';
  public titulo2: string = 'Tabla Alumnos';
  public icono2: string = 'bi bi-table';
  public titulo3: string = 'Datos de la Asignación';
  public icono3: string = 'bi bi-card-checklist';
  public datos: any[] = [];
  public cargando: boolean = false;
  public periodonombre: string = "";
  public aulanombre: string = "";
  public fecha: string = "";

  constructor(private asistenciaService: AsistenciaService, private periodoService: PeriodoService,
    private route: ActivatedRoute, private aulaService: AulaService) {

    this.aulaService.obtener(Number(this.route.snapshot.paramMap.get('id'))).subscribe({
      next: ({ ok, aula }) => {
        if (ok) {
          this.aulanombre = aula.nombre;
        }
      }
    });
  }

  ngOnInit(): void {
  }

  buscarMatriculas() {
    this.cargando = true;
    if (this.fecha) {
      this.periodoService.porNombre(moment(this.fecha).format('YYYY')).subscribe({
        next: ({ ok, periodo }) => {
          if (ok) {
            this.periodonombre = periodo.nombre;

            this.asistenciaService.listadoAsistencias(Number(periodo.id),
              Number(this.route.snapshot.paramMap.get('id')), this.fecha).subscribe({
                next: ({ ok, asistencias }) => {
                  if (ok) {
                    this.datos = asistencias;
                  }
                }
              });
          }
        }
      });
    }
    this.cargando = false;
  }
  cambiarEstado(dato: any) {
    if (dato.situacionId == 14) {
      dato.situacionId = 4;
      dato.situacion.nombre = "FALTÓ";
      dato.situacion.color = "danger";
    } else {
      if (dato.situacionId == 4) {
        dato.situacionId = 34;
        dato.situacion.nombre = "TARDANZA";
        dato.situacion.color = "warning";
      } else {
        if (dato.situacionId == 34) {
          dato.situacionId = 24;
          dato.situacion.nombre = "JUSTIFICÓ";
          dato.situacion.color = "primary";
        } else {
          dato.situacionId = 14;
          dato.situacion.nombre = "ASISTIÓ";
          dato.situacion.color = "success";
        }
      }
    }
  }

  actualizarAsistencias() {

    Swal.fire({
      title: 'Actualizar',
      text: "¿Desea actualizar las asistencias?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Actualizar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.datos.forEach(dato => {
          this.asistenciaService.actualizar(dato.id, dato)
            .subscribe(({ ok }) => {
              if (ok) {
              }
            });
        });
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Asistencia actualizada exitosamente',
          showConfirmButton: false,
          timer: 1000
        })
      }
    });
  }

}
