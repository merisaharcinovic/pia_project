import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ClientComponent } from './client/client.component';
import { AdminComponent } from './admin/admin.component';
import { RegistrationComponent } from './registration/registration.component';
import { AgencyComponent } from './agency/agency.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { NonregisteredComponent } from './nonregistered/nonregistered.component';
import { AgencyDetailsComponent } from './agency-details/agency-details.component';

const routes: Routes = [
  {path: "", component: NonregisteredComponent},
  {path: "login", component: LoginComponent},
  {path: "client", component: ClientComponent},
  {path: "admin-login", component:AdminLoginComponent},
  {path: "admin", component: AdminComponent},
  {path: "registration", component: RegistrationComponent},
  {path: "agency", component: AgencyComponent},
  { path: 'agency-details/:id', component: AgencyDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
