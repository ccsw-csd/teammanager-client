import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarComponent } from './calendar/views/calendar/calendar.component';
import { AuthGuard } from './core/services/auth.guard';
import { RefreshTokenResolverService } from './core/services/refresh-token-resolver.service';
import { LayoutComponent } from './core/views/layout/layout.component';
import { ForecastDetailComponent } from './forecast/views/forecast-detail/forecast-detail.component';
import { ForecastListComponent } from './forecast/views/forecast-list/forecast-list.component';
import { GroupListComponent } from './group/views/group-list/group-list.component';
import { HolidayListComponent } from './holiday/views/holiday-list/holiday-list.component';
import { LoginComponent } from './login/views/login/login.component';

/*
, data:{role:['GESTOR', 'ADMIN']}
*/

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    resolve: {credentials: RefreshTokenResolverService},
    children: [
      { path: 'calendar', component: CalendarComponent},
      { path: 'groups', component: GroupListComponent,},
      { path: 'forecast', component: ForecastListComponent,},
      { path: 'forecast-detail', component: ForecastDetailComponent,},
      { path: 'holidays', component: HolidayListComponent,},
      { path: '**', redirectTo: 'calendar', pathMatch: 'full' },
    ]
  },  
  { path: '**', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      enableTracing: false
    }),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
