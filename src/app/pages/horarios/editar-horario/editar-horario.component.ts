import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Area } from 'src/app/models/area.model';
import { Aula } from 'src/app/models/aula.model';
import { Hora } from 'src/app/models/hora.model';
import { Periodo } from 'src/app/models/periodo.model';
import { Programacion } from 'src/app/models/programacion.model';
import { Subarea } from 'src/app/models/subarea.model';
import { AreaService } from 'src/app/services/area.service';
import { AulaService } from 'src/app/services/aula.service';
import { HoraService } from 'src/app/services/hora.service';
import { HorarioService } from 'src/app/services/horario.service';
import { PeriodoService } from 'src/app/services/periodo.service';
import { ProgramacionService } from 'src/app/services/programacion.service';
import { SubareaService } from 'src/app/services/subarea.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-horario',
  templateUrl: './editar-horario.component.html',
  styleUrls: ['./editar-horario.component.css']
})
export class EditarHorarioComponent implements OnInit {

  public titulo: string = 'Editar Horarios';
  public icono: string = 'bi bi-pen';
  public titulo2: string = 'Horarios';
  public icono2: string = 'bi bi-calendar-check';
  public titulo3: string = 'Datos del Horario';
  public icono3: string = 'bi bi-card-checklist';
  public horarioForm!: FormGroup;
  public periodos: Periodo[] = [];
  public aulas: Aula[] = [];
  public areas: Area[] = [];
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
    private areaService: AreaService, private usuarioService: UsuarioService,
    private horarioService: HorarioService, private horaService: HoraService,
    private programacionService: ProgramacionService, private router: Router,
    private route: ActivatedRoute) {


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
      this.areaService.todo().subscribe({
        next: ({ ok, areas }) => {
          if (ok) {
            this.areas = areas;
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
                    areaId: resultado.areaId,
                    programacionId: resultado.programacionId
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
      areaId: 0,
      programacionId: 0
    };
    vector.forEach(item => {
      if (item.dia === dia && item.horaId === hora) {
        retorno = {
          id: item.id,
          areaId: item.programacion.area.id,
          programacionId: item.programacion.id
        }
      }
    });
    return retorno;
  }

  obtenerProgramacion(vector: any[], periodo: number, aula: number, area: number) {
    let retorno = 0;
    vector.forEach(objeto => {
      if (objeto.periodoId === periodo && objeto.aulaId === aula && objeto.areaId === area) {
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

  actualizarHorario() {
    this.formSubmitted = true;
    if (this.horarioForm.valid && this.datos.length > 0) {
      let arrperiodos = (this.horarioForm.get('periodoId')?.value).split(',');
      this.datosSave = [];

      this.programacionService.porPeriodoAula(Number(arrperiodos[0]),
        Number(this.horarioForm.get('aulaId')?.value))
        .subscribe({
          next: ({ ok, programaciones }) => {
            if (ok) {
              this.programaciones = programaciones;
              this.datos.forEach(dato => {
                let horario = {
                  id: dato.id,
                  dia: dato.dia.nombre,
                  horaId: dato.hora.id,
                  tipoId: dato.hora.tipo,
                  programacionId: this.obtenerProgramacion(this.programaciones,
                    Number(arrperiodos[0]),
                    Number(this.horarioForm.get('aulaId')?.value),
                    Number(dato.areaId))
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
                  title: 'Actualizar',
                  text: "¿Desea actualizar el horario?",
                  icon: 'question',
                  showCancelButton: true,
                  confirmButtonColor: '#3085d6',
                  cancelButtonColor: '#d33',
                  cancelButtonText: 'Cancelar',
                  confirmButtonText: 'Actualizar'
                }).then((result) => {
                  if (result.isConfirmed) {
                    this.datosSave.forEach(datosave => {
                      if (datosave.tipoId === 1) {
                        this.horarioService.actualizar(Number(datosave.id), datosave).subscribe({
                          next: ({ ok }) => { }
                        });
                      }
                    });
                    Swal.fire({
                      position: 'top-end',
                      icon: 'success',
                      title: 'Horario actualizado exitosamente',
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
      if (objeto.programacionId === 0 && objeto.tipoId === 1) {
        resultado = true;
      }
    });
    return resultado;
  }

  verificaSeleccion(dato: any) {
    
    let arrperiodos = (this.horarioForm.get('periodoId')?.value).split(',');
    this.horarioService.horarioDuplicado(
      Number(arrperiodos[0]),
      Number(this.horarioForm.get('aulaId')?.value),
      Number(dato.subareaId),
      dato.dia.nombre,
      dato.hora.id
    ).subscribe({
      next: ({ ok }) => {
        if (ok) {
          this.horarioService.obtener(Number(dato.id))
            .subscribe({
              next: ({ ok, horario }) => {
                if (ok) {
                  dato.subareaId = horario.programacion?.area?.id;
                  if (dato.id != horario.id) {
                    Swal.fire({
                      position: 'top-end',
                      icon: 'info',
                      title: "No es posible registrar la subarea.",
                      showConfirmButton: false,
                      timer: 1500
                    });
                  }
                }
              }
            });
        }
      }
    });
  }

}
