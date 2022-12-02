import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Aula } from 'src/app/models/aula.model';
import { Ciclo } from 'src/app/models/ciclo.model';
import { Matriculadetalle } from 'src/app/models/matriculadetalle';
import { Periodo } from 'src/app/models/periodo.model';
import { ApreciacionService } from 'src/app/services/apreciacion.service';
import { ApreciaciondetalleService } from 'src/app/services/apreciaciondetalle.service';
import { AulaService } from 'src/app/services/aula.service';
import { CicloService } from 'src/app/services/ciclo.service';
import { MatriculadetalleService } from 'src/app/services/matriculadetalle.service';
import { PeriodoService } from 'src/app/services/periodo.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-apreciacion',
  templateUrl: './crear-apreciacion.component.html',
  styleUrls: ['./crear-apreciacion.component.css']
})
export class CrearApreciacionComponent implements OnInit {

  public titulo: string = 'Buscar alumno';
  public icono: string = 'bi bi-search';
  public titulo2: string = 'Apreciaciones';
  public icono2: string = 'bi bi-chat-text';
  public apreciacionForm!: FormGroup;
  public periodos: Periodo[] = [];
  public aulas: Aula[] = [];
  public matriculadetalles: Matriculadetalle[] = [];
  public formSubmitted: boolean = false;
  public apreciaciondetalles: any[] = [];
  public ciclos: Ciclo[] = [];
  public existeAp: boolean = false;
  public escalas: any[] = [
    { id: 1, nombre: "AD" },
    { id: 2, nombre: "A" },
    { id: 3, nombre: "B" },
    { id: 4, nombre: "C" },
    { id: 5, nombre: "-" },
  ];

  constructor(private fb: FormBuilder,
    private periodoService: PeriodoService, private aulaService: AulaService,
    private matriculadetalleService: MatriculadetalleService,
    private cicloService: CicloService, private apreciacionService: ApreciacionService,
    private apreciaciondetalleService: ApreciaciondetalleService, private router: Router) {
    this.periodoService.todo().subscribe(({ ok, periodos }) => {
      if (ok) {
        this.periodos = periodos;
      }
    });
    this.aulaService.todo().subscribe({
      next: ({ ok, aulas }) => {
        if (ok) {
          this.aulas = aulas;
        }
      }
    });
    this.cicloService.listar().subscribe({
      next: ({ ok, ciclos }) => {
        if (ok) {
          this.ciclos = ciclos;
        }
      }
    });
  }
  ngOnInit(): void {
    this.apreciacionForm = this.fb.group({
      periodoId: ['', Validators.required],
      alumnoId: ['', Validators.required],
      aulaId: ['', Validators.required],
    });
  }
  limpiarVector(){
    this.generarTabla();
  }
  cargarAlumnos() {
    this.apreciaciondetalles=[];
    if (this.apreciacionForm.get('periodoId')?.value && this.apreciacionForm.get('aulaId')?.value) {
      let arrPeriodos = (this.apreciacionForm.get('periodoId')?.value).split(',');
      let arrAulas = (this.apreciacionForm.get('aulaId')?.value).split(',');
      this.matriculadetalleService.matriculadetallesPeriodoAula(arrPeriodos[0], arrAulas[0])
        .subscribe({
          next: ({ ok, matriculadetalles }) => {
            if (ok) {
              this.matriculadetalles = matriculadetalles;
              this.apreciacionForm.controls['alumnoId'].setValue("");
            }
          }
        });
    }
  }
  campoRequerido(campo: string) {
    if (this.apreciacionForm.get(campo)?.getError('required') && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }
  campoMaxLengh(campo: string, longitud: number) {
    if (this.apreciacionForm.get(campo)?.value === "") {
      return;
    }
    if ((this.apreciacionForm.get(campo)?.getError('maxlength')?.requiredLength == longitud) &&
      this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }
  generarTabla() {
    this.formSubmitted = true;
    this.apreciaciondetalles = [];
    this.existeAp = false;
    if (this.apreciacionForm.valid) {
      let arrPeriodos = (this.apreciacionForm.get('periodoId')?.value).split(',');
      let arrAlumnos = (this.apreciacionForm.get('alumnoId')?.value).split(',');
      this.apreciacionService.getApreciacionesPeriodoAlumno(
        Number(arrPeriodos[0]),
        Number(arrAlumnos[0])
      ).subscribe({
        next: ({ ok, apreciaciones }) => {
          if (ok) {
            if (apreciaciones.length > 0) {
              this.existeAp = true;
            } else {
              this.ciclos.forEach(ciclo => {
                let obj = {
                  nombre: "Bimestre " + ciclo.nombre,
                  descripcion: "",
                  responsabilidad: "-"
                };
                this.apreciaciondetalles.push(obj);
              });
            }
          }
        }
      });
    }
  }

  guardarApreciacion() {

    if(this.apreciacionForm.valid){
      Swal.fire({
        title: 'Guardar',
        text: "¿Desea crear la apreciacion?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Guardar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.apreciacionService.crear(this.apreciacionForm.value)
            .subscribe({
              next: ({ ok, msg, apreciacion }) => {
                if (ok) {
                  this.apreciaciondetalles.forEach(apreciaciondetalle => {
                    let obj: any = {
                      nombre: apreciaciondetalle.nombre,
                      descripcion: apreciaciondetalle.descripcion,
                      responsabilidad: apreciaciondetalle.responsabilidad,
                      apreciacionId: apreciacion.id,
                      firma: "",
                    };
                    this.apreciaciondetalleService.crear(obj).subscribe({
                      next: ({ ok }) => { }
                    });
                  });
                  Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: msg,
                    showConfirmButton: false,
                    timer: 1000
                  });
                  this.router.navigateByUrl('dashboard/apreciaciones');
                }
              },
              error: (error) => {
                Swal.fire({
                  position: 'top-end',
                  icon: 'error',
                  title: "Se produjo un error. Hable con el administrador",
                  showConfirmButton: false,
                  timer: 1500
                })
              }
            });
        }
      });
    }
  }
}
