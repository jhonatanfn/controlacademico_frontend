import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { PerfilComponent } from './perfil/perfil.component';
import { AreasComponent } from './areas/areas.component';
import { AdminGuard } from '../guards/admin.guard';
import { DocenteGuard } from '../guards/docente.guard';
import { TodoGuard } from '../guards/todo.guard';
import { RouterModule, Routes } from '@angular/router';
import { DocentesComponent } from './docentes/docentes.component';
import { AlumnosComponent } from './alumnos/alumnos.component';
import { NivelesComponent } from './niveles/niveles.component';
import { GradosComponent } from './grados/grados.component';
import { SeccionesComponent } from './secciones/secciones.component';
import { ProgramacionesComponent } from './programaciones/programaciones.component';
import { AulasComponent } from './aulas/aulas.component';
import { CrearDocenteComponent } from './docentes/crear-docente/crear-docente.component';
import { EditarDocenteComponent } from './docentes/editar-docente/editar-docente.component';
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
import { IsProgramacionGuard } from '../guards/is-programacion.guard';
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
import { AlumnoGuard } from '../guards/alumno.guard';
import { VerNotaAlumnoComponent } from './matriculas/alumno/ver-nota-alumno/ver-nota-alumno.component';
import { IsMatriculaGuard } from '../guards/is-matricula.guard';
import { ListaMaterialAlumnoComponent } from './materiales/alumno/lista-material-alumno/lista-material-alumno.component';
import { VerMaterialAlumnoComponent } from './materiales/alumno/ver-material-alumno/ver-material-alumno.component';
import { IsProgramacionAlumnoGuard } from '../guards/is-programacion-alumno.guard';
import { ListaMatriculaApoderadoComponent } from './matriculas/apoderado/lista-matricula-apoderado/lista-matricula-apoderado.component';
import { VerNotaApoderadoComponent } from './matriculas/apoderado/ver-nota-apoderado/ver-nota-apoderado.component';
import { ApoderadoGuard } from '../guards/apoderado.guard';
import { IsMatriculaApoderadoGuard } from '../guards/is-matricula-apoderado.guard';
import { InstitucionComponent } from './institucion/institucion.component';
import { ReporteAnualNotaComponent } from './reportes/reporte-anual-nota/reporte-anual-nota.component';
import { ReporteAsistenciaRangoComponent } from './reportes/reporte-asistencia-rango/reporte-asistencia-rango.component';
import { ReporteAsistenciaAlumnoComponent } from './reportes/reporte-asistencia-alumno/reporte-asistencia-alumno.component';
import { AdmindocenteapoderadoGuard } from '../guards/admindocenteapoderado.guard';
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
import { ReporteNotaAreaTotalComponent } from './reportes/reporte-nota-area-total/reporte-nota-area-total.component';
import { ReporteNotaConsolidadoComponent } from './reportes/reporte-nota-consolidado/reporte-nota-consolidado.component';
import { AdmindocenteGuard } from '../guards/admindocente.guard';
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
import { IsAulaDocenteGuard } from '../guards/is-aula-docente.guard';
import { VerAsistenciaComponent } from './asistencias/alumno/ver-asistencia/ver-asistencia.component';
import { AuxiliaresComponent } from './auxiliares/auxiliares.component';
import { CrearAuxiliarComponent } from './auxiliares/crear-auxiliar/crear-auxiliar.component';
import { EditarAuxiliarComponent } from './auxiliares/editar-auxiliar/editar-auxiliar.component';
import { ListaAsistenciaComponent } from './asistencias/auxiliar/lista-asistencia/lista-asistencia.component';
import { AuxiliarGuard } from '../guards/auxiliar.guard';
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
import { ReporteNotaAlumnoAnualComponent } from './reportes/reporte-nota-alumno-anual/reporte-nota-alumno-anual.component';
import { InformesComponent } from './informes/informes.component';
import { ApreciacionesComponent } from './apreciaciones/apreciaciones.component';

const childrenRoutes: Routes = [
  {
    path: '', component: DashboardComponent,
    canActivate: [TodoGuard],
    data: {
      titulo: 'Principal', icono: 'bi bi-speedometer',
      accion: 'Bienvenido', enlace: ''
    }
  },
  {
    path: 'institucion', component: InstitucionComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Institución', icono: 'bi bi-house',
      accion: 'Actualizar', enlace: 'institucion'
    }
  },
  {
    path: 'usuarios', component: UsuariosComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Usuarios', icono: 'bi bi-person',
      accion: 'Lista', enlace: 'usuarios'
    }
  },
  {
    path: 'areas', component: AreasComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Areas', icono: 'bi bi-folder2-open',
      accion: 'Lista', enlace: 'areas'
    }
  },
  {
    path: 'periodos', component: PeriodosComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Periodos', icono: 'bi bi-hourglass-split',
      accion: 'Lista', enlace: 'periodos'
    }
  },
  {
    path: 'perfil', component: PerfilComponent,
    canActivate: [TodoGuard],
    data: {
      titulo: 'Perfil', icono: 'bi bi-postcard',
      accion: 'Actualizar', enlace: 'perfil'
    }
  },
  {
    path: 'docentes', component: DocentesComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Docentes', icono: 'bi bi-person-video3',
      accion: 'Lista', enlace: 'docentes'
    }
  },
  {
    path: 'docentes/crear', component: CrearDocenteComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Docentes', icono: 'bi bi-person-video3',
      accion: 'Crear', enlace: 'docentes'
    }
  },
  {
    path: 'docentes/editar/:id', component: EditarDocenteComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Docentes', icono: 'bi bi-person-video3',
      accion: 'Editar', enlace: 'docentes'
    }
  },
  {
    path: 'alumnos', component: AlumnosComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Alumnos', icono: 'bi bi-mortarboard',
      accion: 'Lista', enlace: 'alumnos'
    }
  },
  {
    path: 'alumnos/crear', component: CrearAlumnoComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Alumnos', icono: 'bi bi-mortarboard',
      accion: 'Crear', enlace: 'alumnos'
    }
  },
  {
    path: 'alumnos/editar/:id', component: EditarAlumnoComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Alumnos', icono: 'bi bi-mortarboard',
      accion: 'Editar', enlace: 'alumnos'
    }
  },
  {
    path: 'niveles', component: NivelesComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Niveles', icono: 'bi bi-view-stacked',
      accion: 'Lista', enlace: 'niveles'
    }
  },
  {
    path: 'rangos', component: RangosComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Rangos', icono: 'bi bi-calendar3-range',
      accion: 'Lista', enlace: 'rangos'
    }
  },
  {
    path: 'grados', component: GradosComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Grados', icono: 'bi bi-layout-three-columns',
      accion: 'Lista', enlace: 'grados'
    }
  },
  {
    path: 'secciones', component: SeccionesComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Secciones', icono: 'bi bi-columns-gap',
      accion: 'Lista', enlace: 'secciones'
    }
  },
  {
    path: 'asignaciones', component: ProgramacionesComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Asignaciones', icono: 'bi bi-pc-display-horizontal',
      accion: 'Lista', enlace: 'asignaciones'
    }
  },
  {
    path: 'asignaciones/crear', component: CrearProgramacionComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Asignaciones', icono: 'bi bi-pc-display-horizontal',
      accion: 'Crear', enlace: 'asignaciones'
    }
  },
  {
    path: 'asignaciones/editar/:id', component: EditarProgramacionComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Asignaciones', icono: 'bi bi-pc-display-horizontal',
      accion: 'Editar', enlace: 'asignaciones'
    }
  },
  {
    path: 'asignaciones/docente', component: ListaDocenteComponent,
    canActivate: [DocenteGuard],
    data: {
      titulo: 'Asignaciones', icono: 'bi bi-pc-display-horizontal',
      accion: 'Lista', enlace: 'asignaciones/docente'
    }
  },
  {
    path: 'matriculas', component: MatriculasComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Matriculas', icono: 'bi bi-file-earmark-ruled',
      accion: 'Lista', enlace: 'matriculas'
    }
  },
  {
    path: 'matriculas/crear', component: CrearMatriculaComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Matriculas', icono: 'bi bi-file-earmark-ruled',
      accion: 'Crear', enlace: 'matriculas'
    }
  },
  {
    path: 'matriculas/alumno', component: ListaMatriculaAlumnoComponent,
    canActivate: [AlumnoGuard],
    data: {
      titulo: 'Notas', icono: 'bi bi-stickies',
      accion: 'Lista', enlace: 'matriculas/alumno'
    }
  },

  {
    path: 'matriculas/alumno/:id', component: VerNotaAlumnoComponent,
    canActivate: [AlumnoGuard, IsMatriculaGuard],
    data: {
      titulo: 'Notas', icono: 'bi bi-stickies',
      accion: 'Consultar', enlace: 'matriculas/alumno'
    }
  },
  {
    path: 'matriculas/padre', component: ListaMatriculaApoderadoComponent,
    canActivate: [ApoderadoGuard],
    data: {
      titulo: 'Notas', icono: 'bi bi-stickies',
      accion: 'Lista', enlace: 'matriculas/padre'
    }
  },
  {
    path: 'matriculas/madre', component: ListaMatriculaMadreComponent,
    canActivate: [ApoderadoGuard],
    data: {
      titulo: 'Notas', icono: 'bi bi-stickies',
      accion: 'Lista', enlace: 'matriculas/madre'
    }
  },

  {
    path: 'matriculas/padre/notas/:id', component: VerNotaApoderadoComponent,
    canActivate: [ApoderadoGuard, IsMatriculaApoderadoGuard],
    data: {
      titulo: 'Notas', icono: 'bi bi-stickies',
      accion: 'Consultar', enlace: 'matriculas/padre'
    }
  },

  {
    path: 'matriculas/madre/notas/:id', component: VerNotaMadreComponent,
    canActivate: [ApoderadoGuard, IsMatriculaApoderadoGuard],
    data: {
      titulo: 'Notas', icono: 'bi bi-stickies',
      accion: 'Consultar', enlace: 'matriculas/madre'
    }
  },

  {
    path: 'asistencias/padre/ver', component: VerAsistenciaPadreComponent,
    canActivate: [ApoderadoGuard],
    canLoad: [],
    data: {
      titulo: 'Asistencias', icono: 'bi bi-megaphone',
      accion: 'Consultar', enlace: 'asistencias/padre/ver'
    }
  },

  {
    path: 'asistencias/madre/ver', component: VerAsistenciaMadreComponent,
    canActivate: [ApoderadoGuard],
    canLoad: [],
    data: {
      titulo: 'Asistencias', icono: 'bi bi-megaphone',
      accion: 'Consultar', enlace: 'asistencias/padre/ver'
    }
  },

  {
    path: 'notas', component: NotasComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Notas', icono: 'bi bi-stickies',
      accion: 'Lista', enlace: 'notas'
    }
  },

  {
    path: 'notas/crear/:id', component: CrearComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Notas', icono: 'bi bi-stickies',
      accion: 'Crear', enlace: 'notas'
    }
  },
  {
    path: 'notas/editar/:id', component: EditarComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Notas', icono: 'bi bi-stickies',
      accion: 'Editar', enlace: 'notas'
    }
  },
  {
    path: 'notas/eliminar/:id', component: EliminarComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Notas', icono: 'bi bi-stickies',
      accion: 'Eliminar', enlace: 'notas'
    }
  },

  {
    path: 'notas/docente', component: NotaDocenteComponent,
    canActivate: [DocenteGuard],
    data: {
      titulo: 'Notas', icono: 'bi bi-stickies',
      accion: 'Lista', enlace: 'notas/docente'
    }
  },
  {
    path: 'notas/docente/crear/:id', component: CrearNotaDocenteComponent,
    canActivate: [DocenteGuard, IsProgramacionGuard],
    canLoad: [IsProgramacionGuard],
    data: {
      titulo: 'Notas', icono: 'bi bi-stickies',
      accion: 'Crear', enlace: 'notas/docente'
    }
  },
  {
    path: 'notas/docente/editar/:id', component: EditarNotaDocenteComponent,
    canActivate: [DocenteGuard, IsProgramacionGuard],
    canLoad: [IsProgramacionGuard],
    data: {
      titulo: 'Notas', icono: 'bi bi-stickies',
      accion: 'Editar', enlace: 'notas/docente'
    }
  },
  {
    path: 'notas/docente/eliminar/:id', component: EliminarNotaDocenteComponent,
    canActivate: [DocenteGuard, IsProgramacionGuard],
    canLoad: [IsProgramacionGuard],
    data: {
      titulo: 'Notas', icono: 'bi bi-stickies',
      accion: 'Eliminar', enlace: 'notas/docente'
    }
  },

  {
    path: 'aulas', component: AulasComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Aulas', icono: 'bi bi-door-closed',
      accion: 'Lista', enlace: 'aulas'
    }
  },
  {
    path: 'aulas/crear', component: CrearAulaComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Aulas', icono: 'bi bi-door-closed',
      accion: 'Crear', enlace: 'aulas'
    }
  },
  {
    path: 'aulas/editar/:id', component: EditarAulaComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Aulas', icono: 'bi bi-door-closed',
      accion: 'Editar', enlace: 'aulas'
    }
  },

  {
    path: 'asistencias', component: AsistenciasComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Asistencias', icono: 'bi bi-megaphone',
      accion: 'Lista', enlace: 'asistencias'
    }
  },
  {
    path: 'asistencias/crear/:id', component: CrearAsistenciaComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Asistencias', icono: 'bi bi-megaphone',
      accion: 'Crear', enlace: 'asistencias'
    }
  },
  {
    path: 'asistencias/editar/:id', component: EditarAsistenciaComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Asistencias', icono: 'bi bi-megaphone',
      accion: 'Editar', enlace: 'asistencias'
    }
  },
  {
    path: 'asistencias/eliminar/:id', component: EliminarAsistenciaComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Asistencias', icono: 'bi bi-megaphone',
      accion: 'Eliminar', enlace: 'asistencias'
    }
  },

  {
    path: 'asistencias/docente', component: ListaAsistenciaDocenteComponent,
    canActivate: [DocenteGuard],
    data: {
      titulo: 'Asistencias', icono: 'bi bi-megaphone',
      accion: 'Lista', enlace: 'asistencias/docente'
    }
  },
  {
    path: 'asistencias/docente/crear/:id', component: CrearAsistenciaDocenteComponent,
    canActivate: [DocenteGuard, IsAulaDocenteGuard],
    data: {
      titulo: 'Asistencias', icono: 'bi bi-megaphone',
      accion: 'Crear', enlace: 'asistencias/docente'
    }
  },
  {
    path: 'asistencias/docente/editar/:id', component: EditarAsistenciaDocenteComponent,
    canActivate: [DocenteGuard, IsAulaDocenteGuard],
    data: {
      titulo: 'Asistencias', icono: 'bi bi-megaphone',
      accion: 'Editar', enlace: 'asistencias/docente'
    }
  },
  {
    path: 'asistencias/docente/eliminar/:id', component: EliminarAsistenciaDocenteComponent,
    canActivate: [DocenteGuard, IsAulaDocenteGuard],
    data: {
      titulo: 'Asistencias', icono: 'bi bi-megaphone',
      accion: 'Eliminar', enlace: 'asistencias/docente'
    }
  },

  {
    path: 'asistencias/alumno/ver', component: VerAsistenciaComponent,
    canActivate: [AlumnoGuard],
    data: {
      titulo: 'Asistencias', icono: 'bi bi-megaphone',
      accion: 'Consultar', enlace: 'asistencias/alumno/ver'
    }
  },

  {
    path: 'reportes', component: ReportesComponent,
    canActivate: [AdmindocenteapoderadoGuard],
    data: {
      titulo: 'Reportes', icono: 'bi bi-printer-fill',
      principal: 'Reportes', accion: '', enlace: 'reportes'
    }
  },

  {
    path: 'materiales', component: MaterialesComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Materiales', icono: 'bi bi-folder2',
      accion: 'Lista', enlace: 'materiales'
    }
  },
  {
    path: 'materiales/docente', component: ListaMaterialDocenteComponent,
    canActivate: [DocenteGuard],
    data: {
      titulo: 'Materiales', icono: 'bi bi-folder2',
      accion: 'Lista', enlace: 'materiales/docente'
    }
  },
  {
    path: 'materiales/docente/:id', component: MaterialDocenteComponent,
    canActivate: [DocenteGuard, IsProgramacionGuard],
    canLoad: [IsProgramacionGuard],
    data: {
      titulo: 'Materiales', icono: 'bi bi-folder2',
      accion: 'Lista', enlace: 'materiales/docente'
    }
  },
  {
    path: 'materiales/alumno', component: ListaMaterialAlumnoComponent,
    canActivate: [AlumnoGuard],
    data: {
      titulo: 'Materiales', icono: 'bi bi-folder2',
      accion: 'Lista', enlace: 'materiales/alumno'
    }
  },
  {
    path: 'materiales/alumno/:id', component: VerMaterialAlumnoComponent,
    canActivate: [AlumnoGuard, IsProgramacionAlumnoGuard],
    data: {
      titulo: 'Materiales', icono: 'bi bi-folder2',
      accion: 'Consultar', enlace: 'materiales/alumno'
    }
  },
  {
    path: 'materiales/:id', component: MaterialComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Materiales', icono: 'bi bi-folder2',
      accion: 'Lista', enlace: 'materiales'
    }
  },
  /*
  {
    path: 'reportes/notaseva', component: ReporteNotaComponent,
    canActivate: [AdmindocenteapoderadoGuard],
    data: {
      titulo: 'Reportes', icono: 'bi bi-printer-fill',
      accion: 'Notas por evaluación', enlace: 'reportes'
    }
  },

  {
    path: 'reportes/asistencias', component: ReporteAsistenciaComponent,
    canActivate: [AdmindocenteapoderadoGuard],
    data: {
      titulo: 'Reportes', icono: 'bi bi-printer-fill',
      accion: 'Asistencias por fecha', enlace: 'reportes'
    }
  },
  */
  {
    path: 'reportes/anual', component: ReporteAnualNotaComponent,
    canActivate: [AdmindocenteapoderadoGuard],
    data: {
      titulo: 'Reportes', icono: 'bi bi-printer-fill',
      accion: 'Notas Alumno', enlace: 'reportes'
    }
  },
  {
    path: 'reportes/rango', component: ReporteAsistenciaRangoComponent,
    canActivate: [AdmindocenteapoderadoGuard],
    data: {
      titulo: 'Reportes', icono: 'bi bi-printer-fill',
      accion: 'Asistencias Fechas', enlace: 'reportes'
    }
  },
  /*
  {
    path: 'reportes/notasalumno', component: ReporteNotaAlumnoComponent,
    canActivate: [TodoGuard],
    data: {
      titulo: 'Buscar Notas', icono: 'bi bi-search',
      principal: 'Reportes', accion: 'Notas', enlace: 'reportes/notasalumno'
    }
  },
  */
  {
    path: 'reportes/asistenciasalumno', component: ReporteAsistenciaAlumnoComponent,
    canActivate: [TodoGuard],
    data: {
      titulo: 'Reportes', icono: 'bi bi-printer-fill',
      accion: 'Asistencias Alumno', enlace: 'reportes'
    }
  },
   /*
  {
    path: 'reportes/notasalumnoanual', component: ReporteNotaAlumnoAnualComponent,
    canActivate: [TodoGuard],
    data: {
      titulo: 'Reportes', icono: 'bi bi-printer-fill',
      accion: 'Informe', enlace: 'reportes'
    }
  },
 
{
  path: 'reportes/notasarea', component: ReporteNotaAreaComponent,
  canActivate: [TodoGuard],
  data: {
    titulo: 'Buscar Notas', icono: 'bi bi-search',
    principal: 'Reportes', accion: 'Notas', enlace: 'reportes/notasalumnoanual'
  }
},
*/
  {
    path: 'reportes/notasareatotal', component: ReporteNotaAreaTotalComponent,
    canActivate: [TodoGuard],
    data: {
      titulo: 'Reportes', icono: 'bi bi-printer-fill',
      accion: 'Notas Areas', enlace: 'reportes'
    }
  },
  {
    path: 'horarios', component: HorariosComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Horarios', icono: 'bi bi-calendar3',
      accion: 'Lista', enlace: 'horarios'
    }
  },
  {
    path: 'horarios/crear', component: CrearHorarioComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Horarios', icono: 'bi bi-calendar3',
      accion: 'Crear', enlace: 'horarios'
    }
  },
  {
    path: 'horarios/editar/:id', component: EditarHorarioComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Horarios', icono: 'bi bi-calendar3',
      accion: 'Editar', enlace: 'horarios'
    }
  },
  {
    path: 'horarios/eliminar/:id', component: EliminarHorarioComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Horarios', icono: 'bi bi-calendar3',
      accion: 'Eliminar', enlace: 'horarios'
    }
  },
  {
    path: 'horarios/consultar/:id', component: ConsultaHorarioComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Horarios', icono: 'bi bi-calendar3',
      accion: 'Consultar', enlace: 'horarios'
    }
  },
  {
    path: 'horarios/alumno', component: HorarioAlumnoComponent,
    canActivate: [AlumnoGuard],
    data: {
      titulo: 'Horarios', icono: 'bi bi-calendar3',
      accion: 'Consultar', enlace: 'horarios'
    }
  },
  {
    path: 'horarios/docente', component: HorarioDocenteComponent,
    canActivate: [DocenteGuard],
    data: {
      titulo: 'Horarios', icono: 'bi bi-calendar3',
      accion: 'Consultar', enlace: 'horarios'
    }
  },
  {
    path: 'reportes/notas/consolidado', component: ReporteNotaConsolidadoComponent,
    canActivate: [AdmindocenteGuard],
    data: {
      titulo: 'Reportes', icono: 'bi bi-printer-fill',
      accion: 'Notas consolidado', enlace: 'reportes'
    }
  },
  {
    path: 'reportes/asistenciasconsolidado', component: ReporteAsistenciaConsolidadoComponent,
    canActivate: [AdmindocenteGuard],
    data: {
      titulo: 'Reportes', icono: 'bi bi-printer-fill',
      accion: 'Asistencias consolidado', enlace: 'reportes'
    }
  },
  {
    path: 'mensajerias', component: MensajeriasComponent,
    canActivate: [TodoGuard],
    data: {
      titulo: 'Mensajes', icono: 'bi bi-envelope-fill',
      accion: 'Bandeja', enlace: 'mensajerias'
    }
  },
  {
    path: 'padres', component: PadresComponent,
    canActivate: [TodoGuard],
    data: {
      titulo: 'Padres', icono: 'bi bi-gender-male',
      accion: 'Lista', enlace: 'padres'
    }
  },
  {
    path: 'padres/crear', component: CrearPadreComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Padres', icono: 'bi bi-gender-male',
      accion: 'Crear', enlace: 'padres'
    }
  },
  {
    path: 'padres/editar/:id', component: EditarPadreComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Padres', icono: 'bi bi-gender-male',
      accion: 'Editar', enlace: 'padres'
    }
  },
  {
    path: 'madres', component: MadresComponent,
    canActivate: [TodoGuard],
    data: {
      titulo: 'Madres', icono: 'bi bi-gender-female',
      accion: 'Lista', enlace: 'madres'
    }
  },
  {
    path: 'madres/crear', component: CrearMadreComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Madres', icono: 'bi bi-gender-female',
      accion: 'Crear', enlace: 'madres'
    }
  },
  {
    path: 'madres/editar/:id', component: EditarMadreComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Madres', icono: 'bi bi-gender-female',
      accion: 'Editar', enlace: 'madres'
    }
  },
  {
    path: 'alumnos/ficha/:id', component: FichaAlumnoComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Alumnos', icono: 'bi bi-person',
      accion: 'Ficha', enlace: 'alumnos'
    }
  },
  {
    path: 'competencias', component: CompetenciasComponent,
    canActivate: [TodoGuard],
    data: {
      titulo: 'Competencias', icono: 'bi bi-lightbulb',
      accion: 'Lista', enlace: 'competencias'
    }
  },

  {
    path: 'auxiliares', component: AuxiliaresComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Auxiliares', icono: 'bi bi-person-video',
      accion: 'Lista', enlace: 'auxiliares'
    }
  },
  {
    path: 'auxiliares/crear', component: CrearAuxiliarComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Auxiliares', icono: 'bi bi-person-video',
      accion: 'Crear', enlace: 'auxiliares'
    }
  },

  {
    path: 'auxiliares/editar/:id', component: EditarAuxiliarComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Auxiliares', icono: 'bi bi-person-video',
      accion: 'Editar', enlace: 'auxiliares'
    }
  },
  {
    path: 'asistencias/auxiliar', component: ListaAsistenciaComponent,
    canActivate: [AuxiliarGuard],
    data: {
      titulo: 'Auxiliares', icono: 'bi bi-megaphone',
      accion: 'Lista', enlace: 'asistencias/auxiliar'
    }
  },
  {
    path: 'asistencias/auxiliar/crear/:id', component: CrearAsistenciaAuxiliarComponent,
    canActivate: [AuxiliarGuard],
    data: {
      titulo: 'Asistencias', icono: 'bi bi-megaphone',
      accion: 'Crear', enlace: 'asistencias/auxiliar'
    }
  },
  {
    path: 'asistencias/auxiliar/editar/:id', component: EditarAsistenciaAuxiliarComponent,
    canActivate: [AuxiliarGuard],
    data: {
      titulo: 'Asistencias', icono: 'bi bi-megaphone',
      accion: 'Editar', enlace: 'asistencias/auxiliar'
    }
  },
  {
    path: 'asistencias/auxiliar/eliminar/:id', component: EliminarAsistenciaAuxiliarComponent,
    canActivate: [AuxiliarGuard],
    data: {
      titulo: 'Asistencias', icono: 'bi bi-megaphone',
      accion: 'Eliminar', enlace: 'asistencias/auxiliar'
    }
  },
  {
    path: 'horarios/auxiliar', component: ConsultarHorarioAuxiliarComponent,
    canActivate: [AuxiliarGuard],
    data: {
      titulo: 'Horarios', icono: 'bi bi-megaphone',
      accion: 'Consultar', enlace: 'horarios/auxiliar'
    }
  },
  {
    path: 'docentes/horarios', component: ConsultarHorarioDocenteComponent,
    canActivate: [AuxiliarGuard],
    data: {
      titulo: 'Docentes', icono: 'bi bi-person-video3',
      accion: 'Consultar', enlace: 'docentes/horarios'
    }
  },
  {
    path: 'horarios/padre', component: HorarioApoderadoComponent,
    canActivate: [ApoderadoGuard],
    data: {
      titulo: 'Horarios', icono: 'bi bi-calendar3',
      accion: 'Consultar', enlace: 'horarios/padre'
    }
  },
  {
    path: 'horarios/madre', component: HorarioApoderadoComponent,
    canActivate: [ApoderadoGuard],
    data: {
      titulo: 'Horarios', icono: 'bi bi-calendar3',
      accion: 'Consultar', enlace: 'horarios/padre'
    }
  },
  {
    path: 'directores', component: DirectoresComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Directores', icono: 'bi bi-award',
      accion: 'Lista', enlace: 'directores'
    }
  },
  {
    path: 'directores/crear', component: CrearDirectorComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Directores', icono: 'bi bi-award',
      accion: 'Crear', enlace: 'directores'
    }
  },
  {
    path: 'directores/editar/:id', component: EditarDirectorComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Directores', icono: 'bi bi-award',
      accion: 'Editar', enlace: 'directores'
    }
  },
  {
    path: 'informes', component: InformesComponent,
    canActivate: [AdmindocenteGuard],
    data: {
      titulo: 'Informes', icono: 'bi bi-file-earmark-post',
      accion: 'Buscar', enlace: 'informes'
    }
  },
  {
    path: 'apreciaciones', component: ApreciacionesComponent,
    canActivate: [AdmindocenteGuard],
    data: {
      titulo: 'Apreciaciones', icono: 'bi bi-chat-text',
      accion: 'Lista', enlace: 'apreciaciones'
    }
  }

];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(childrenRoutes),
    CommonModule
  ],
  exports: [
    RouterModule
  ]
})
export class ChildrenRoutesModule { }
