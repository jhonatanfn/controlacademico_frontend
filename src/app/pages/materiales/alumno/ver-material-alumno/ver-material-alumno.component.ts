import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Material } from 'src/app/models/material.model';
import { MaterialService } from 'src/app/services/material.service';
import { ProgramacionService } from 'src/app/services/programacion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ver-material-alumno',
  templateUrl: './ver-material-alumno.component.html',
  styleUrls: ['./ver-material-alumno.component.css']
})
export class VerMaterialAlumnoComponent implements OnInit {

  public titulo: string = 'Lista Materiales';
  public icono: string = 'bi bi-list';
  public titulo3: string = 'Detalle';
  public icono3: string = 'bi bi-card-checklist';
  public cargando: boolean = true;
  public desde: number = 0;
  public totalRegistros: number = 0;
  public numeropaginas = 0;
  public ds: boolean = true;
  public da: boolean = true;
  public materiales:Material[]=[];
  public material!:Material;
  @ViewChild('closebutton') closebutton: any;

  public periodonombre: string = "";
  public aulanombre: string = "";
  public subareanombre: string = "";
  public docentenombre: string = "";
  public totalmateriales: number = 0;
  public archivoAux: string = "";

  constructor(private materialService:MaterialService,
    private route: ActivatedRoute,private programacionService: ProgramacionService) { 

    this.programacionService.obtener(Number(this.route.snapshot.paramMap.get('id')))
      .subscribe({
        next: ({ ok, programacion }) => {
          if (ok) {
            this.periodonombre = programacion.periodo?.nombre!;
            this.aulanombre = programacion.aula?.nombre!;
            this.subareanombre = programacion.subarea?.nombre!;
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
      })

  }

  ngOnInit(): void {
    this.listarMateriales();
  }

  controlBotonesPaginacion() {
    if (this.materiales.length !== 5) {
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

  listarMateriales() {
    this.cargando = true;
   
    this.materialService.porProgramacion(Number(this.route.snapshot.paramMap.get('id')),this.desde)
      .subscribe(({ ok, materiales, total }) => {
        if (ok) {
          this.materiales = materiales;
          this.totalRegistros = total;
          this.totalmateriales= total;
          this.numeropaginas = Math.ceil(this.totalRegistros / 5);
          this.cargando = false;
          this.controlBotonesPaginacion();
        }
      });
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

  detalleMaterial(material:Material){
    this.material= material;
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


}
