import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { ClientComponent } from './client/client.component';
import { AgencyComponent } from './agency/agency.component';
import { RegistrationComponent } from './registration/registration.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { NonregisteredComponent } from './nonregistered/nonregistered.component';
import { HeaderComponent } from './header/header.component';
import { ObjectsComponent } from './objects/objects.component';
import { AgencyDetailsComponent } from './agency-details/agency-details.component';
import { JobsComponent } from './jobs/jobs.component';
import { AgencyJobsComponent } from './agency-jobs/agency-jobs.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AdminComponent,
    ClientComponent,
    AgencyComponent,
    RegistrationComponent,
    AdminLoginComponent,
    NonregisteredComponent,
    HeaderComponent,
    ObjectsComponent,
    AgencyDetailsComponent,
    JobsComponent,
    AgencyJobsComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
