import { Component, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import * as moment from 'moment';
import { Periodo } from 'src/app/models/periodo.model';
import { Rango } from 'src/app/models/rango.model';
import { Situacion } from 'src/app/models/situacion.model';
import { AsistenciaService } from 'src/app/services/asistencia.service';
import { MensajeriaService } from 'src/app/services/mensajeria.service';
import { NotaService } from 'src/app/services/nota.service';
import { PeriodoService } from 'src/app/services/periodo.service';
import { RangoService } from 'src/app/services/rango.service';
import { SituacionService } from 'src/app/services/situacion.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  menuItems: any[] = [];
  public menus: any[] = [];
  public salesData: ChartData<'line'> = {
    labels: [],
    datasets: [],
  };
  public salesData2: ChartData<'line'> = {
    labels: [],
    datasets: [],
  };
  public salesData3: ChartData<'line'> = {
    labels: [],
    datasets: [],
  };
  public chartOptions: ChartOptions = {
    responsive: true,
    animation: {
      duration: 2000
    },
    scales: {
      y: {
        beginAtZero: true
      }
    },
    plugins: {
      title: {
        display: true,
        text: 'Estadísticas',
      },
    },

  };
  chartColors = {
    red: 'rgb(224, 32, 32)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(53, 138, 31)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(105, 100, 100)'
  };

  public rangos: Rango[] = [];
  public periodos: Periodo[] = [];
  public situaciones: Situacion[] = [];
  public datos1: any[] = [];
  public datos2: any[] = [];
  public datos3: any[] = [];

  public cargando: boolean = false;
  public periodoNombre: string = "";
  public totalprocesados: string = "";
  public totalprocesados2: string = "";
  public mgrafica: boolean = false;
  public mimagen: boolean = true;
  public formatofecha: string = "";

  constructor(private rangoService: RangoService, private notaService: NotaService,
    private periodoService: PeriodoService, private asistenciaService: AsistenciaService,
    private situacionService: SituacionService, private usuarioService: UsuarioService,
    private mensajeriaService:MensajeriaService) {

    if (this.usuarioService.usuario.role.nombre == "ADMINISTRADOR") {
      this.mgrafica = true;
      this.mimagen = false;
      this.rangoService.todo().subscribe({
        next: ({ ok, rangos }) => {
          if (ok) {
            this.rangos = rangos;
          }
        }
      });
      this.situacionService.todo().subscribe({
        next: ({ ok, situaciones }) => {
          if (ok) {
            this.situaciones = situaciones;
          }
        }
      });
      this.periodoService.todo().subscribe({
        next: ({ ok, periodos }) => {
          if (ok) {
            this.periodos = periodos;
            this.listar();
          }
        }
      });
    }
    this.mensajeriaService.existenMensajesNuevos(this.usuarioService.usuario.email).subscribe({
      next: ({ok, total})=>{
        if(ok){
          this.mensajeriaService.nuevos=total;
        }
      }
    });
    
  }

  listar() {
    moment.locale("es");
    let fechaactual = moment().format('YYYY-MM-DD');
    this.formatofecha = moment().format('LL');
    let idperiodo = 0;
    this.periodos.forEach(periodo => {
      if (periodo.fechainicial <= fechaactual && periodo.fechafinal >= fechaactual) {
        idperiodo = periodo.id!;
      }
    });
    this.listarNotasPeriodoLiteral(idperiodo, fechaactual);
   // this.listarNotasPeriodoVigesimal(idperiodo, fechaactual);
    this.listarAsistenciasPeriodo(idperiodo, fechaactual);
  }

  generarBarrasNotasLiteral() {
    let etiquetas: any[] = [];
    let datas: any[] = [];
    this.rangos.forEach(rango => {
      let label = rango.letra;
      etiquetas.push(label);
    });
    this.datos1.forEach(dato => {
      let label = dato.porcentaje;
      datas.push(label);
    });
    this.salesData = {
      labels: etiquetas,
      datasets: [
        {
          label: 'Total % ',

          backgroundColor: [
            this.chartColors.red,
            this.chartColors.yellow,
            this.chartColors.blue,
            this.chartColors.green,
            this.chartColors.purple
          ],
          hoverBackgroundColor: [
            this.chartColors.red,
            this.chartColors.yellow,
            this.chartColors.blue,
            this.chartColors.green,
            this.chartColors.purple
          ],
          hoverBorderColor: [
            this.chartColors.red,
            this.chartColors.yellow,
            this.chartColors.blue,
            this.chartColors.green,
            this.chartColors.purple
          ],
          hoverBorderWidth: 2,
          data: datas,
          tension: 0.5
        },
      ],
    }
  }

  generarBarrasNotasVigesimal() {
    let etiquetas: any[] = [];
    let datas: any[] = [];
    let label="";
    this.rangos.forEach(rango => {
      if(rango.inicio<=20){
        label = rango.inicio+' - ' +rango.fin;
        etiquetas.push(label);
      }
    });
    this.datos2.forEach(dato => {
      let label = dato.porcentaje;
      datas.push(label);
    });
    this.salesData2 = {
      labels: etiquetas,
      datasets: [
        {
          label: 'Total % ',

          backgroundColor: [
            this.chartColors.red,
            this.chartColors.yellow,
            this.chartColors.blue,
            this.chartColors.green
          ],
          hoverBackgroundColor: [
            this.chartColors.red,
            this.chartColors.yellow,
            this.chartColors.blue,
            this.chartColors.green
          ],
          hoverBorderColor: [
            this.chartColors.red,
            this.chartColors.yellow,
            this.chartColors.blue,
            this.chartColors.green
          ],
          hoverBorderWidth: 2,
          data: datas,
          tension: 0.5
        },
      ],
    }
  }

  generarBarrasAsistencias() {
    let etiquetas: any[] = [];
    let datas: any[] = [];
    let label="";
    this.situaciones.forEach(situacion => {
      if(situacion.nombre != "NO REGISTRÓ"){
        label = situacion.nombre;
        etiquetas.push(label);
      }
    });
    this.datos3.forEach(dato => {
      let label = dato.porcentaje;
      datas.push(label);
    });
    this.salesData3 = {
      labels: etiquetas,
      datasets: [
        {
          label: 'Total % ',
          backgroundColor: [
            this.chartColors.red,
            this.chartColors.green,
            this.chartColors.blue,
            this.chartColors.yellow
          ],
          hoverBackgroundColor: [
            this.chartColors.red,
            this.chartColors.green,
            this.chartColors.blue,
            this.chartColors.yellow
          ],
          hoverBorderColor: [
            this.chartColors.red,
            this.chartColors.green,
            this.chartColors.blue,
            this.chartColors.yellow
          ],
          hoverBorderWidth: 2,
          data: datas,
          borderColor: 'rgb(75, 192, 192)',

          tension: 0.5,
        },

      ],

    }
  }

  listarNotasPeriodoLiteral(periodoid: number, fecha: string) {
    this.datos1 = [];
    this.cargando = true;
    this.notaService.notasHoyLiteral(periodoid, fecha).subscribe({
      next: ({ ok, notas }) => {
        if (ok) {
          if (notas.length > 0) {
            let totalNotas = notas.length;

            this.rangos.forEach(rango => {
              let objeto = {
                rango: rango,
                total: 0,
                porcentaje: 0
              }
              this.datos1.push(objeto);
            });

            notas.forEach(nota => {
              this.datos1.forEach(dato => {
                if (dato.rango.letra == nota.valor) {
                  dato.total = dato.total + 1;
                  dato.porcentaje = Math.round((dato.total / totalNotas) * 100);
                }
              });
            });
          }
          this.generarBarrasNotasLiteral();
          this.cargando = false;
        }
      }
    });
  }

  listarNotasPeriodoVigesimal(periodoid: number, fecha: string) {
    this.datos2 = [];
    this.cargando = true;
    this.notaService.notasHoyVigesimal(periodoid, fecha).subscribe({
      next: ({ ok, notas }) => {
        if (ok) {
          if (notas.length > 0) {
            let totalNotas = notas.length;

            this.rangos.forEach(rango => {
              let objeto = {
                rango: rango,
                total: 0,
                porcentaje: 0
              }
              this.datos2.push(objeto);
             
            });

            notas.forEach(nota => {
              this.datos2.forEach(dato => {
                if (dato.rango.inicio <= nota.valor && dato.rango.fin >= nota.valor) {
                  dato.total = dato.total + 1;
                  dato.porcentaje = Math.round((dato.total / totalNotas) * 100);
                }
              });
            });
            
          }
          this.generarBarrasNotasVigesimal();
          this.cargando = false;
        }
      }
    });
  }

  listarAsistenciasPeriodo(periodoid: number, fecha: string) {
    this.datos3 = [];
    this.cargando = true;
    this.asistenciaService.asistenciasHoy(periodoid, fecha).subscribe({
      next: ({ ok, asistencias }) => {
        if (ok) {
          if (asistencias.length > 0) {
            let totalNotas = asistencias.length;
            this.situaciones.forEach(situacion => {
              let objeto = {
                situacion: situacion,
                total: 0,
                porcentaje: 0
              }
              this.datos3.push(objeto);
            });

            asistencias.forEach(asistencia => {
              this.datos3.forEach(dato => {
                if (dato.situacion.nombre == asistencia.situacion?.nombre) {
                  dato.total = dato.total + 1;
                  dato.porcentaje = Math.round((dato.total / totalNotas) * 100);
                }
              });
            });
          }
          this.generarBarrasAsistencias();
          this.cargando = false;
        }
      }
    });
  }

  ngOnInit(): void {
  }

}
