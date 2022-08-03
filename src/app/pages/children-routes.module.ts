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
      titulo: 'Inicio', icono: 'bi bi-house-door-fill',
      principal: 'Inicio', accion: '', enlace: ''
    }
  },

  {
    path: 'usuarios', component: UsuariosComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Tabla Usuarios', icono: 'bi bi-table',
      principal: 'Usuarios', accion: '', enlace: 'usuarios'
    }
  },

  {
    path: 'areas', component: AreasComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Tabla Areas', icono: 'bi bi-table',
      principal: 'Areas', accion: '', enlace: 'areas'
    }
  },

  {
    path: 'periodos', component: PeriodosComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Tabla Periodos', icono: 'bi bi-table',
      principal: 'Periodos', accion: '', enlace: 'periodos'
    }
  },

  {
    path: 'institucion', component: InstitucionComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Institución', icono: 'bi bi-table',
      principal: 'Institución', accion: '', enlace: 'institucion'
    }
  },

  {
    path: 'subareas', component: SubareasComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Tabla Subareas', icono: 'bi bi-table',
      principal: 'Subareas', accion: '', enlace: 'subareas'
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
      titulo: 'Datos del Perfil', icono: 'bi bi-card-checklist',
      principal: 'Perfil', accion: '', enlace: 'perfil'
    }
  },


  {
    path: 'docentes', component: DocentesComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Tabla Docentes', icono: 'bi bi-table',
      principal: 'Docentes', accion: '', enlace: 'docentes'
    }
  },

  {
    path: 'docentes/crear', component: CrearDocenteComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Crear Docente', icono: 'bi bi-file-earmark-text',
      principal: 'Docentes', accion: 'Crear', enlace: 'docentes'
    }
  },

  {
    path: 'docentes/editar/:id', component: EditarDocenteComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Editar Docente', icono: 'bi bi-pencil-fill',
      principal: 'Docentes', accion: 'Editar', enlace: 'docentes'
    }
  },

  {
    path: 'alumnos', component: AlumnosComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Tabla Alumnos', icono: 'bi bi-table',
      principal: 'Alumnos', accion: '', enlace: 'alumnos'
    }
  },
  {
    path: 'alumnos/crear', component: CrearAlumnoComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Crear Alumno', icono: 'bi bi-file-earmark-text',
      principal: 'Alumnos', accion: 'Crear', enlace: 'alumnos'
    }
  },
  {
    path: 'alumnos/editar/:id', component: EditarAlumnoComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Editar Alumno', icono: 'bi bi-pencil-fill',
      principal: 'Alumnos', accion: 'Editar', enlace: 'alumnos'
    }
  },

  {
    path: 'apoderados', component: ApoderadosComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Tabla Apoderados', icono: 'bi bi-table',
      principal: 'Apoderados', accion: '', enlace: 'apoderados'
    }
  },

  {
    path: 'apoderados/crear', component: CrearApoderadoComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Crear Apoderado', icono: 'bi bi-file-earmark-text',
      principal: 'Apoderados', accion: 'Crear', enlace: 'apoderados'
    }
  },
  {
    path: 'apoderados/editar/:id', component: EditarApoderadoComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Editar Apoderado', icono: 'bi bi-pencil-fill',
      principal: 'Apoderados', accion: 'Editar', enlace: 'apoderados'
    }
  },

  {
    path: 'niveles', component: NivelesComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Tabla Niveles', icono: 'bi bi-table',
      principal: 'Niveles', accion: '', enlace: 'niveles'
    }
  },

  {
    path: 'rangos', component: RangosComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Tabla Rangos', icono: 'bi bi-table',
      principal: 'Rangos', accion: '', enlace: 'rangos'
    }
  },

  {
    path: 'grados', component: GradosComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Tabla Grados', icono: 'bi bi-table',
      principal: 'Grados', accion: '', enlace: 'grados'
    }
  },

  {
    path: 'secciones', component: SeccionesComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Tabla Secciones', icono: 'bi bi-table',
      principal: 'Secciones', accion: '', enlace: 'secciones'
    }
  },

  {
    path: 'programaciones', component: ProgramacionesComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Tabla Programaciones', icono: 'bi bi-table',
      principal: 'Programaciones', accion: '', enlace: 'programaciones'
    }
  },
  {
    path: 'programaciones/crear', component: CrearProgramacionComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Crear Programacion', icono: 'bi bi-file-earmark-text',
      principal: 'Programaciones', accion: 'Crear', enlace: 'programaciones'
    }
  },
  {
    path: 'programaciones/editar/:id', component: EditarProgramacionComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Editar Programacion', icono: 'bi bi-card-checklist',
      principal: 'Programaciones', accion: 'Editar', enlace: 'programaciones'
    }
  },
  {
    path: 'programaciones/docente', component: ListaDocenteComponent,
    canActivate: [DocenteGuard],
    data: {
      titulo: 'Tabla Programaciones', icono: 'bi bi-table',
      principal: 'Programaciones', accion: '', enlace: 'programaciones/docente'
    }
  },

  /**------------------------------------------------- */
  {
    path: 'matriculas', component: MatriculasComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Tabla Alumnos matriculados', icono: 'bi bi-table',
      principal: 'Matriculas', accion: '', enlace: 'matriculas'
    }
  },

  {
    path: 'matriculas/crear', component: CrearMatriculaComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Crear Matricula', icono: 'bi bi-card-checklist',
      principal: 'Matriculas', accion: 'Crear', enlace: 'matriculas'
    }
  },

  /** ALUMNO */
  {
    path: 'matriculas/alumno', component: ListaMatriculaAlumnoComponent,
    canActivate: [AlumnoGuard],
    data: {
      titulo: 'Matriculas', icono: 'bi bi-table',
      principal: 'Matriculas', accion: '', enlace: 'matriculas/alumno'
    }
  },

  {
    path: 'matriculas/alumno/:id', component: VerNotaAlumnoComponent,
    canActivate: [AlumnoGuard, IsMatriculaGuard],
    canLoad: [IsMatriculaGuard],
    data: {
      titulo: 'Matriculas', icono: 'bi bi-table',
      principal: 'Matriculas', accion: 'Notas', enlace: 'matriculas/alumno'
    }
  },

  {
    path: 'matriculas/alumno/asistencia/:id', component: VerAsistenciaAlumnoComponent,
    canActivate: [AlumnoGuard, IsMatriculaGuard],
    canLoad: [IsMatriculaGuard],
    data: {
      titulo: 'Matriculas', icono: 'bi bi-table',
      principal: 'Matriculas', accion: 'Asistencias', enlace: 'matriculas/alumno'
    }
  },

  /** APODERADO */
  {
    path: 'matriculas/apoderado', component: ListaMatriculaApoderadoComponent,
    canActivate: [ApoderadoGuard],
    data: {
      titulo: 'Tabla Matriculas', icono: 'bi bi-table',
      principal: 'Matriculas', accion: '', enlace: 'matriculas/apoderado'
    }
  },
  {
    path: 'matriculas/apoderado/notas/:id', component: VerNotaApoderadoComponent,
    canActivate: [ApoderadoGuard, IsMatriculaApoderadoGuard],
    data: {
      titulo: 'Matriculas', icono: 'bi bi-table',
      principal: 'Matriculas', accion: 'Notas', enlace: 'matriculas/apoderado'
    }
  },

  {
    path: 'matriculas/apoderado/asistencia/:id', component: VerAsistenciaApoderadoComponent,
    canActivate: [ApoderadoGuard, IsMatriculaApoderadoGuard],
    canLoad: [],
    data: {
      titulo: 'Matriculas', icono: 'bi bi-table',
      principal: 'Matriculas', accion: 'Asistencias', enlace: 'matriculas/apoderado'
    }
  },

  {
    path: 'notas', component: NotasComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Tabla Notas', icono: 'bi bi-table',
      principal: 'Notas', accion: '', enlace: 'notas'
    }
  },

  /* ADMINISTRADOR*/
  {
    path: 'notas/crear/:id', component: CrearComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Crear Notas', icono: 'bi bi-file-earmark-text',
      principal: 'Notas', accion: 'Crear', enlace: 'notas'
    }
  },
  {
    path: 'notas/editar/:id', component: EditarComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Editar Notas', icono: 'bi bi-pencil-fill',
      principal: 'Notas', accion: 'Editar', enlace: 'notas'
    }
  },
  {
    path: 'notas/eliminar/:id', component: EliminarComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Eliminar Notas', icono: 'bi bi-trash-fill',
      principal: 'Notas', accion: 'Eliminar', enlace: 'notas'
    }
  },

  {
    path: 'notas/docente', component: NotaDocenteComponent,
    canActivate: [DocenteGuard],
    data: {
      titulo: 'Tabla Notas', icono: 'bi bi-table',
      principal: 'Notas', accion: '', enlace: 'notas/docente'
    }
  },

  {
    path: 'notas/docente/crear/:id', component: CrearNotaDocenteComponent,
    canActivate: [DocenteGuard, IsProgramacionGuard],
    canLoad: [IsProgramacionGuard],
    data: {
      titulo: 'Crear Notas', icono: 'bi bi-file-earmark-check-fill',
      principal: 'Notas', accion: 'Crear', enlace: 'notas/docente'
    }
  },

  {
    path: 'notas/docente/editar/:id', component: EditarNotaDocenteComponent,
    canActivate: [DocenteGuard, IsProgramacionGuard],
    canLoad: [IsProgramacionGuard],
    data: {
      titulo: 'Editar Notas', icono: 'bi bi-pencil-fill',
      principal: 'Notas', accion: 'Editar', enlace: 'notas/docente'
    }
  },

  {
    path: 'notas/docente/eliminar/:id', component: EliminarNotaDocenteComponent,
    canActivate: [DocenteGuard, IsProgramacionGuard],
    canLoad: [IsProgramacionGuard],
    data: {
      titulo: 'Eliminar Notas', icono: 'bi bi-trash-fill',
      principal: 'Notas', accion: 'Eliminar', enlace: 'notas/docente'
    }
  },

  {
    path: 'aulas', component: AulasComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Tabla Aulas', icono: 'bi bi-table',
      principal: 'Aulas', accion: '', enlace: 'aulas'
    }
  },
  {
    path: 'aulas/crear', component: CrearAulaComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Crear Aula', icono: 'bi bi-file-earmark-text',
      principal: 'Aulas', accion: 'Crear', enlace: 'aulas'
    }
  },
  {
    path: 'aulas/editar/:id', component: EditarAulaComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Editar Aula', icono: 'bi bi-pencil-fill',
      principal: 'Aulas', accion: 'Editar', enlace: 'aulas'
    }
  },

  /*  ADMINISTRADOR  */
  {
    path: 'asistencias', component: AsistenciasComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Tabla Asistencias', icono: 'bi bi-table',
      principal: 'Asistencias', accion: '', enlace: 'asistencias'
    }
  },
  {
    path: 'asistencias/crear/:id', component: CrearAsistenciaComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Asistencias', icono: 'bi bi-file-earmark-text',
      principal: 'Asistencias', accion: 'Crear', enlace: 'asistencias'
    }
  },
  {
    path: 'asistencias/editar/:id', component: EditarAsistenciaComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Asistencias', icono: 'bi bi-pencil-fill',
      principal: 'Asistencias', accion: 'Editar', enlace: 'asistencias'
    }
  },
  {
    path: 'asistencias/eliminar/:id', component: EliminarAsistenciaComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Asistencias', icono: 'bi bi-trash-fill',
      principal: 'Asistencias', accion: 'Eliminar', enlace: 'asistencias'
    }
  },

  /** ASISTENCIAS DOCENTE */
  {
    path: 'asistencias/docente', component: ListaAsistenciaDocenteComponent,
    canActivate: [DocenteGuard],
    data: {
      titulo: 'Tabla Asistencias', icono: 'bi bi-table',
      principal: 'Asistencias', accion: '', enlace: 'asistencias/docente'
    }
  },
  {
    path: 'asistencias/docente/crear/:id', component: CrearAsistenciaDocenteComponent,
    canActivate: [DocenteGuard, IsProgramacionGuard],
    canLoad: [IsProgramacionGuard],
    data: {
      titulo: 'Crear Asistencias', icono: 'bi bi-file-earmark-check-fill',
      principal: 'Asistencias', accion: 'Crear', enlace: 'asistencias/docente'
    }
  },
  {
    path: 'asistencias/docente/editar/:id', component: EditarAsistenciaDocenteComponent,
    canActivate: [DocenteGuard, IsProgramacionGuard],
    canLoad: [IsProgramacionGuard],
    data: {
      titulo: 'Editar Asistencias', icono: 'bi bi-pencil-fill',
      principal: 'Asistencias', accion: 'Editar', enlace: 'asistencias/docente'
    }
  },
  {
    path: 'asistencias/docente/eliminar/:id', component: EliminarAsistenciaDocenteComponent,
    canActivate: [DocenteGuard, IsProgramacionGuard],
    canLoad: [IsProgramacionGuard],
    data: {
      titulo: 'Eliminar Asistencias', icono: 'bi bi-trash-fill',
      principal: 'Asistencias', accion: 'Eliminar', enlace: 'asistencias/docente'
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
      titulo: 'Tabla Materiales', icono: 'bi bi-table',
      principal: 'Materiales', accion: '', enlace: 'materiales'
    }
  },

  /* MATERIALES DOCENTE */
  {
    path: 'materiales/docente', component: ListaMaterialDocenteComponent,
    canActivate: [DocenteGuard],
    data: {
      titulo: 'Tabla Materiales', icono: 'bi bi-table',
      principal: 'Materiales', accion: '', enlace: 'materiales/docente'
    }
  },
  {
    path: 'materiales/docente/:id', component: MaterialDocenteComponent,
    canActivate: [DocenteGuard, IsProgramacionGuard],
    canLoad: [IsProgramacionGuard],
    data: {
      titulo: 'Lista', icono: 'bi bi-book',
      principal: 'Materiales', accion: 'Lista', enlace: 'materiales/docente'
    }
  },

  /**  MATERIALES ALUMNO */
  {
    path: 'materiales/alumno', component: ListaMaterialAlumnoComponent,
    canActivate: [AlumnoGuard],
    data: {
      titulo: 'Materiales', icono: 'bi bi-table',
      principal: 'Materiales', accion: '', enlace: 'materiales/alumno'
    }
  },
  {
    path: 'materiales/alumno/:id', component: VerMaterialAlumnoComponent,
    canActivate: [AlumnoGuard, IsProgramacionAlumnoGuard],
    canLoad: [IsProgramacionAlumnoGuard],
    data: {
      titulo: 'Lista', icono: 'bi bi-book',
      principal: 'Materiales', accion: 'Lista', enlace: 'materiales/alumno'
    }
  },
  {
    path: 'materiales/:id', component: MaterialComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Materiales', icono: 'bi bi-book',
      principal: 'Materiales', accion: 'Lista', enlace: 'materiales'
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
      titulo: 'Tabla Horarios', icono: 'bi bi-table',
      principal: 'Horarios', accion: '', enlace: 'horarios'
    }
  },

  {
    path: 'horarios/crear', component: CrearHorarioComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Crear Horarios', icono: 'bi bi-file-earmark-text',
      principal: 'Horarios', accion: 'Crear', enlace: 'horarios'
    }
  },

  {
    path: 'horarios/editar/:id', component: EditarHorarioComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Editar Horarios', icono: 'bi bi-pencil-fill',
      principal: 'Horarios', accion: 'Editar', enlace: 'horarios'
    }
  },
  {
    path: 'horarios/eliminar/:id', component: EliminarHorarioComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Eliminar Horarios', icono: 'bi bi-trash-fill',
      principal: 'Horarios', accion: 'Eliminar', enlace: 'horarios'
    }
  },
  {
    path: 'horarios/consultar/:id', component: ConsultaHorarioComponent,
    canActivate: [AdminGuard],
    data: {
      titulo: 'Consultar Horarios', icono: 'bi bi-calendar2',
      principal: 'Horarios', accion: 'Consultar', enlace: 'horarios'
    }
  },
  {
    path: 'horarios/alumno', component: HorarioAlumnoComponent,
    canActivate: [AlumnoGuard],
    data: {
      titulo: 'Consultar Horarios', icono: 'bi bi-calendar2',
      principal: 'Horarios', accion: 'Consultar', enlace: 'horarios'
    }
  },
  {
    path: 'horarios/apoderado', component: HorarioApoderadoComponent,
    canActivate: [ApoderadoGuard],
    data: {
      titulo: 'Consultar Horarios', icono: 'bi bi-calendar2',
      principal: 'Horarios', accion: 'Consultar', enlace: 'horarios'
    }
  },

  {
    path: 'horarios/docente', component: HorarioDocenteComponent,
    canActivate: [DocenteGuard],
    data: {
      titulo: 'Consultar Horarios', icono: 'bi bi-calendar2',
      principal: 'Horarios', accion: 'Consultar', enlace: 'horarios'
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
