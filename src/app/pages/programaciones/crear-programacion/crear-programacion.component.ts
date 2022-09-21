import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Area } from 'src/app/models/area.model';
import { Aula } from 'src/app/models/aula.model';
import { Docente } from 'src/app/models/docente.model';
import { Grado } from 'src/app/models/grado.model';
import { Nivel } from 'src/app/models/nivel.model';
import { Periodo } from 'src/app/models/periodo.model';
import { Programacion } from 'src/app/models/programacion.model';
import { Seccion } from 'src/app/models/seccion.model';
import { Subarea } from 'src/app/models/subarea.model';
import { AreaService } from 'src/app/services/area.service';
import { AulaService } from 'src/app/services/aula.service';
import { DocenteService } from 'src/app/services/docente.service';
import { PeriodoService } from 'src/app/services/periodo.service';
import { ProgramacionService } from 'src/app/services/programacion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-programacion',
  templateUrl: './crear-programacion.component.html',
  styleUrls: ['./crear-programacion.component.css']
})
export class CrearProgramacionComponent implements OnInit {

  public titulo1: string = "Nueva Asignación";
  public icono1: string = "bi bi-plus-square";
  public titulo2: string = "Listado de Asignaciones";
  public icono2: string = "bi bi-justify";
  public programacionForm!: FormGroup;
  public formSubmitted: boolean = false;
  public periodos: Periodo[] = [];
  public niveles: Nivel[] = [];
  public grados: Grado[] = [];
  public secciones: Seccion[] = [];
  public areas: Area[] = [];
  public docentes: Docente[] = [];
  public programaciones: any[] = [];
  public programacionesAux: any[] = [];
  public aulas: Aula[] = [];
  public existe: boolean = false;

  constructor(private fb: FormBuilder,
    private programacionService: ProgramacionService,
    private periodoService: PeriodoService,
    private areaService: AreaService,
    private docenteService: DocenteService,
    private aulaService: AulaService,
    private router: Router) {

    this.periodoService.todo().subscribe(({ periodos }) => {
      this.periodos = periodos;
    });
    this.areaService.todo().subscribe(({ areas }) => {
      this.areas = areas;
    });
    this.docenteService.todo().subscribe(({ docentes }) => {
      this.docentes = docentes;
    });
    this.aulaService.todo().subscribe(({ aulas }) => {
      this.aulas = aulas;
    });

  }

  ngOnInit(): void {
    this.programacionForm = this.fb.group({
      periodoId: ['', Validators.required],
      aulaId: ['', Validators.required],
      areaId: ['', Validators.required],
      docenteId: ['', Validators.required]
    });
  }
  campoRequerido(campo: string) {
    if (this.programacionForm.get(campo)?.getError('required') && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }
  obtenerId(campo: string) {
    return Number(this.programacionForm.get(campo)?.value);
  }
  obtenerObjeto(lista: any[], id: number, campo: string) {
    lista.forEach(objeto => {
      if (objeto.id == id) {
        this.programacionForm.controls[campo].setValue(objeto);
      }
    });
  }
  agregarProgramacion() {
    this.formSubmitted = true;
    this.existe = false;
    if (this.programacionForm.valid) {
      let arrPeriodo = (this.programacionForm.get('periodoId')?.value).split(',');
      let arrAula = (this.programacionForm.get('aulaId')?.value).split(',');
      let arrArea = (this.programacionForm.get('areaId')?.value).split(',');
      let arrDocente = (this.programacionForm.get('docenteId')?.value).split(',');

      this.programacionService.existeProgramacion(arrPeriodo[0], arrAula[0], arrArea[0])
        .subscribe({
          next: ({ ok, msg }) => {
            if (ok) {
              Swal.fire(msg);
            } else {
              if (this.programaciones.length > 0) {
                this.programaciones.forEach(programacion => {
                  if (programacion.periodoId === arrPeriodo[0] && programacion.aulaId === arrAula[0] &&
                    programacion.areaId === arrArea[0]) {
                    this.existe = true;
                  }
                });
              }
              if (!this.existe) {
                let objeto: any = {
                  periodoId: arrPeriodo[0],
                  periodoNombre: arrPeriodo[1],
                  aulaId: arrAula[0],
                  aulaNombre: arrAula[1],
                  areaId: arrArea[0],
                  areaNombre: arrArea[1],
                  docenteId: arrDocente[0],
                  docenteNombres: arrDocente[1],
                  docenteApellidoP: arrDocente[2],
                  docenteApellidoM: arrDocente[3],
                };
                this.programaciones.push(objeto);
              } else {
                Swal.fire('La asignación ya existe.');
              }
            }
          },
          error: (error) => {
            Swal.fire({
              position: 'top-end',
              icon: 'error',
              title: 'Se produjo un error.Hable con el administrador.',
              showConfirmButton: false,
              timer: 1000
            })
          }
        })
    }
  }
  eliminarProgramacion(p: Programacion) {
    this.programacionesAux = JSON.parse(JSON.stringify(this.programaciones));
    this.programaciones = [];
    this.programacionesAux.forEach(elemento => {
      if (elemento.periodoId == p.periodoId && elemento.aulaId == p.aulaId &&
        elemento.areaId == p.areaId && elemento.docenteId == p.docenteId) {
      } else {
        this.programaciones.push(elemento);
      }
    });
  }

  guardar() {
    Swal.fire({
      title: 'Guardar',
      text: "¿Desea guardar la asignación?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Guardar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.programaciones.forEach(programacion => {
          this.programacionService.crear(programacion)
            .subscribe(({ ok }) => {
              if (ok) {
              }
            });
        });
        this.router.navigateByUrl('dashboard/asignaciones');
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Registro guardado exitosamente',
          showConfirmButton: false,
          timer: 1000
        })
      }
    })
  }
}
