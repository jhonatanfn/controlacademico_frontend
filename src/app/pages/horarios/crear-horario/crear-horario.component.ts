import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Aula } from 'src/app/models/aula.model';
import { Hora } from 'src/app/models/hora.model';
import { Periodo } from 'src/app/models/periodo.model';
import { Programacion } from 'src/app/models/programacion.model';
import { Subarea } from 'src/app/models/subarea.model';
import { AulaService } from 'src/app/services/aula.service';
import { HoraService } from 'src/app/services/hora.service';
import { HorarioService } from 'src/app/services/horario.service';
import { PeriodoService } from 'src/app/services/periodo.service';
import { ProgramacionService } from 'src/app/services/programacion.service';
import { SubareaService } from 'src/app/services/subarea.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-horario',
  templateUrl: './crear-horario.component.html',
  styleUrls: ['./crear-horario.component.css']
})
export class CrearHorarioComponent implements OnInit {

  public titulo: string = 'Crear Horarios';
  public icono: string = 'bi bi-plus-square';
  public titulo2: string = 'Horarios';
  public icono2: string = 'bi bi-calendar-check';
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

  constructor(private fb: FormBuilder,
    private periodoService: PeriodoService, private aulaService: AulaService,
    private subareaService: SubareaService, private usuarioService: UsuarioService,
    private horarioService: HorarioService, private horaService: HoraService,
    private programacionService: ProgramacionService,private router:Router) {

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
      })
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

  agregarHorario() {
    this.formSubmitted = true;
    this.datos = [];
    this.intervalos=[];
    if (this.horarioForm.valid) {
      this.cargando = true;
      let arrperiodos = (this.horarioForm.get('periodoId')?.value).split(',');
      let arraulas = (this.horarioForm.get('aulaId')?.value).split(',');

      this.horarioService.hayHorarioPeriodoAula(Number(arrperiodos[0]), Number(arraulas[0]))
        .subscribe({
          next: ({ horarios }) => {
            if (horarios.length > 0) {
              this.message = "Ya existe un horario registrado para el aula: " + arraulas[1];
            } else {
              this.horas.forEach(objh => {
                this.dias.forEach(objd => {
                  let objeto = {
                    dia: objd,
                    hora: objh,
                    subareaId: 0,
                    programacionId: 0
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

  obtenerProgramacion(vector: any[], periodo: number, aula: number, subarea: number) {
    let retorno = 0;
    vector.forEach(objeto => {
      if (objeto.periodoId === periodo && objeto.aulaId === aula && objeto.subareaId === subarea) {
        retorno = objeto.id;
      }
    });
    return retorno;
  }

  existeEnDatos(vector: any[], periodoId: number, aulaId: number, diaNombre: string, horaId: number) {
    let resultado = false;
    vector.forEach(objeto => {
      if (objeto.periodoId === periodoId &&
        objeto.aulaId === aulaId &&
        objeto.dia === diaNombre &&
        objeto.horaId === horaId) {
        resultado = true;
      }
    });
    return resultado;
  }

  guardarHorario() {
    this.formSubmitted = true;
    if (this.horarioForm.valid && this.datos.length>0) {
      let arrperiodos = (this.horarioForm.get('periodoId')?.value).split(',');
      let arraulas = (this.horarioForm.get('aulaId')?.value).split(',');
      this.datosSave = [];

      this.programacionService.porPeriodoAula(Number(arrperiodos[0]), Number(arraulas[0]))
        .subscribe({
          next: ({ ok, programaciones }) => {
            if (ok) {
              this.programaciones = programaciones;
              this.datos.forEach(dato => {
                let horario = {
                  dia: dato.dia.nombre,
                  horaId: dato.hora.id,
                  tipoId: dato.hora.tipo,
                  programacionId: this.obtenerProgramacion(this.programaciones,
                    Number(arrperiodos[0]), Number(arraulas[0]), Number(dato.subareaId))
                }
                this.datosSave.push(horario);
              });
              
              let resultado = this.verificaSinProgramacion(this.datosSave);
              if (resultado) {
                Swal.fire({
                  position: 'top-end',
                  icon: 'info',
                  title: "El horario esta incompleto.",
                  showConfirmButton: false,
                  timer: 1500
                });
              } else {
                Swal.fire({
                  title: 'Guardar',
                  text: "¿Desea crear el horario?",
                  icon: 'question',
                  showCancelButton: true,
                  confirmButtonColor: '#3085d6',
                  cancelButtonColor: '#d33',
                  cancelButtonText: 'Cancelar',
                  confirmButtonText: 'Guardar'
                }).then((result) => {
                  if (result.isConfirmed) {
                   
                    this.datosSave.forEach(datosave => {
                      if(datosave.tipoId===1){
                        this.horarioService.crear(datosave).subscribe({
                          next: ({ ok }) => { }
                        });
                      }

                    });
                    Swal.fire({
                      position: 'top-end',
                      icon: 'success',
                      title: 'Horario creado exitosamente',
                      showConfirmButton: false,
                      timer: 1500
                    });
                    this.router.navigateByUrl('dashboard/horarios');
                  }
                });
              }
            }
          }
        });
    }
  }

  verificaSinProgramacion(vector: any[]) {
    let resultado = false;
    vector.forEach(objeto => {
      if (objeto.programacionId === 0 && objeto.tipoId===1) {
        resultado = true;
      }
    });
    return resultado;
  }

  verificaSeleccion(dato: any) {
    let arrperiodos = (this.horarioForm.get('periodoId')?.value).split(',');
    let arraulas = (this.horarioForm.get('aulaId')?.value).split(',');
    this.horarioService.horarioDuplicado(
      Number(arrperiodos[0]),
      Number(arraulas[0]),
      Number(dato.subareaId),
      dato.dia.nombre,
      dato.hora.id
    ).subscribe({
      next: ({ ok }) => {
        if (ok) {
          dato.subareaId = 0;
          Swal.fire({
            position: 'top-end',
            icon: 'info',
            title: "No es posible registrar la subarea.",
            showConfirmButton: false,
            timer: 1000
          });
        }
      }
    });
  }

}
