import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute} from '@angular/router';
import * as moment from 'moment';
import { Ciclo } from 'src/app/models/ciclo.model';
import { Docente } from 'src/app/models/docente.model';
import { Evaluacion } from 'src/app/models/evaluacion.model';
import { Matricula } from 'src/app/models/matricula.model';
import { Periodo } from 'src/app/models/periodo.model';
import { Programacion } from 'src/app/models/programacion.model';
import { CicloService } from 'src/app/services/ciclo.service';
import { EvaluacionService } from 'src/app/services/evaluacion.service';
import { MatriculaService } from 'src/app/services/matricula.service';
import { MenuService } from 'src/app/services/menu.service';
import { NotaService } from 'src/app/services/nota.service';
import { ProgramacionService } from 'src/app/services/programacion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-nota-docente',
  templateUrl: './crear-nota-docente.component.html',
  styleUrls: ['./crear-nota-docente.component.css']
})
export class CrearNotaDocenteComponent implements OnInit {

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

  public periodonombre:string="";
  public aulanombre:string="";
  public subareanombre:string="";
  public areanombre:string="";
  public docentenombre:string="";

  public cargando:boolean= false;

  constructor(private menuService: MenuService, private fb: FormBuilder,private cicloService: CicloService,
    private evaluacionService: EvaluacionService, private matriculaService: MatriculaService,
    private notaService: NotaService, private route: ActivatedRoute,
    private programacionService:ProgramacionService) {

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
    this.buscarMatriculas();
    this.notaForm = this.fb.group({
      cicloId: ['', Validators.required],
      evaluacionId: ['', Validators.required]
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
    this.cargando= true;
    this.matriculaService.matriculasPorProgramacion(Number(this.route.snapshot.paramMap.get('id')))
      .subscribe(({ ok, matriculas }) => {
        if (ok) {
          this.matriculas = matriculas;

          this.matriculas.forEach(matricula => {
            this.datos.push({
              matricula: matricula,
              matriculaId: matricula.id,
              valor: 0,
              cicloId: this.notaForm.controls['cicloId'].value,
              evaluacionId: this.notaForm.controls['evaluacionId'].value,
            });
          });

        }
        this.cargando= false;
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


  guardarNotas() {
    this.formSubmitted = true;
 
    if (this.notaForm.valid) {

      if (this.validacionDatos()) {
        Swal.fire('Ingresar las notas correctamente.');
      } else {

        Swal.fire({
          title: 'Guardar',
          text: "¿Desea guardar las notas?",
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          cancelButtonText: 'Cancelar',
          confirmButtonText: 'Guardar'
        }).then((result) => {
          if (result.isConfirmed) {

            const fecha=moment().format("YYYY-MM-DD");

            this.datos.forEach(dato => {

              dato.cicloId = this.notaForm.controls['cicloId'].value;
              dato.evaluacionId = this.notaForm.controls['evaluacionId'].value;
              dato.fecha= fecha;
              
              this.notaService.crear(dato)
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
