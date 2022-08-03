import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { Ciclo } from 'src/app/models/ciclo.model';
import { Matricula } from 'src/app/models/matricula.model';
import { Periodo } from 'src/app/models/periodo.model';
import { Programacion } from 'src/app/models/programacion.model';
import { AsistenciaService } from 'src/app/services/asistencia.service';
import { MatriculaService } from 'src/app/services/matricula.service';
import { MenuService } from 'src/app/services/menu.service';
import { ProgramacionService } from 'src/app/services/programacion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-asistencia',
  templateUrl: './crear-asistencia.component.html',
  styleUrls: ['./crear-asistencia.component.css']
})
export class CrearAsistenciaComponent implements OnInit {

  public titulo: string = '';
  public icono: string = '';
  public titulo2: string = 'Alumnos';
  public icono2: string = 'bi bi-people-fill';
  public titulo3: string = 'Resumen';
  public icono3: string = 'bi bi-card-checklist';
  public asisForm!: FormGroup;
  public periodos: Periodo[] = [];
  public programaciones: Programacion[] = [];
  public ciclos: Ciclo[] = [];
  public matriculas: Matricula[] = [];
  public datos: any[] = [];
  public formSubmitted: boolean = false;
  public messageInfo:string="";

  public periodonombre:string="";
  public aulanombre:string="";
  public subareanombre:string="";
  public areanombre:string="";
  public docentenombre:string="";

  public cargando:boolean= false;

  constructor(private menuService: MenuService, private fb: FormBuilder,
    private matriculaService: MatriculaService,
    private asistenciaService: AsistenciaService, private route: ActivatedRoute,
    private programacionService:ProgramacionService) {

    this.menuService.getTituloRuta()
      .subscribe(({ titulo, icono }) => {
        this.titulo = titulo;
        this.icono = icono;
      });

      
    this.programacionService.obtener( Number(this.route.snapshot.paramMap.get('id')) )
    .subscribe({
      next: ({ok,programacion})=>{
        if(ok){
          this.periodonombre= programacion.periodo?.nombre || "";
          this.aulanombre= programacion.aula?.nombre || "";
          this.subareanombre= programacion.subarea?.nombre || "";
          this.docentenombre= programacion.docente?.persona?.apellidopaterno+" "+
          programacion.docente?.persona?.apellidomaterno+" "+
          programacion.docente?.persona?.nombres;
          this.areanombre= programacion.subarea?.area.nombre || "";
        }
      }
    });

  }

  ngOnInit(): void {
    this.asisForm = this.fb.group({
      fecha: [moment().format("YYYY-MM-DD"), Validators.required]
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

  esfechaactual(campo: string) {

    if (this.asisForm.get(campo)?.value === "") {
      return;
    } else {
      if ((this.asisForm.get(campo)?.value === moment().format("YYYY-MM-DD")) && this.formSubmitted) {
        this.asisForm.controls[campo].setErrors(null);
        return false;
      } else {
        this.asisForm.controls[campo].setErrors({ NoActual: true });
        return true;
      }
    }

  }

  buscarMatriculas() {
    this.cargando= true;
    this.asistenciaService.existeAsistenciaProgramacionFecha(
      Number(this.route.snapshot.paramMap.get('id')),
      this.asisForm.get('fecha')?.value
    ).subscribe({
      next: ({ok,msg}) => {
        if (!ok) {
          this.matriculaService.matriculasPorProgramacion(Number(this.route.snapshot.paramMap.get('id')))
            .subscribe(({ ok,msg, matriculas }) => {
              if (ok) {
                this.matriculas = matriculas;
                this.matriculas.forEach(matricula => {
                  this.datos.push({
                    matricula: matricula,
                    matriculaId: matricula.id,
                    situacionId: 14,
                    color: "success",
                    texto: "ASISTIO"
                  });
                });
              }else{
                this.messageInfo=msg;
              }
              this.cargando= false;
            });

        }else{
          this.messageInfo=msg;
        }
        this.cargando= false;
      },
      error: (err) => {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: err.error.msg,
          showConfirmButton: false,
          timer: 1500
        });
      }
    });

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
          const fecha = moment().format("YYYY-MM-DD");
          this.datos.forEach(dato => {
            dato.fecha = fecha;
            if (dato.color == "danger") {
              dato.situacionId = 4;
            } else {
              if (dato.color == "success") {
                dato.situacionId = 14;
              } else {
                dato.situacionId = 24;
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
            title: 'Registro guardado exitosamente',
            showConfirmButton: false,
            timer: 1500
          });
        }
      })

    }
  }

  cambiarEstado(dato: any) {
    if (dato.color == "primary") {
      dato.color = "danger";
      dato.texto = "FALTO";
    } else {
      if (dato.color == "danger") {
        dato.color = "success";
        dato.texto = "ASISTIO";
      } else {
        dato.color = "primary";
        dato.texto = "JUSTIFICÓ";
      }
    }
  }

}
