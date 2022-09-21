import { AfterContentChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Area } from 'src/app/models/area.model';
import { Aula } from 'src/app/models/aula.model';
import { Docente } from 'src/app/models/docente.model';
import { Periodo } from 'src/app/models/periodo.model';
import { Programacion } from 'src/app/models/programacion.model';
import { Subarea } from 'src/app/models/subarea.model';
import { AreaService } from 'src/app/services/area.service';
import { AulaService } from 'src/app/services/aula.service';
import { DocenteService } from 'src/app/services/docente.service';
import { PeriodoService } from 'src/app/services/periodo.service';
import { ProgramacionService } from 'src/app/services/programacion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-programacion',
  templateUrl: './editar-programacion.component.html',
  styleUrls: ['./editar-programacion.component.css']
})
export class EditarProgramacionComponent implements OnInit, AfterContentChecked {

  public titulo1: string = "Detalle Asignación";
  public icono1: string = "bi bi-plus-square-fill";
  public titulo2: string = "Editar Asignación";
  public icono2: string = "bi bi-pen";
  public programacionForm!: FormGroup;
  public formSubmitted: boolean = false;
  public periodos: Periodo[] = [];
  public areas: Area[] = [];
  public docentes: Docente[] = [];
  public programaciones: Programacion[] = [];
  public aulas: Aula[] = [];
  public existe: boolean = false;
  public numeromat: number = 0;
  public programacionideditar: number = 0;

  constructor(private fb: FormBuilder,
    private programacionService: ProgramacionService,
    private periodoService: PeriodoService,
    private areaService: AreaService,
    private docenteService: DocenteService,
    private aulaService: AulaService,
    private route: ActivatedRoute,
    private changeDedectionRef: ChangeDetectorRef) {

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

    this.programacionService.obtener(Number(this.route.snapshot.paramMap.get('id')))
      .subscribe(({ ok, programacion }) => {
        if (ok) {
          this.programacionForm.controls['periodoId'].setValue(programacion.periodoId);
          this.programacionForm.controls['aulaId'].setValue(programacion.aulaId);
          this.programacionForm.controls['areaId'].setValue(programacion.area?.id);
          this.programacionForm.controls['docenteId'].setValue(programacion.docenteId);
          this.programacionForm.controls['numeromaxmat'].setValue(programacion.numeromaxmat);
          this.programacionForm.controls['numeromat'].setValue(programacion.numeromat);
          this.programacionForm.controls['id'].setValue(programacion.id);
          this.numeromat = Number(programacion.numeromat);
          this.programacionideditar = Number(programacion.id);
        }
      });
  }

  ngOnInit(): void {
    this.programacionForm = this.fb.group({
      periodoId: ['', Validators.required],
      aulaId: ['', Validators.required],
      areaId: ['', Validators.required],
      docenteId: ['', Validators.required],
      numeromaxmat: ['', Validators.required],
      numeromat: [''],
      id: ['']
    });
  }
  ngAfterContentChecked(): void {
    this.changeDedectionRef.detectChanges();
  }
  campoRequerido(campo: string) {
    if (this.programacionForm.get(campo)?.getError('required') && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }
  campoNumeros() {
    if (this.programacionForm.get('numeromaxmat')?.value >= 0) {
      return false;
    } else {
      return true;
    }
  }
  numeroPermitido() {
    if (this.programacionForm.get('numeromaxmat')?.value == "") {
      return;
    }
    if (this.programacionForm.get('numeromat')?.value > this.programacionForm.get('numeromaxmat')?.value
      && this.formSubmitted && !this.campoNumeros()) {
      this.programacionForm.controls['numeromaxmat'].setErrors({ Menor: true });
      return true;
    } else {
      this.programacionForm.controls['numeromaxmat'].setErrors(null);
      return false;
    }
  }

  actualizar() {

    this.formSubmitted = true;
    if (this.programacionForm.valid) {
      this.programacionService.existeProgramacionEditar(
        Number(this.programacionForm.get('periodoId')?.value),
        Number(this.programacionForm.get('aulaId')?.value),
        Number(this.programacionForm.get('areaId')?.value),
        this.programacionideditar
      ).subscribe({
        next: ({ ok, msg }) => {
          if (ok) {
            Swal.fire({
              position: 'top-end',
              icon: 'info',
              title: msg,
              showConfirmButton: false,
              timer: 1000
            });
          } else {
            Swal.fire({
              title: 'Actualizar',
              text: "¿Desea actualizar la asignación?",
              icon: 'question',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              cancelButtonText: 'Cancelar',
              confirmButtonText: 'Actualizar'
            }).then((result) => {
              if (result.isConfirmed) {
                this.programacionService.actualizar(this.programacionForm.get('id')?.value,
                  this.programacionForm.value)
                  .subscribe({
                    next: ({ ok, msg }) => {
                      if (ok) {
                        Swal.fire({
                          position: 'top-end',
                          icon: 'success',
                          title: msg,
                          showConfirmButton: false,
                          timer: 1000
                        });
                      }
                    },
                    error: (error)=>{
                      Swal.fire({
                        position: 'top-end',
                        icon: 'error',
                        title: error.error.msg,
                        showConfirmButton: false,
                        timer: 1000
                      });
                    }
                  });
              }
            });
          }
        }
      })
    }
  }

}
