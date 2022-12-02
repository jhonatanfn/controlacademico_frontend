import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { PipesModule } from '../pipes/pipes.module';
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { PerfilComponent } from './perfil/perfil.component';
import { AreasComponent } from './areas/areas.component';
import { SubareasComponent } from './subareas/subareas.component';
import { RolesComponent } from './roles/roles.component';
import { ComponentsModule } from '../components/components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DocentesComponent } from './docentes/docentes.component';
import { AlumnosComponent } from './alumnos/alumnos.component';
import { ApoderadosComponent } from './apoderados/apoderados.component';
import { NivelesComponent } from './niveles/niveles.component';
import { GradosComponent } from './grados/grados.component';
import { SeccionesComponent } from './secciones/secciones.component';
import { ProgramacionesComponent } from './programaciones/programaciones.component';
import { AulasComponent } from './aulas/aulas.component';
import { CrearDocenteComponent } from './docentes/crear-docente/crear-docente.component';
import { EditarDocenteComponent } from './docentes/editar-docente/editar-docente.component';
import { CrearApoderadoComponent } from './apoderados/crear-apoderado/crear-apoderado.component';
import { EditarApoderadoComponent } from './apoderados/editar-apoderado/editar-apoderado.component';
import { CrearAlumnoComponent } from './alumnos/crear-alumno/crear-alumno.component';
import { EditarAlumnoComponent } from './alumnos/editar-alumno/editar-alumno.component';
import { CrearAulaComponent } from './aulas/crear-aula/crear-aula.component';
import { EditarAulaComponent } from './aulas/editar-aula/editar-aula.component';
import { CrearProgramacionComponent } from './programaciones/crear-programacion/crear-programacion.component';
import { EditarProgramacionComponent } from './programaciones/editar-programacion/editar-programacion.component';
import { MatriculasComponent } from './matriculas/matriculas.component';
import { NotasComponent } from './notas/notas.component';
import { CrearMatriculaComponent } from './matriculas/crear-matricula/crear-matricula.component';
import { AsistenciasComponent } from './asistencias/asistencias.component';
import { ReportesComponent } from './reportes/reportes.component';
import { MaterialesComponent } from './materiales/materiales.component';
import { ListaDocenteComponent } from './programaciones/lista-docente/lista-docente.component';
import { NotaDocenteComponent } from './notas/docente/nota-docente/nota-docente.component';
import { MaterialDocenteComponent } from './materiales/docente/material-docente/material-docente.component';
import { CrearComponent } from './notas/administrador/crear/crear.component';
import { EditarComponent } from './notas/administrador/editar/editar.component';
import { EliminarComponent } from './notas/administrador/eliminar/eliminar.component';
import { CrearNotaDocenteComponent } from './notas/docente/crear-nota-docente/crear-nota-docente.component';
import { EditarNotaDocenteComponent } from './notas/docente/editar-nota-docente/editar-nota-docente.component';
import { EliminarNotaDocenteComponent } from './notas/docente/eliminar-nota-docente/eliminar-nota-docente.component';
import { ListaMaterialDocenteComponent } from './materiales/docente/lista-material-docente/lista-material-docente.component';
import { MaterialComponent } from './materiales/administrador/material/material.component';
import { CrearAsistenciaComponent } from './asistencias/administrador/crear-asistencia/crear-asistencia.component';
import { EditarAsistenciaComponent } from './asistencias/administrador/editar-asistencia/editar-asistencia.component';
import { EliminarAsistenciaComponent } from './asistencias/administrador/eliminar-asistencia/eliminar-asistencia.component';
import { ListaAsistenciaDocenteComponent } from './asistencias/docente/lista-asistencia-docente/lista-asistencia-docente.component';
import { CrearAsistenciaDocenteComponent } from './asistencias/docente/crear-asistencia-docente/crear-asistencia-docente.component';
import { EditarAsistenciaDocenteComponent } from './asistencias/docente/editar-asistencia-docente/editar-asistencia-docente.component';
import { EliminarAsistenciaDocenteComponent } from './asistencias/docente/eliminar-asistencia-docente/eliminar-asistencia-docente.component';
import { ListaMatriculaAlumnoComponent } from './matriculas/alumno/lista-matricula-alumno/lista-matricula-alumno.component';
import { VerNotaAlumnoComponent } from './matriculas/alumno/ver-nota-alumno/ver-nota-alumno.component';
import { ListaMaterialAlumnoComponent } from './materiales/alumno/lista-material-alumno/lista-material-alumno.component';
import { VerMaterialAlumnoComponent } from './materiales/alumno/ver-material-alumno/ver-material-alumno.component';
import { ReporteNotaComponent } from './reportes/reporte-nota/reporte-nota.component';
import { ReporteAsistenciaComponent } from './reportes/reporte-asistencia/reporte-asistencia.component';
import { ListaMatriculaApoderadoComponent } from './matriculas/apoderado/lista-matricula-apoderado/lista-matricula-apoderado.component';
import { VerNotaApoderadoComponent } from './matriculas/apoderado/ver-nota-apoderado/ver-nota-apoderado.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { InstitucionComponent } from './institucion/institucion.component';
import { ReporteAnualNotaComponent } from './reportes/reporte-anual-nota/reporte-anual-nota.component';
import { ReporteAsistenciaRangoComponent } from './reportes/reporte-asistencia-rango/reporte-asistencia-rango.component';
import { ReporteNotaAlumnoComponent } from './reportes/reporte-nota-alumno/reporte-nota-alumno.component';
import { ReporteAsistenciaAlumnoComponent } from './reportes/reporte-asistencia-alumno/reporte-asistencia-alumno.component';
import { ReporteNotaAlumnoAnualComponent } from './reportes/reporte-nota-alumno-anual/reporte-nota-alumno-anual.component';
import { PeriodosComponent } from './periodos/periodos.component';
import { HorariosComponent } from './horarios/horarios.component';
import { CrearHorarioComponent } from './horarios/crear-horario/crear-horario.component';
import { EditarHorarioComponent } from './horarios/editar-horario/editar-horario.component';
import { EliminarHorarioComponent } from './horarios/eliminar-horario/eliminar-horario.component';
import { ConsultaHorarioComponent } from './horarios/consulta-horario/consulta-horario.component';
import { HorarioAlumnoComponent } from './horarios/alumno/horario-alumno/horario-alumno.component';
import { HorarioApoderadoComponent } from './horarios/apoderado/horario-apoderado/horario-apoderado.component';
import { HorarioDocenteComponent } from './horarios/docente/horario-docente/horario-docente.component';
import { RangosComponent } from './rangos/rangos.component';
import { ReporteNotaAreaComponent } from './reportes/reporte-nota-area/reporte-nota-area.component';
import { ReporteNotaAreaTotalComponent } from './reportes/reporte-nota-area-total/reporte-nota-area-total.component';
import { ReporteNotaConsolidadoComponent } from './reportes/reporte-nota-consolidado/reporte-nota-consolidado.component';
import { NgChartsModule } from 'ng2-charts';
import { ReporteAsistenciaConsolidadoComponent } from './reportes/reporte-asistencia-consolidado/reporte-asistencia-consolidado.component';
import { MensajeriasComponent } from './mensajerias/mensajerias.component';
import { PadresComponent } from './padres/padres.component';
import { MadresComponent } from './madres/madres.component';
import { CrearPadreComponent } from './padres/crear-padre/crear-padre.component';
import { EditarPadreComponent } from './padres/editar-padre/editar-padre.component';
import { CrearMadreComponent } from './madres/crear-madre/crear-madre.component';
import { EditarMadreComponent } from './madres/editar-madre/editar-madre.component';
import { FichaAlumnoComponent } from './alumnos/ficha-alumno/ficha-alumno.component';
import { CompetenciasComponent } from './competencias/competencias.component';
import { VerAsistenciaComponent } from './asistencias/alumno/ver-asistencia/ver-asistencia.component';
import { AuxiliaresComponent } from './auxiliares/auxiliares.component';
import { CrearAuxiliarComponent } from './auxiliares/crear-auxiliar/crear-auxiliar.component';
import { EditarAuxiliarComponent } from './auxiliares/editar-auxiliar/editar-auxiliar.component';
import { ListaAsistenciaComponent } from './asistencias/auxiliar/lista-asistencia/lista-asistencia.component';
import { CrearAsistenciaAuxiliarComponent } from './asistencias/auxiliar/crear-asistencia-auxiliar/crear-asistencia-auxiliar.component';
import { EditarAsistenciaAuxiliarComponent } from './asistencias/auxiliar/editar-asistencia-auxiliar/editar-asistencia-auxiliar.component';
import { EliminarAsistenciaAuxiliarComponent } from './asistencias/auxiliar/eliminar-asistencia-auxiliar/eliminar-asistencia-auxiliar.component';
import { ConsultarHorarioAuxiliarComponent } from './horarios/auxiliar/consultar-horario-auxiliar/consultar-horario-auxiliar.component';
import { ConsultarHorarioDocenteComponent } from './auxiliares/consultar-horario-docente/consultar-horario-docente.component';
import { VerAsistenciaPadreComponent } from './asistencias/padre/ver-asistencia-padre/ver-asistencia-padre.component';
import { ListaMatriculaMadreComponent } from './matriculas/apoderado/lista-matricula-madre/lista-matricula-madre.component';
import { VerNotaMadreComponent } from './matriculas/apoderado/ver-nota-madre/ver-nota-madre.component';
import { VerAsistenciaMadreComponent } from './asistencias/madre/ver-asistencia-madre/ver-asistencia-madre.component';
import { DirectoresComponent } from './directores/directores.component';
import { CrearDirectorComponent } from './directores/crear-director/crear-director.component';
import { EditarDirectorComponent } from './directores/editar-director/editar-director.component';
import { InformesComponent } from './informes/informes.component';
import { ApreciacionesComponent } from './apreciaciones/apreciaciones.component';
import { PadresfamiliaComponent } from './padresfamilia/padresfamilia.component';
import { CrearPadrefamiliaComponent } from './padresfamilia/crear-padrefamilia/crear-padrefamilia.component';
import { EditarPadrefamiliaComponent } from './padresfamilia/editar-padrefamilia/editar-padrefamilia.component';
import { CrearApreciacionComponent } from './apreciaciones/crear-apreciacion/crear-apreciacion.component';
import { EditarApreciacionComponent } from './apreciaciones/editar-apreciacion/editar-apreciacion.component';
import { GestionAlumnoComponent } from './notas/administrador/gestion-alumno/gestion-alumno.component';
import { GestionAlumnoDocenteComponent } from './notas/docente/gestion-alumno-docente/gestion-alumno-docente.component';


@NgModule({
  declarations: [
    PagesComponent,
    UsuariosComponent,
    DashboardComponent,
    PerfilComponent,
    AreasComponent,
    SubareasComponent,
    RolesComponent,
    DocentesComponent,
    AlumnosComponent,
    ApoderadosComponent,
    NivelesComponent,
    GradosComponent,
    SeccionesComponent,
    ProgramacionesComponent,
    AulasComponent,
    CrearDocenteComponent,
    EditarDocenteComponent,
    CrearApoderadoComponent,
    EditarApoderadoComponent,
    CrearAlumnoComponent,
    EditarAlumnoComponent,
    CrearAulaComponent,
    EditarAulaComponent,
    CrearProgramacionComponent,
    EditarProgramacionComponent,
    MatriculasComponent,
    NotasComponent,
    CrearMatriculaComponent,
    AsistenciasComponent,
    ReportesComponent,
    MaterialesComponent,
    ListaDocenteComponent,
    NotaDocenteComponent,
    MaterialDocenteComponent,
    CrearNotaDocenteComponent,
    EditarNotaDocenteComponent,
    ListaMaterialDocenteComponent,
    EliminarNotaDocenteComponent,
    CrearComponent,
    EditarComponent,
    EliminarComponent,
    MaterialComponent,
    CrearAsistenciaComponent,
    EditarAsistenciaComponent,
    EliminarAsistenciaComponent,
    ListaAsistenciaDocenteComponent,
    CrearAsistenciaDocenteComponent,
    EditarAsistenciaDocenteComponent,
    EliminarAsistenciaDocenteComponent,
    ListaMatriculaAlumnoComponent,
    VerNotaAlumnoComponent,
    ListaMaterialAlumnoComponent,
    VerMaterialAlumnoComponent,
    ReporteNotaComponent,
    ReporteAsistenciaComponent,
    ListaMatriculaApoderadoComponent,
    VerNotaApoderadoComponent,
    InstitucionComponent,
    ReporteAnualNotaComponent,
    ReporteAsistenciaRangoComponent,
    ReporteNotaAlumnoComponent,
    ReporteAsistenciaAlumnoComponent,
    ReporteNotaAlumnoAnualComponent,
    PeriodosComponent,
    HorariosComponent,
    CrearHorarioComponent,
    EditarHorarioComponent,
    EliminarHorarioComponent,
    ConsultaHorarioComponent,
    HorarioAlumnoComponent,
    HorarioApoderadoComponent,
    HorarioDocenteComponent,
    RangosComponent,
    ReporteNotaAreaComponent,
    ReporteNotaAreaTotalComponent,
    ReporteNotaConsolidadoComponent,
    ReporteAsistenciaConsolidadoComponent,
    MensajeriasComponent,
    PadresComponent,
    MadresComponent,
    CrearPadreComponent,
    EditarPadreComponent,
    CrearMadreComponent,
    EditarMadreComponent,
    FichaAlumnoComponent,
    CompetenciasComponent,
    VerAsistenciaComponent,
    AuxiliaresComponent,
    CrearAuxiliarComponent,
    EditarAuxiliarComponent,
    ListaAsistenciaComponent,
    CrearAsistenciaAuxiliarComponent,
    EditarAsistenciaAuxiliarComponent,
    EliminarAsistenciaAuxiliarComponent,
    ConsultarHorarioAuxiliarComponent,
    ConsultarHorarioDocenteComponent,
    VerAsistenciaPadreComponent,
    ListaMatriculaMadreComponent,
    VerNotaMadreComponent,
    VerAsistenciaMadreComponent,
    DirectoresComponent,
    CrearDirectorComponent,
    EditarDirectorComponent,
    InformesComponent,
    ApreciacionesComponent,
    PadresfamiliaComponent,
    CrearPadrefamiliaComponent,
    EditarPadrefamiliaComponent,
    CrearApreciacionComponent,
    EditarApreciacionComponent,
    GestionAlumnoComponent,
    GestionAlumnoDocenteComponent
  ],
  imports: [
    RouterModule,
    ReactiveFormsModule,
    CommonModule,
    SharedModule,
    PipesModule,
    ComponentsModule,
    FormsModule,
    NgSelectModule,
    NgChartsModule
  ]
})
export class PagesModule { }
