import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { Material } from 'src/app/models/material.model';
import { MaterialService } from 'src/app/services/material.service';
import { ProgramacionService } from 'src/app/services/programacion.service';

import Swal from 'sweetalert2';
@Component({
  selector: 'app-material',
  templateUrl: './material.component.html',
  styleUrls: ['./material.component.css']
})
export class MaterialComponent implements OnInit {

  public titulo2: string = 'Lista';
  public icono2: string = 'bi bi-justify';
  public titulo3: string = 'Detalle';
  public icono3: string = 'bi bi-card-checklist';
  public materialForm!: FormGroup;
  public formSubmitted: boolean = false;
  public materiales: Material[] = [];
  public desde: number = 0;
  public totalRegistros: number = 0;
  public numeropaginas = 0;
  public ds: boolean = true;
  public da: boolean = true;
  public cargando: boolean = false;
  public cargandocrear: boolean = false;
  public material!: Material;
  public imagenSubir!: File;
  public titulo: string = "";
  public boton: string = "";
  public band: boolean = true;

  public periodonombre: string = "";
  public aulanombre: string = "";
  public subareanombre: string = "";
  public docentenombre: string = "";
  public total: number = 0;
  public archivoAux: string = "";

  @ViewChild('closebutton') closebutton: any;
  @ViewChild('closebutton2') closebutton2: any;

  constructor(private fb: FormBuilder,
    private materialService: MaterialService,
    private route: ActivatedRoute, private programacionService: ProgramacionService) {

    this.programacionService.obtener(Number(this.route.snapshot.paramMap.get('id')))
      .subscribe({
        next: ({ ok, programacion }) => {
          if (ok) {
            this.periodonombre = programacion.periodo?.nombre!;
            this.aulanombre = programacion.aula?.nombre!;
            this.docentenombre = programacion.docente?.persona?.nombres! + ' ' +
              programacion.docente?.persona?.apellidopaterno! + ' ' +
              programacion.docente?.persona?.apellidomaterno!;
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

  ngOnInit(): void {
    this.listarMateriales();
    this.materialForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.maxLength(100)]],
      subtitulo: ['', Validators.maxLength(100)],
      descripcion: ['', Validators.required],
      archivo: [''],
      programacionId: [this.route.snapshot.paramMap.get('id')],
      fecha: [moment().format("YYYY-MM-DD")],
      id: ['']
    });
  }
  listarMateriales() {
    this.cargando = true;
    this.materialService.porProgramacion(Number(this.route.snapshot.paramMap.get('id')), this.desde)
      .subscribe(({ materiales, total }) => {
        this.materiales = materiales;
        this.totalRegistros = total;
        this.numeropaginas = Math.ceil(this.totalRegistros / 6);
        this.cargando = false;
        this.total = total;
        this.controlBotonesPaginacion();
      });
  }
  campoRequerido(campo: string) {
    if (this.materialForm.get(campo)?.getError('required') && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }
  campoMaxLengh(campo: string, longitud: number) {
    if (this.materialForm.get(campo)?.value === "") {
      return;
    }
    if ((this.materialForm.get(campo)?.getError('maxlength')?.requiredLength == longitud) &&
      this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }
  cambiarPagina(valor: number) {
    this.desde += valor;
    if (this.desde < 0) {
      this.desde = 0;
    } else {
      if (this.desde >= this.totalRegistros) {
        this.desde -= valor;
      }
    }
    this.listarMateriales();
  }

  controlBotonesPaginacion() {
    if (this.materiales.length !== 6) {
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
  detalleMaterial(material: Material) {
    this.material = material;
  }
  crearMaterial() {
    this.titulo = "Crear Material";
    this.boton = "Guardar";
    this.band = true;
    this.materialForm.controls['titulo'].setValue("");
    this.materialForm.controls['subtitulo'].setValue("");
    this.materialForm.controls['descripcion'].setValue("");
    this.materialForm.controls['archivo'].setValue(null);
    this.formSubmitted = false;
  }

  cambiarArchivo(event: any) {
    this.imagenSubir = event.target.files[0];
  }


  guardarMaterial() {

    this.formSubmitted = true;
    if (this.materialForm.valid) {

      if (this.band) {

        Swal.fire({
          title: 'Guardar',
          text: "¿Desea guardar el material?",
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          cancelButtonText: 'Cancelar',
          confirmButtonText: 'Guardar'
        }).then((result) => {
          if (result.isConfirmed) {
            this.materialService.crear(this.materialForm.value)
            .subscribe({
              next:({ok, msg, material})=>{
                if (ok) {
                  if (this.materialForm.controls['archivo'].value) {
                    this.cargandocrear = true;
                    this.materialService.actualizarArchivo(this.imagenSubir, Number(material.id))
                      .then(data => {
                        
                        if(data.ok){
                          this.closebutton2.nativeElement.click();
                          this.listarMateriales();
                          this.cargandocrear = false;
                          Swal.fire({
                            position: 'top-end',
                            icon: 'success',
                            title: data.msg,
                            showConfirmButton: false,
                            timer: 1500
                          });
                        }else{
                          Swal.fire({
                            position: 'top-end',
                            icon: 'error',
                            title: data.msg,
                            showConfirmButton: false,
                            timer: 1500
                          });
                          this.closebutton2.nativeElement.click();                  
                          this.cargandocrear = false;
                        }
                      })
                      .catch(error=>{
                        console.log(error);
                      });
                  } else {
                    this.closebutton2.nativeElement.click();
                    this.listarMateriales();
                    Swal.fire({
                      position: 'top-end',
                      icon: 'success',
                      title: msg,
                      showConfirmButton: false,
                      timer: 1500
                    });
                  }
                }
              }
            });
          }
        })
      } else {

        Swal.fire({
          title: 'Actualizar',
          text: "¿Desea actualizar el material?",
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          cancelButtonText: 'Cancelar',
          confirmButtonText: 'Actualizar'
        }).then((result) => {
          if (result.isConfirmed) {

            this.materialService.actualizar(this.materialForm.controls['id'].value, this.materialForm.value)
              .subscribe({
                next: ({ ok, msg, material }) => {
                  if (ok) {
                    if (this.materialForm.controls['archivo'].value) {
                      this.cargandocrear = true;
                      this.materialService.actualizarArchivo(this.imagenSubir, Number(material.id))
                        .then(data => {
                          
                          if(data.ok){
                            this.closebutton2.nativeElement.click();
                            this.listarMateriales();
                            this.cargandocrear = false;
                            Swal.fire({
                              position: 'top-end',
                              icon: 'success',
                              title: data.msg,
                              showConfirmButton: false,
                              timer: 1500
                            });
                          }else{
                            Swal.fire({
                              position: 'top-end',
                              icon: 'error',
                              title: data.msg,
                              showConfirmButton: false,
                              timer: 1500
                            });
                            this.closebutton2.nativeElement.click();                  
                            this.cargandocrear = false;
                          }
                        })
                        .catch(error=>{
                          console.log(error);
                        });
                    } else {
                      this.closebutton2.nativeElement.click();
                      this.listarMateriales();
                      Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: msg,
                        showConfirmButton: false,
                        timer: 1500
                      });
                    }
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
      }
    }
  }

  editarMaterial(material: Material) {
    this.titulo = "Editar Material";
    this.boton = "Actualizar";
    this.band = false;
    this.materialForm.controls['titulo'].setValue(material.titulo);
    this.materialForm.controls['subtitulo'].setValue(material.subtitulo);
    this.materialForm.controls['descripcion'].setValue(material.descripcion);
    this.materialForm.controls['archivo'].setValue(null);
    this.materialForm.controls['id'].setValue(material.id);
    this.formSubmitted = false;
  }

  buscarMaterial(termino: string) {

    if (termino.length == 0) {
      this.listarMateriales();
    } else {
      this.materialService.buscarprogramacion(termino, Number(this.route.snapshot.paramMap.get('id')))
        .subscribe((resp: Material[]) => {
          this.materiales = resp;
          this.totalRegistros = resp.length;
          this.cargando = false;
          this.controlBotonesPaginacion();
        });
    }
  }

  eliminarMaterial(material: Material) {
    Swal.fire({
      title: 'Borrar Material',
      text: "Desea borrar: " + material.titulo,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Borrar'
    }).then((result) => {
      if (result.isConfirmed) {

        this.materialService.borrar(Number(material.id))
          .subscribe(({ ok, msg }) => {
            if (ok) {
              this.listarMateriales();
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: msg,
                showConfirmButton: false,
                timer: 2500
              })
            }
          }, (error) => {
            Swal.fire({
              position: 'top-end',
              icon: 'info',
              title: error.error.msg,
              showConfirmButton: false,
              timer: 2500
            })
          });
      }
    })
    return true;
  }

}
