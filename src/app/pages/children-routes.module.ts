import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardComponent } from './dashboard/dashboard.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { PerfilComponent } from './perfil/perfil.component';
import { AreasComponent } from './areas/areas.component';
import { SubareasComponent } from './subareas/subareas.component';
import { RolesComponent } from './roles/roles.component';

import { AdminGuard } from '../guards/admin.guard';
import { DocenteGuard } from '../guards/docente.guard';
import { TodoGuard } from '../guards/todo.guard';
import { RouterModule, Routes } from '@angular/router';
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
import { ReporteNotaComponent } from './reportes/reporte-nota/reporte-nota.component';
import { ReporteAsistenciaComponent } from './reportes/reporte-asistencia/reporte-asistencia.component';
import { ListaMatriculaApoderadoComponent } from './matriculas/apoderado/lista-matricula-apoderado/lista-matricula-apoderado.component';
import { VerNotaApoderadoComponent } from './matriculas/apoderado/ver-nota-apoderado/ver-nota-apoderado.component';
import { VerAsistenciaApoderadoComponent } from './matriculas/apoderado/ver-asistencia-apoderado/ver-asistencia-apoderado.component';
import { ApoderadoGuard } from '../guards/apoderado.guard';
import { IsMatriculaApoderadoGuard } from '../guards/is-matricula-apoderado.guard';
import { InstitucionComponent } from './institucion/institucion.component';
import { VerAsistenciaAlumnoComponent } from './matriculas/alumno/ver-asistencia-alumno/ver-asistencia-alumno.component';
import { ReporteAnualNotaComponent } from './reportes/reporte-anual-nota/reporte-anual-nota.component';
import { ReporteAsistenciaRangoComponent } from './reportes/reporte-asistencia-rango/reporte-asistencia-rango.component';
import { ReporteNotaAlumnoComponent } from './reportes/reporte-nota-alumno/reporte-nota-alumno.component';
import { ReporteAsistenciaAlumnoComponent } from './reportes/reporte-asistencia-alumno/reporte-asistencia-alumno.component';
import { AdmindocenteapoderadoGuard } from '../guards/admindocenteapoderado.guard';
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

const childrenRoutes: Routes = [
  {
    path: '', component: DashboardComponent,
    canActivate: [TodoGuard],
    data: {
      titulo: 'Inicio', icono: 'bi bi-speedometer',
      accion: 'Bienvenido', enlace: ''
    }
  },
  {
    path: 'institucion', component: InstitucionComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Institución', icono: 'bi bi-building',
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
    path: 'subareas', component: SubareasComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Subareas', icono: 'bi bi-collection',
      accion: 'Lista', enlace: 'subareas'
    }
  },

  {
    path: 'roles', component: RolesComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Tabla Roles', icono: 'bi bi-table',
      principal: 'Roles', accion: '', enlace: 'roles'
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
    path: 'apoderados', component: ApoderadosComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Apoderados', icono: 'bi bi-file-ppt',
      accion: 'Lista', enlace: 'apoderados'
    }
  },
  {
    path: 'apoderados/crear', component: CrearApoderadoComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Apoderados', icono: 'bi bi-file-ppt',
      accion: 'Crear', enlace: 'apoderados'
    }
  },
  {
    path: 'apoderados/editar/:id', component: EditarApoderadoComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Apoderados', icono: 'bi bi-file-ppt',
      accion: 'Editar', enlace: 'apoderados'
    }
  },

  {
    path: 'niveles', component: NivelesComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Niveles', icono: 'bi bi-receipt',
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
      titulo: 'Grados', icono: 'bi bi-layout-text-sidebar',
      accion: 'Lista', enlace: 'grados'
    }
  },

  {
    path: 'secciones', component: SeccionesComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Secciones', icono: 'bi bi-layout-text-sidebar-reverse',
      accion: 'Lista', enlace: 'secciones'
    }
  },

  {
    path: 'programaciones', component: ProgramacionesComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Programaciones', icono: 'bi bi-pc-display-horizontal',
      accion: 'Lista', enlace: 'programaciones'
    }
  },
  {
    path: 'programaciones/crear', component: CrearProgramacionComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Programaciones', icono: 'bi bi-pc-display-horizontal',
      accion: 'Crear', enlace: 'programaciones'
    }
  },
  {
    path: 'programaciones/editar/:id', component: EditarProgramacionComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Programaciones', icono: 'bi bi-pc-display-horizontal',
      accion: 'Editar', enlace: 'programaciones'
    }
  },
  {
    path: 'programaciones/docente', component: ListaDocenteComponent,
    canActivate: [DocenteGuard],
    data: {
      titulo: 'Programaciones', icono: 'bi bi-pc-display-horizontal',
      accion: 'Lista', enlace: 'programaciones/docente'
    }
  },

  /**------------------------------------------------- */
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

  /** ALUMNO */
  {
    path: 'matriculas/alumno', component: ListaMatriculaAlumnoComponent,
    canActivate: [AlumnoGuard],
    data: {
      titulo: 'Matriculas', icono: 'bi bi-file-earmark-ruled',
      accion: 'Lista', enlace: 'matriculas/alumno'
    }
  },

  {
    path: 'matriculas/alumno/:id', component: VerNotaAlumnoComponent,
    canActivate: [AlumnoGuard, IsMatriculaGuard],
    canLoad: [IsMatriculaGuard],
    data: {
      titulo: 'Matriculas', icono: 'bi bi-file-earmark-ruled',
      accion: 'Consultar notas', enlace: 'matriculas/alumno'
    }
  },

  {
    path: 'matriculas/alumno/asistencia/:id', component: VerAsistenciaAlumnoComponent,
    canActivate: [AlumnoGuard, IsMatriculaGuard],
    canLoad: [IsMatriculaGuard],
    data: {
      titulo: 'Matriculas', icono: 'bi bi-file-earmark-ruled',
      accion: 'Consultar asistencias', enlace: 'matriculas/alumno'
    }
  },

  /** APODERADO */
  {
    path: 'matriculas/apoderado', component: ListaMatriculaApoderadoComponent,
    canActivate: [ApoderadoGuard],
    data: {
      titulo: 'Matriculas', icono: 'bi bi-file-earmark-ruled',
      accion: 'Lista', enlace: 'matriculas/apoderado'
    }
  },
  {
    path: 'matriculas/apoderado/notas/:id', component: VerNotaApoderadoComponent,
    canActivate: [ApoderadoGuard, IsMatriculaApoderadoGuard],
    data: {
      titulo: 'Matriculas', icono: 'bi bi-file-earmark-ruled',
      accion: 'Consultar notas', enlace: 'matriculas/apoderado'
    }
  },

  {
    path: 'matriculas/apoderado/asistencia/:id', component: VerAsistenciaApoderadoComponent,
    canActivate: [ApoderadoGuard, IsMatriculaApoderadoGuard],
    canLoad: [],
    data: {
      titulo: 'Matriculas', icono: 'bi bi-file-earmark-ruled',
      accion: 'Consultar asistencias', enlace: 'matriculas/apoderado'
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

  /* ADMINISTRADOR*/
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

  /*  ADMINISTRADOR  */
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

  /** ASISTENCIAS DOCENTE */
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
    canActivate: [DocenteGuard, IsProgramacionGuard],
    canLoad: [IsProgramacionGuard],
    data: {
      titulo: 'Asistencias', icono: 'bi bi-megaphone',
      accion: 'Crear', enlace: 'asistencias/docente'
    }
  },
  {
    path: 'asistencias/docente/editar/:id', component: EditarAsistenciaDocenteComponent,
    canActivate: [DocenteGuard, IsProgramacionGuard],
    canLoad: [IsProgramacionGuard],
    data: {
      titulo: 'Asistencias', icono: 'bi bi-megaphone',
      accion: 'Editar', enlace: 'asistencias/docente'
    }
  },
  {
    path: 'asistencias/docente/eliminar/:id', component: EliminarAsistenciaDocenteComponent,
    canActivate: [DocenteGuard, IsProgramacionGuard],
    canLoad: [IsProgramacionGuard],
    data: {
      titulo: 'Asistencias', icono: 'bi bi-megaphone',
      accion: 'Eliminar', enlace: 'asistencias/docente'
    }
  },

  
  {
    path: 'reportes', component: ReportesComponent,
    canActivate: [AdminGuard],
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

  /* MATERIALES DOCENTE */
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

  /**  MATERIALES ALUMNO */
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
    canLoad: [IsProgramacionAlumnoGuard],
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


  /**--------REPORTES---------- */
  {
    path: 'reportes/notas', component: ReporteNotaComponent,
    canActivate: [AdmindocenteapoderadoGuard],
    data: {
      titulo: 'Buscar Notas', icono: 'bi bi-search',
      principal: 'Reportes', accion: 'Notas', enlace: 'reportes/notas'
    }
  },
  {
    path: 'reportes/asistencias', component: ReporteAsistenciaComponent,
    canActivate: [AdmindocenteapoderadoGuard],
    data: {
      titulo: 'Buscar Asistencias', icono: 'bi bi-search',
      principal: 'Reportes', accion: 'Asistencias', enlace: 'reportes/asistencias'
    }
  },
  {
    path: 'reportes/anual', component: ReporteAnualNotaComponent,
    canActivate: [AdmindocenteapoderadoGuard],
    data: {
      titulo: 'Buscar Notas', icono: 'bi bi-search',
      principal: 'Reportes', accion: 'Notas', enlace: 'reportes/anual'
    }
  },
  {
    path: 'reportes/rango', component: ReporteAsistenciaRangoComponent,
    canActivate: [AdmindocenteapoderadoGuard],
    data: {
      titulo: 'Buscar Asistencias', icono: 'bi bi-search',
      principal: 'Reportes', accion: 'Asistencias', enlace: 'reportes/rango'
    }
  },
  {
    path: 'reportes/notasalumno', component: ReporteNotaAlumnoComponent,
    canActivate: [TodoGuard],
    data: {
      titulo: 'Buscar Notas', icono: 'bi bi-search',
      principal: 'Reportes', accion: 'Notas', enlace: 'reportes/notasalumno'
    }
  },
  {
    path: 'reportes/asistenciasalumno', component: ReporteAsistenciaAlumnoComponent,
    canActivate: [TodoGuard],
    data: {
      titulo: 'Buscar Asistencias', icono: 'bi bi-search',
      principal: 'Reportes', accion: 'Asistencias', enlace: 'reportes/asistenciasalumno'
    }
  },

  {
    path: 'reportes/notasalumnoanual', component: ReporteNotaAlumnoAnualComponent,
    canActivate: [TodoGuard],
    data: {
      titulo: 'Buscar Notas', icono: 'bi bi-search',
      principal: 'Reportes', accion: 'Notas', enlace: 'reportes/notasalumnoanual'
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
  {
    path: 'reportes/notasareatotal', component: ReporteNotaAreaTotalComponent,
    canActivate: [TodoGuard],
    data: {
      titulo: 'Buscar Notas', icono: 'bi bi-search',
      principal: 'Reportes', accion: 'Notas', enlace: 'reportes/notasareatotal'
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
    path: 'horarios/apoderado', component: HorarioApoderadoComponent,
    canActivate: [ApoderadoGuard],
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
