import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Ciclo } from 'src/app/models/ciclo.model';
import { Evaluacion } from 'src/app/models/evaluacion.model';
import { Matricula } from 'src/app/models/matricula.model';
import { Periodo } from 'src/app/models/periodo.model';
import { Programacion } from 'src/app/models/programacion.model';
import { CicloService } from 'src/app/services/ciclo.service';
import { EvaluacionService } from 'src/app/services/evaluacion.service';
import { MenuService } from 'src/app/services/menu.service';
import { NotaService } from 'src/app/services/nota.service';
import { ProgramacionService } from 'src/app/services/programacion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css']
})
export class EditarComponent implements OnInit {

  public titulo: string = '';
  public icono: string = '';
  public titulo2: string = 'Alumnos';
  public icono2: string = 'bi bi-people-fill';
  public titulo3: string = 'Resumen';
  public icono3: string = 'bi bi-card-checklist';
  public notaForm!: FormGroup;
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

  constructor(private menuService: MenuService, private fb: FormBuilder, private cicloService: CicloService,
    private evaluacionService: EvaluacionService, private notaService: NotaService,
    private route: ActivatedRoute,private programacionService:ProgramacionService) {

    this.menuService.getTituloRuta()
      .subscribe(({ titulo, icono }) => {
        this.titulo = titulo;
        this.icono = icono;
      });

    this.cicloService.listar().subscribe(({ ok, ciclos }) => {
      if (ok) {
        this.ciclos = ciclos;
      }
    });
    this.evaluacionService.todo().subscribe(({ ok, evaluaciones }) => {
      if (ok) {
        this.evaluaciones = evaluaciones;
      }
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
    this.notaForm = this.fb.group({
      cicloId: ['', Validators.required],
      evaluacionId: ['', Validators.required],
      fecha: ['',Validators.required]
    });
  }
  campoRequerido(campo: string) {
    if (this.notaForm.get(campo)?.getError('required') && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }

  buscarMatriculas() {
    this.formSubmitted = true;
    if (this.notaForm.valid) {
      this.cargando= true;
      this.notaService.notasProgramacionFechaEvaluacionCiclo(
        Number(this.route.snapshot.paramMap.get('id')),
        this.notaForm.controls['fecha'].value, 
        Number(this.notaForm.get('evaluacionId')?.value),
        Number(this.notaForm.get('cicloId')?.value))

        .subscribe(({ ok, notas }) => {
          if (ok) {
            this.datos = notas;
            this.cargando= false;
          }
        });

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

  actualizarNotas() {
    this.formSubmitted = true;
    if (this.notaForm.valid) {
      if (this.validacionDatos()) {
        Swal.fire('Ingresar las notas correctamente.');
      } else {
        Swal.fire({
          title: 'Actualizar',
          text: "¿Desea actualizar las notas?",
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          cancelButtonText: 'Cancelar',
          confirmButtonText: 'Actualizar'
        }).then((result) => {
          if (result.isConfirmed) {
            this.datos.forEach(dato => {
              dato.cicloId = this.notaForm.controls['cicloId'].value;
              dato.evaluacionId = this.notaForm.controls['evaluacionId'].value;
              this.notaService.actualizar(dato.id, dato)
                .subscribe(({ ok }) => {
                  if (ok) {
                  }
                });
            });
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Registro actualizado exitosamente',
              showConfirmButton: false,
              timer: 1500
            })
          }
        })
      }
    }

  }

  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }


}
