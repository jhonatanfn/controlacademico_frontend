import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Aula } from 'src/app/models/aula.model';
import { Hora } from 'src/app/models/hora.model';
import { Periodo } from 'src/app/models/periodo.model';
import { Programacion } from 'src/app/models/programacion.model';
import { Subarea } from 'src/app/models/subarea.model';
import { AulaService } from 'src/app/services/aula.service';
import { HoraService } from 'src/app/services/hora.service';
import { HorarioService } from 'src/app/services/horario.service';
import { PeriodoService } from 'src/app/services/periodo.service';
import { SubareaService } from 'src/app/services/subarea.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-eliminar-horario',
  templateUrl: './eliminar-horario.component.html',
  styleUrls: ['./eliminar-horario.component.css']
})
export class EliminarHorarioComponent implements OnInit {

  public titulo: string = 'Eliminar Horarios';
  public icono: string = 'bi bi-x-circle';
  public titulo2: string = 'Horarios';
  public icono2: string = 'bi bi-calendar-check';
  public titulo3: string = 'Resumen';
  public icono3: string = 'bi bi-card-checklist';
  public horarioForm!: FormGroup;
  public periodos: Periodo[] = [];
  public aulas: Aula[] = [];
  public subareas: Subarea[] = [];
  public dias: any[] = [];
  public horas: Hora[] = [];
  public formSubmitted: boolean = false;
  public cargando: boolean = false;
  public datos: any[] = [];
  public intervalos: any[] = [];
  public datosSave: any[] = [];
  public columna: number = 0;
  public programaciones: Programacion[] = [];
  public message: string = "No hay horario";

  public aulanombre: string = "";
  public nivelnombre: string = "";
  public gradonombre: string = "";
  public seccionnombre: string = "";

  constructor(private fb: FormBuilder,
    private periodoService: PeriodoService, private aulaService: AulaService,
    private subareaService: SubareaService, private usuarioService: UsuarioService,
    private horarioService: HorarioService, private horaService: HoraService,
    private router: Router, private route: ActivatedRoute) {

    if (this.usuarioService.usuario.role.nombre === "ADMINISTRADOR") {
      this.dias = this.horarioService.dias;
      this.periodoService.todo().subscribe({
        next: ({ ok, periodos }) => {
          if (ok) {
            this.periodos = periodos;
          }
        }
      });
      this.aulaService.todo().subscribe({
        next: ({ ok, aulas }) => {
          if (ok) {
            this.aulas = aulas;
          }
        }
      });
      this.subareaService.todo().subscribe({
        next: ({ ok, subareas }) => {
          if (ok) {
            this.subareas = subareas;
          }
        }
      });
      this.horaService.todo().subscribe({
        next: ({ ok, horas }) => {
          if (ok) {
            this.horas = horas;
          }
        }
      });

      this.aulaService.obtener(Number(this.route.snapshot.paramMap.get('id')))
        .subscribe({
          next: ({ ok, aula }) => {
            if (ok) {
              this.aulanombre = aula.nombre;
              this.nivelnombre = aula.nivel.nombre;
              this.gradonombre = aula.grado.nombre;
              this.seccionnombre = aula.seccion.nombre;
              this.horarioForm.controls['aulaId'].setValue(aula.id);
            }
          }
        });

    }
  }

  ngOnInit(): void {
    this.horarioForm = this.fb.group({
      periodoId: ['', Validators.required],
      aulaId: ['', Validators.required]
    });
  }

  campoRequerido(campo: string) {
    if (this.horarioForm.get(campo)?.getError('required') && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }

  buscarHorario() {
    this.formSubmitted = true;
    this.datos = [];
    this.intervalos = [];
    if (this.horarioForm.valid) {
      this.cargando = true;
      let arrperiodos = (this.horarioForm.get('periodoId')?.value).split(',');

      this.horarioService.horariosPeriodoAula(
        Number(arrperiodos[0]),
        Number(this.horarioForm.get('aulaId')?.value))
        .subscribe({
          next: ({ horarios }) => {
            if (horarios.length > 0) {
              this.horas.forEach(objh => {
                this.dias.forEach(objd => {
                  let resultado = this.obtenerObjetoHorario(horarios, objd.nombre, objh.id!);
                  let objeto = {
                    id: resultado.id,
                    dia: objd,
                    hora: objh,
                    subareaId: resultado.subareaId,
                    programacionId: resultado.programacionId,
                    programacion: resultado.programacion
                  }
                  this.datos.push(objeto);
                });
              });

              let numerofilas = this.datos.length / 5;
              let inicioAux = 0;
              let finalAux = 5;
              let control = 1;

              while (control <= numerofilas) {
                this.intervalos.push({
                  inicio: inicioAux,
                  final: finalAux
                });
                inicioAux = finalAux;
                finalAux = finalAux + 5;
                control = control + 1;
              }
            }
            this.cargando = false;
          }
        });
    }
  }

  obtenerObjetoHorario(vector: any[], dia: string, hora: number) {
    let retorno = {
      id: 0,
      subareaId: 0,
      programacionId: 0,
      programacion: ""
    };
    vector.forEach(item => {
      if (item.dia === dia && item.horaId === hora) {
        retorno = {
          id: item.id,
          subareaId: item.programacion.subarea.id,
          programacionId: item.programacion.id,
          programacion: item.programacion
        }
      }
    });
    return retorno;
  }

  eliminarHorario() {
    this.formSubmitted = true;
    if (this.horarioForm.valid && this.datos.length > 0) {
      Swal.fire({
        title: 'Eliminar',
        text: "¿Desea eliminar el horario?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Eliminar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.datos.forEach(dato => {
            if (dato.hora.tipo === 1) {
              this.horarioService.borrar(Number(dato.id))
                .subscribe({
                  next: ({ ok }) => {
                    if (ok) { }
                  }
                });
            }
          });
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Horario eliminado exitosamente',
            showConfirmButton: false,
            timer: 1500
          });
          this.router.navigateByUrl('dashboard/horarios');
        }
      });
    }
  }
}
