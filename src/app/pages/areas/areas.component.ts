import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Area } from 'src/app/models/area.model';
import { AreaService } from 'src/app/services/area.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-areas',
  templateUrl: './areas.component.html',
  styleUrls: ['./areas.component.css']
})
export class AreasComponent implements OnInit {

  public areas: Area[] = [];
  public cargando: boolean = true;
  public titulo: string = 'Lista Areas';
  public icono: string = 'bi bi-table';
  public desde: number = 0;
  public totalRegistros: number = 0;
  public numeropaginas = 0;
  public ds: boolean = true;
  public da: boolean = true;
  public areaForm!: FormGroup;
  public formSubmitted: boolean = false;
  public boton: string = "";
  public isSave: boolean = true;
  public tituloarea: string = "";
  public imagenSubir!: File;
  public imgTemp: any = null;
  public area: Area = {
    nombre: "",
    img: ""
  };
  public nombrerepetido:boolean= false;

  @ViewChild('closebutton') closebutton: any;
  @ViewChild('closebutton2') closebutton2: any;

  constructor(private areaService: AreaService, private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.listarAreas();
    this.areaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(50)]],
      id: [''],
    });
  }

  campoRequerido(campo: string) {
    if (this.areaForm.get(campo)?.getError('required') && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }
  campoMaxLengh(campo: string, longitud: number) {
    if (this.areaForm.get(campo)?.value === "") {
      return;
    }
    if ((this.areaForm.get(campo)?.getError('maxlength')?.requiredLength == longitud) &&
      this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }

  controlBotonesPaginacion() {
    if (this.areas.length !== 5) {
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

  listarAreas() {
    this.cargando = true;
    this.areaService.listar(this.desde)
      .subscribe(({ areas, total }) => {
        this.areas = areas;
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
    this.listarAreas();
  }

  crearArea() {
    this.formSubmitted = false;
    this.areaForm.controls['nombre'].setValue('');
    this.areaForm.controls['id'].setValue('');
    this.boton = "Guardar";
    this.isSave = true;
    this.tituloarea = "Crear Area";
    this.nombrerepetido= false;
  }

  guardarArea() {
    this.formSubmitted = true;
    this.nombrerepetido= false;
    if (this.areaForm.valid) {
      if (this.isSave) {
        this.areaService.existeNombreArea((this.areaForm.get('nombre')?.value).trim()).subscribe({
          next: ({ok})=>{
            if(ok){
              this.nombrerepetido= true;
            }else{
              Swal.fire({
                title: 'Guardar',
                text: "¿Desea crear el area?",
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                cancelButtonText: 'Cancelar',
                confirmButtonText: 'Guardar'
              }).then((result) => {
                if (result.isConfirmed) {
                  this.areaService.crear(this.areaForm.value)
                    .subscribe({
                      next: ({ ok, msg }) => {
                        if (ok) {
                          this.closebutton.nativeElement.click();
                          this.listarAreas();
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
        });

      } else {

        this.areaService.existeNombreAreaEditar(this.areaForm.get('id')?.value,
        (this.areaForm.get('nombre')?.value).trim()).subscribe({
          next: ({ok})=>{
            if(ok){
              this.nombrerepetido= true;
            }else{
              Swal.fire({
                title: 'Actualizar',
                text: "¿Desea actualizar el area?",
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                cancelButtonText: 'Cancelar',
                confirmButtonText: 'Actualizar'
              }).then((result) => {
                if (result.isConfirmed) {
                  this.areaService.actualizar(this.areaForm.get('id')?.value, this.areaForm.value)
                    .subscribe({
                      next: ({ ok, msg }) => {
                        if (ok) {
                          this.closebutton.nativeElement.click();
                          this.listarAreas();
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
                          title: "Se produjo un error. Hable con el administrador",
                          showConfirmButton: false,
                          timer: 1000
                        })
                      }
                    });
                }
              });
            }
          }
        });
      }
    }
  }

  eliminarArea(area: Area) {

    this.areaService.tieneCompetencias(area.id!)
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
              title: 'Borrar Area',
              text: "Desea borrar a: " + area.nombre,
              icon: 'question',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              cancelButtonText: 'Cancelar',
              confirmButtonText: 'Borrar'
            }).then((result) => {
              if (result.isConfirmed) {
                this.areaService.borrar(area.id!)
                  .subscribe(({ ok, msg }) => {
                    if (ok) {
                      this.listarAreas();
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

  editarArea(area: Area) {
    this.areaForm.controls['id'].setValue(area.id);
    this.areaForm.controls['nombre'].setValue(area.nombre.toUpperCase());
    this.boton = "Actualizar";
    this.isSave = false;
    this.tituloarea = "Editar Area";
    this.nombrerepetido= false;
  }

  buscarArea(termino: string) {
    if (termino.length == 0) {
      this.listarAreas();
    } else {
      this.areaService.buscarPorNombre(termino)
        .subscribe((resp: Area[]) => {
          this.areas = resp;
          this.totalRegistros = resp.length;
          this.cargando = false;
          this.controlBotonesPaginacion();
        });
    }
  }


  cambiarImagen(event: any) {
    this.imagenSubir = event.target.files[0];
    if (!event.target.files[0]) {
      return this.imgTemp = null;
    }
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onloadend = () => {
      this.imgTemp = reader.result;
    }
    return true;
  }

  cambiarImagenArea(area: Area) {
    this.area = area;
  }

  actualizarImagenArea() {
    this.areaService.actualizarImagen(this.imagenSubir, Number(this.area.id)).then(img => {
      this.closebutton2.nativeElement.click();
      if (img) {
        this.imgTemp = null;
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Imagen actualizada exitosamente',
          showConfirmButton: false,
          timer: 1000
        })
        this.listarAreas();

      }
    });
  }

}
