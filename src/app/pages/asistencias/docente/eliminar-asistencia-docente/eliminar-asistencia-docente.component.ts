import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Ciclo } from 'src/app/models/ciclo.model';
import { Evaluacion } from 'src/app/models/evaluacion.model';
import { Matricula } from 'src/app/models/matricula.model';
import { Periodo } from 'src/app/models/periodo.model';
import { Programacion } from 'src/app/models/programacion.model';
import { AsistenciaService } from 'src/app/services/asistencia.service';
import { MenuService } from 'src/app/services/menu.service';
import { ProgramacionService } from 'src/app/services/programacion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-eliminar-asistencia-docente',
  templateUrl: './eliminar-asistencia-docente.component.html',
  styleUrls: ['./eliminar-asistencia-docente.component.css']
})
export class EliminarAsistenciaDocenteComponent implements OnInit {

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
  public evaluaciones: Evaluacion[] = [];
  public matriculas: Matricula[] = [];
  public datos: any[] = [];
  public formSubmitted: boolean = false;
  public cargando:boolean= false;

  public periodonombre:string="";
  public aulanombre:string="";
  public subareanombre:string="";
  public areanombre:string="";
  public docentenombre:string="";
  
  constructor(private menuService: MenuService, private fb: FormBuilder, 
    private asistenciaService:AsistenciaService,
    private route: ActivatedRoute, private programacionService:ProgramacionService) {

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
      fecha: ['',Validators.required]
    });
  }
  campoRequerido(campo: string) {
    if (this.asisForm.get(campo)?.getError('required') && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }

  buscarMatriculas() {
    this.formSubmitted = true;
   
    if (this.asisForm.valid) {

      this.asistenciaService.asistenciasProgramacionFecha(
        Number(this.route.snapshot.paramMap.get('id')),
        this.asisForm.controls['fecha'].value)

        .subscribe(({ ok, asistencias }) => {
          if (ok) {
            this.datos = asistencias;
          }
        });

    }

  }

  limpiarTabla(){
    this.formSubmitted = true;
    this.cargando= true;
    if(this.asisForm.get('fecha')?.value===""){
      this.datos= [];
      this.cargando= false;
      return;
    }else{
      if (this.asisForm.valid) {
        this.asistenciaService.asistenciasProgramacionFecha(
          Number(this.route.snapshot.paramMap.get('id')),
          this.asisForm.controls['fecha'].value)
          .subscribe(({ ok, asistencias }) => {
            if (ok) {
              this.datos = asistencias;
              this.cargando= false;
            }
          });
      }
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

  eliminarAsistencias() {
    this.formSubmitted = true;
    if (this.asisForm.valid) {

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
              title: 'Registro eliminado exitosamente',
              showConfirmButton: false,
              timer: 1500
            });
            this.datos= [];

          }
        })
      
    }

  }

}
