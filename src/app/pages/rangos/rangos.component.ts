import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Nivel } from 'src/app/models/nivel.model';
import { Rango } from 'src/app/models/rango.model';
import { MenuService } from 'src/app/services/menu.service';
import { RangoService } from 'src/app/services/rango.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-rangos',
  templateUrl: './rangos.component.html',
  styleUrls: ['./rangos.component.css']
})
export class RangosComponent implements OnInit {

  public rangos: Rango[] = [];
  public cargando: boolean = true;
  public titulo: string = '';
  public icono: string = '';
  public desde: number = 0;
  public totalRegistros: number = 0;
  public numeropaginas = 0;
  public ds: boolean = true;
  public da: boolean = true;
  public rangoForm!: FormGroup;
  public formSubmitted: boolean = false;
  public boton: string = "";
  public isSave: boolean = true;
  public titulorango: string = "";
  @ViewChild('closebutton') closebutton: any;

  public colores = [
    { id: 1, nombre: "AMARILLO", alias: "warning" },
    { id: 2, nombre: "AZUL", alias: "primary" },
    { id: 3, nombre: "BLANCO", alias: "light" },
    { id: 4, nombre: "CELESTE", alias: "info" },
    { id: 5, nombre: "GRIS", alias: "secondary" },
    { id: 6, nombre: "NEGRO", alias: "dark" },
    { id: 7, nombre: "ROJO", alias: "danger" },
    { id: 8, nombre: "VERDE", alias: "success" }
  ];

  constructor(private menuService: MenuService,
    private rangoService: RangoService,
    private fb: FormBuilder) {

    this.menuService.getTituloRuta()
      .subscribe(({ titulo, icono }) => {
        this.titulo = titulo;
        this.icono = icono;
      });

  }

  ngOnInit(): void {
    this.listarRangos();
    this.rangoForm = this.fb.group({
      rangoId: [''],
      letra: ['', [Validators.required, Validators.maxLength(2)]],
      inicio: ['', [Validators.required, Validators.min(0), Validators.max(20)]],
      fin: ['', [Validators.required, Validators.min(0), Validators.max(20)]],
      situacion: ['', Validators.required],
      color: ['',Validators.required],
      alias:['']
    });
  }

  campoRequerido(campo: string) {
    if (this.rangoForm.get(campo)?.getError('required') && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }

  campoRango(campo: string) {
    if (!this.rangoForm.get(campo)?.getError('required')) {

      if (this.rangoForm.get(campo)?.value >= 0) {
        if (this.rangoForm.get(campo)?.getError('min') || this.rangoForm.get(campo)?.getError('max') && this.formSubmitted) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }

    }
    return false;
  }
  campoMaxLengh(campo: string, longitud: number) {
    if (this.rangoForm.get(campo)?.value === "") {
      return;
    }
    if ((this.rangoForm.get(campo)?.getError('maxlength')?.requiredLength == longitud) &&
      this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }
  controlBotonesPaginacion() {
    if (this.rangos.length !== 5) {
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

  listarRangos() {
    this.cargando = true;
    this.rangoService.listar(this.desde)
      .subscribe(({ rangos, total }) => {
        this.rangos = rangos;
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
    this.listarRangos();
  }
  crearRango() {
    this.formSubmitted = false;
    this.rangoForm.controls['letra'].setValue('');
    this.rangoForm.controls['inicio'].setValue('');
    this.rangoForm.controls['fin'].setValue('');
    this.rangoForm.controls['situacion'].setValue('');
    this.rangoForm.controls['color'].setValue('');
    this.rangoForm.controls['alias'].setValue('');
    this.boton = "Guardar";
    this.isSave = true;
    this.titulorango = "Crear Rango";
  }

  obtenerColor(rgb:string){
    let retorno="";
    this.colores.forEach(color=>{
      if(color.nombre===rgb){
        retorno= color.alias;
      }
    });
    return retorno;
  }

  guardarRango() {
    this.formSubmitted = true;
    if (this.rangoForm.valid) {
      if (this.rangoForm.get('inicio')?.value > this.rangoForm.get('fin')?.value) {
        Swal.fire({
          icon: 'error',
          title: 'Rango no válido',
          text: 'El valor inicial dede ser menor o igual al valor final'
        })
      } else {
        this.rangoForm.controls['alias'].setValue(this.obtenerColor(this.rangoForm.get('color')?.value));
        if (this.isSave) {
          this.rangoService.crear(this.rangoForm.value)
            .subscribe({
              next: ({ ok, msg }) => {
                if (ok) {
                  this.closebutton.nativeElement.click();
                  this.listarRangos();
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
                  title: 'Se produjo un error. Intentalo mas tarde',
                  showConfirmButton: false,
                  timer: 1500
                })
              }
            });
        } else {
          this.rangoService.actualizar(this.rangoForm.get('rangoId')?.value, this.rangoForm.value)
            .subscribe({
              next: ({ ok, msg }) => {
                if (ok) {
                  this.closebutton.nativeElement.click();
                  this.listarRangos();
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
                  title: 'Se produjo un error. Intentalo mas tarde',
                  showConfirmButton: false,
                  timer: 1500
                })
              }
            });
        }
      }
    }
  }

  eliminarRango(rango: Rango) {
    Swal.fire({
      title: 'Borrar Rango',
      text: "Desea borrar a: " + rango.letra,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Borrar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.rangoService.borrar(rango.id!)
          .subscribe(({ ok, msg }) => {
            if (ok) {
              this.listarRangos();
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
    });
  }

  editarRango(rango: Rango) {
    this.rangoForm.controls['rangoId'].setValue(rango.id);
    this.rangoForm.controls['letra'].setValue(rango.letra.toUpperCase());
    this.rangoForm.controls['inicio'].setValue(rango.inicio);
    this.rangoForm.controls['fin'].setValue(rango.fin);
    this.rangoForm.controls['situacion'].setValue(rango.situacion);
    this.rangoForm.controls['color'].setValue(rango.color);
    this.rangoForm.controls['alias'].setValue(rango.alias);
    this.boton = "Actualizar";
    this.isSave = false;
    this.titulorango = "Editar Rango";
  }

  buscarRango(termino: string) {
    if (termino.length == 0) {
      this.listarRangos();
    } else {
      this.rangoService.buscarPorNombre(termino)
        .subscribe((resp: Rango[]) => {
          this.rangos = resp;
          this.totalRegistros = resp.length;
          this.cargando = false;
          this.controlBotonesPaginacion();
        });
    }
  }

}
