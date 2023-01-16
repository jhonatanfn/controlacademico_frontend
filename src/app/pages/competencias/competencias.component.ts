import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Area } from 'src/app/models/area.model';
import { Competencia } from 'src/app/models/competencia.model';
import { AreaService } from 'src/app/services/area.service';
import { CompetenciaService } from 'src/app/services/competencia.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-competencias',
  templateUrl: './competencias.component.html',
  styleUrls: ['./competencias.component.css']
})
export class CompetenciasComponent implements OnInit {

  public competencias: Competencia[] = [];
  public cargando: boolean = true;
  public titulo: string = 'Lista Competencias';
  public icono: string = 'bi bi-table';
  public desde: number = 0;
  public totalRegistros: number = 0;
  public numeropaginas = 0;
  public ds: boolean = true;
  public da: boolean = true;
  public competenciaForm!: FormGroup;
  public formSubmitted: boolean = false;
  public boton: string = "";
  public isSave: boolean = true;
  public titulocompetencia: string = "";
  public areas: Area[] = [];

  @ViewChild('closebutton') closebutton: any;

  constructor(private competenciaService: CompetenciaService, private fb: FormBuilder,
    private areaService: AreaService) {
    this.areaService.todo().subscribe({
      next: ({ ok, areas }) => {
        if (ok) {
          this.areas = areas;
        }
      }
    })
  }

  ngOnInit(): void {
    this.listarCompetencias();
    this.competenciaForm = this.fb.group({
      descripcion: ['', [Validators.required, Validators.maxLength(255)]],
      areaId: ['', Validators.required],
      id: ['']
    });
  }
  campoRequerido(campo: string) {
    if (this.competenciaForm.get(campo)?.getError('required') && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }
  campoMaxLengh(campo: string, longitud: number) {
    if (this.competenciaForm.get(campo)?.value === "") {
      return;
    }
    if ((this.competenciaForm.get(campo)?.getError('maxlength')?.requiredLength == longitud) &&
      this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }

  controlBotonesPaginacion() {
    if (this.competencias.length !== 5) {
      this.ds = true;
    } else {
      this.ds = false;
    }
    if (this.desde === 0) {
      this.da = true;
    } else {
      this.da = false;
    }
  }

  listarCompetencias() {
    this.cargando = true;
    this.competenciaService.listar(this.desde)
      .subscribe({
        next: ({ ok, competencias, total }) => {
          if (ok) {
            this.competencias = competencias;
            this.totalRegistros = total;
            this.cargando = false;
            this.controlBotonesPaginacion();
          }
        }
      });
  }

  cambiarPagina(valor: number) {
    this.desde += valor;
    if (this.desde < 0) {
      this.desde = 0;
    } else {
      if (this.desde > this.totalRegistros) {
        this.desde -= valor;
      }
    }
    this.listarCompetencias();
  }

  crearCompetencia() {
    this.formSubmitted = false;
    this.competenciaForm.controls['descripcion'].setValue('');
    this.competenciaForm.controls['areaId'].setValue('');
    this.competenciaForm.controls['id'].setValue('');
    this.boton = "Guardar";
    this.isSave = true;
    this.titulocompetencia = "Nueva Competencia";
  }

  guardarCompetencia() {
    this.formSubmitted = true;
    
    if (this.competenciaForm.valid) {
      console.log(this.competenciaForm.value);
      if (this.isSave) {
        Swal.fire({
          title: 'Guardar',
          text: "¿Desea crear la competencia?",
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          cancelButtonText: 'Cancelar',
          confirmButtonText: 'Guardar'
        }).then((result) => {
          if (result.isConfirmed) {
            this.competenciaService.crear(this.competenciaForm.value)
              .subscribe({
                next: ({ ok, msg }) => {
                  if (ok) {
                    this.closebutton.nativeElement.click();
                    this.listarCompetencias();
                    Swal.fire({
                      position: 'top-end',
                      icon: 'success',
                      title: msg,
                      showConfirmButton: false,
                      timer: 1000
                    });
                  }
                },
                error: (error) => {
                  Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: error.error.msg,
                    showConfirmButton: false,
                    timer: 1500
                  });
                }
              });
          }
        })
      } else {
        Swal.fire({
          title: 'Actualizar',
          text: "¿Desea actualizar la competencia?",
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          cancelButtonText: 'Cancelar',
          confirmButtonText: 'Guardar'
        }).then((result) => {
          if (result.isConfirmed) {
            this.competenciaService.actualizar(this.competenciaForm.get('id')?.value, this.competenciaForm.value)
              .subscribe({
                next: ({ ok, msg }) => {
                  if (ok) {
                    this.closebutton.nativeElement.click();
                    this.listarCompetencias();
                    Swal.fire({
                      position: 'top-end',
                      icon: 'success',
                      title: msg,
                      showConfirmButton: false,
                      timer: 1000
                    });
                  }
                },
                error: (error) => {
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
  }

  eliminarCompetencia(competencia: Competencia) {

    this.competenciaService.existenNotas(competencia.id!).subscribe({
      next: ({ok, msg})=>{
        if(ok){
          Swal.fire({
            position: 'top-end',
            icon: 'info',
            title: msg,
            showConfirmButton: false,
            timer: 1000
          });
        }else{
          Swal.fire({
            title: 'Borrar Competencia',
            text: "Desea borrar: " + competencia.descripcion,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Borrar'
          }).then((result) => {
            if (result.isConfirmed) {
              this.competenciaService.borrar(competencia.id!)
                .subscribe(({ ok, msg }) => {
                  if (ok) {
                    this.listarCompetencias();
                    Swal.fire({
                      position: 'top-end',
                      icon: 'success',
                      title: msg,
                      showConfirmButton: false,
                      timer: 1000
                    });
                  }
                });
            }
          });
        }
      }
    });
  }

  editarCompetencia(competencia: Competencia) {
    this.competenciaForm.controls['id'].setValue(competencia.id);
    this.competenciaForm.controls['descripcion'].setValue(competencia.descripcion);
    this.competenciaForm.controls['areaId'].setValue(competencia.area?.id);
    this.boton = "Actualizar";
    this.isSave = false;
    this.titulocompetencia = "Editar Competencia";
  }

  buscarCompetencia(termino: string) {
    if (termino.length == 0) {
      this.listarCompetencias();
    } else {
      this.competenciaService.busqueda(termino)
        .subscribe((resp: Competencia[]) => {
          this.competencias = resp;
          this.totalRegistros = resp.length;
          this.cargando = false;
          this.controlBotonesPaginacion();
        });
    }
  }

}
