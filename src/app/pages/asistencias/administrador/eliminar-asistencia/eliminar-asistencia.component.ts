import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { AsistenciaService } from 'src/app/services/asistencia.service';
import { AulaService } from 'src/app/services/aula.service';
import { PeriodoService } from 'src/app/services/periodo.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-eliminar-asistencia',
  templateUrl: './eliminar-asistencia.component.html',
  styleUrls: ['./eliminar-asistencia.component.css']
})
export class EliminarAsistenciaComponent implements OnInit {

  public titulo: string = 'Eliminar Asistencias';
  public icono: string = 'bi bi-x-circle';
  public titulo2: string = 'Tabla Alumnos';
  public icono2: string = 'bi bi-table';
  public titulo3: string = 'Datos de la Asignación';
  public icono3: string = 'bi bi-card-checklist';
  public datos: any[] = [];
  public cargando: boolean = false;
  public periodonombre: string = "";
  public aulanombre: string = "";
  public fecha: string = "";

  constructor(private asistenciaService: AsistenciaService,
    private route: ActivatedRoute, private aulaService: AulaService,
    private periodoService: PeriodoService) {

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


  eliminarAsistencias() {

    if (this.fecha == moment().format('YYYY-MM-DD')) {
      Swal.fire({
        title: 'Eliminar',
        text: "¿Desea eliminar las asistencias?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Eliminar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.datos.forEach(dato => {
            this.asistenciaService.borrar(dato.id)
              .subscribe(({ ok }) => {
                if (ok) {
                }
              });
          });
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Asistencia eliminada exitosamente',
            showConfirmButton: false,
            timer: 1000
          });
          this.datos = [];
        }
      });
    } else {
      Swal.fire({
        position: 'top-end',
        icon: 'info',
        title: 'No se puede eliminar la asistencia',
        showConfirmButton: false,
        timer: 1000
      });
    }
  }

}
