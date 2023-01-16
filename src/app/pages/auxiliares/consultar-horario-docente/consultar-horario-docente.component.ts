import { Component, OnInit } from '@angular/core';
import { Horario } from 'src/app/models/horario.model';
import { HorarioService } from 'src/app/services/horario.service';

@Component({
  selector: 'app-consultar-horario-docente',
  templateUrl: './consultar-horario-docente.component.html',
  styleUrls: ['./consultar-horario-docente.component.css']
})
export class ConsultarHorarioDocenteComponent implements OnInit {

  public titulo: string = "Lista Docentes";
  public icono: string = "bi bi-table";
  public desde: number = 0;
  public totalRegistros: number = 0;
  public numeropaginas = 0;
  public ds: boolean = true;
  public da: boolean = true;
  public cargando: boolean = false;
  public dias: any[] = [
    { id: 1, nombre: "LUNES" },
    { id: 2, nombre: "MARTES" },
    { id: 3, nombre: "MIERCOLES" },
    { id: 4, nombre: "JUEVES" },
    { id: 5, nombre: "VIERNES" },
  ];
  public diaseleccionado: any = "";
  public horarios: Horario[] = [];


  constructor(private horarioService: HorarioService) { }

  ngOnInit(): void {
    this.listarHorarios();
  }


  listarHorarios() {
    this.cargando = true;
    if (this.diaseleccionado) {
      this.horarioService.listarpordia(this.diaseleccionado, this.desde).subscribe({
        next: ({ ok, horarios, total }) => {
          if (ok) {
            this.horarios = horarios;
            this.totalRegistros = total;
            this.numeropaginas = Math.ceil(this.totalRegistros / 5);
            this.cargando = false;
            this.controlBotonesPaginacion();
          }
        }
      });
    } else {
      this.horarioService.listar(this.desde).subscribe({
        next: ({ ok, horarios, total }) => {
          if (ok) {
            this.horarios = horarios;
            this.totalRegistros = total;
            this.numeropaginas = Math.ceil(this.totalRegistros / 5);
            this.cargando = false;
            this.controlBotonesPaginacion();
          }
        }
      });
    }

  }

  controlBotonesPaginacion() {
    if (this.horarios.length !== 5) {
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

  cambiarPagina(valor: number) {
    this.desde += valor;
    if (this.desde < 0) {
      this.desde = 0;
    } else {
      if (this.desde > this.totalRegistros) {
        this.desde -= valor;
      }
    }
    this.listarHorarios();
  }

  buscarHorarios(termino: string) {

    if(this.diaseleccionado){
      if(termino.length==0){
        this.listarHorarios();
      }else{
        this.horarioService.buscarHorarioPorDia(this.diaseleccionado, termino).subscribe({
          next: (resp: Horario[])=>{
            this.horarios = resp;
            this.totalRegistros = resp.length;
            this.numeropaginas = Math.ceil(this.totalRegistros / 5);
            this.da = true;
            this.ds = true;
          }
        });
      }
    }else{
      if(termino.length == 0){
        this.listarHorarios();
      }else{
        this.horarioService.buscarHorario(termino).subscribe({
          next: (resp: Horario[])=>{
            this.horarios = resp;
            this.totalRegistros = resp.length;
            this.numeropaginas = Math.ceil(this.totalRegistros / 5);
            this.da = true;
            this.ds = true;
          }
        });
      }
    }
  }
}
