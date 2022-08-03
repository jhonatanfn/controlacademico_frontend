import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Area } from 'src/app/models/area.model';
import { Subarea } from 'src/app/models/subarea.model';
import { AreaService } from 'src/app/services/area.service';
import { MenuService } from 'src/app/services/menu.service';
import { SubareaService } from 'src/app/services/subarea.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-subareas',
  templateUrl: './subareas.component.html',
  styleUrls: ['./subareas.component.css']
})
export class SubareasComponent implements OnInit {

  public subareas: Subarea[] = [];
  public cargando: boolean = true;
  public titulo: string = '';
  public icono: string = '';
  public desde: number = 0;
  public totalRegistros: number = 0;
  public numeropaginas = 0;
  public ds: boolean = true;
  public da: boolean = true;

  public subareaForm!: FormGroup;
  public formSubmitted: boolean = false;
  public boton: string = "";
  public isSave: boolean = true;
  public titulosubarea: string = "";
  public areas: Area[] = [];

  @ViewChild('closebutton') closebutton: any;

  constructor(private menuService: MenuService,
    private subareaService: SubareaService,
    private fb: FormBuilder,
    private areaService: AreaService) {

    this.menuService.getTituloRuta()
      .subscribe(({ titulo, icono }) => {
        this.titulo = titulo;
        this.icono = icono;
      });

    this.areaService.listar()
      .subscribe(({ areas }) => {
        this.areas = areas;
      });

  }

  ngOnInit(): void {
    this.listarSubareas();
    this.subareaForm = this.fb.group({
      subareaId: [''],
      nombre: ['', [Validators.required, Validators.maxLength(30)]],
      areaId: ['', Validators.required]
    });
  }

  campoRequerido(campo: string) {
    if (this.subareaForm.get(campo)?.getError('required') && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }
  campoMaxLengh(campo: string, longitud: number) {
    if (this.subareaForm.get(campo)?.value === "") {
      return;
    }
    if ((this.subareaForm.get(campo)?.getError('maxlength')?.requiredLength == longitud) &&
      this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }

  controlBotonesPaginacion() {
    if (this.subareas.length !== 5) {
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

  listarSubareas() {
    this.cargando = true;
    this.subareaService.listar(this.desde)
      .subscribe(({ subareas, total }) => {
        this.subareas = subareas;
        this.totalRegistros = total;
        this.numeropaginas = Math.ceil(this.totalRegistros / 5);
        this.cargando = false;
        this.controlBotonesPaginacion();
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
    this.listarSubareas();
  }

  crearSubarea() {
    this.formSubmitted = false;
    this.subareaForm.controls['nombre'].setValue('');
    this.subareaForm.controls['areaId'].setValue('');
    this.boton = "Guardar";
    this.isSave = true;
    this.titulosubarea = "Crear Subarea";
  }

  guardarSubarea() {

    this.formSubmitted = true;
    if (this.subareaForm.valid) {
      if (this.isSave) {
        this.subareaService.crear(this.subareaForm.value)
          .subscribe({
            next: ({ ok, msg }) => {
              if (ok) {
                this.closebutton.nativeElement.click();
                this.listarSubareas();
                Swal.fire({
                  position: 'top-end',
                  icon: 'success',
                  title: msg,
                  showConfirmButton: false,
                  timer: 1000
                })
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
      } else {

        this.subareaService.actualizar(this.subareaForm.get('subareaId')?.value, this.subareaForm.value)
          .subscribe({
            next: ({ ok, msg }) => {
              if (ok) {
                this.closebutton.nativeElement.click();
                this.listarSubareas();
                Swal.fire({
                  position: 'top-end',
                  icon: 'success',
                  title: msg,
                  showConfirmButton: false,
                  timer: 1000
                })
              }
            },
            error: (error) => {
              Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: error.error.msg,
                showConfirmButton: false,
                timer: 1000
              })
            }
          });
      }
    }
  }

  eliminarSubarea(subarea: Subarea) {

    this.subareaService.tieneProgramaciones(subarea.id!)
      .subscribe({
        next: ({ ok, msg }) => {
          if (ok) {
            Swal.fire({
              position: 'top-end',
              icon: 'info',
              title: msg,
              showConfirmButton: false,
              timer: 1000
            })
          } else {
            Swal.fire({
              title: 'Borrar Subarea',
              text: "Desea borrar a: " + subarea.nombre,
              icon: 'question',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              cancelButtonText: 'Cancelar',
              confirmButtonText: 'Borrar'
            }).then((result) => {
              if (result.isConfirmed) {
                this.subareaService.borrar(subarea.id!)
                  .subscribe(({ ok, msg }) => {
                    if (ok) {
                      this.listarSubareas();
                      Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: msg,
                        showConfirmButton: false,
                        timer: 1000
                      })
                    }
                  })
              }
            })
          }
        }
      })
  }

  editarSubarea(subarea: Subarea) {
    this.subareaForm.controls['subareaId'].setValue(subarea.id);
    this.subareaForm.controls['areaId'].setValue(subarea.area.id);
    this.subareaForm.controls['nombre'].setValue(subarea.nombre.toUpperCase());
    this.boton = "Actualizar";
    this.isSave = false;
    this.titulosubarea = "Editar Subarea";
  }

  buscarSubarea(termino: string) {
    if (termino.length == 0) {
      this.listarSubareas();
    } else {
      this.subareaService.buscarPorNombre(termino)
        .subscribe((resp: Subarea[]) => {
          this.subareas = resp;
          this.totalRegistros = resp.length;
          this.cargando = false;
          this.controlBotonesPaginacion();
        });
    }
  }
}
