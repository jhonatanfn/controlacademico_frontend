import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { PagesComponent } from './pages.component';
import { AuthGuard } from '../guards/auth.guard';
import { InstitucionGuard } from '../guards/institucion.guard';


const routes: Routes = [

  {
    path: 'dashboard',
    component: PagesComponent,
    canActivate: [AuthGuard,InstitucionGuard],
    canLoad:[AuthGuard,InstitucionGuard],
    loadChildren: ()=>import('./children-routes.module').then(m=>m.ChildrenRoutesModule)
  }

];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes),
    CommonModule
  ],
  exports: [
    RouterModule
  ]
})
export class PagesRoutingModule { }
