import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import {
  HttpClientModule,
  HttpClientXsrfModule,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AuthInterceptor } from './auth/AuthInterceptor';
import { NumberToWordTransformPipe } from './custompipes/number-to-word-transform.pipe';
import { PopupComponent } from './popup/popup.component';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';

import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';

import { RoundingPipe } from './custompipes/RoundingPipe';

import { OverlayModule } from '@angular/cdk/overlay';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { LoginComponent } from './components/common/login/login.component';
import { SelectCompanyComponent } from './components/common/select-company/select-company.component';
import { CreateCompanyComponent } from './components/common/create-company/create-company.component';
import { SuperAdminComponent } from './components/auth/super-admin/super-admin.component';
import { HeaderComponent } from './components/home-components/header/header.component';
import { FooterComponent } from './components/home-components/footer/footer.component';
import { SidebarComponent } from './components/home-components/sidebar/sidebar.component';
import { HomeComponent } from './components/home-components/home/home.component';
import { DashboardComponent } from './components/home-components/dashboard/dashboard.component';
import { RegisterComponent } from './components/common/register/register.component';
import { CreditNoteComponent } from './components/home-components/main-components/credit-note/credit-note.component';
import { DebitNoteComponent } from './components/home-components/main-components/debit-note/debit-note.component';
import { LoanComponent } from './components/home-components/main-components/loan/loan.component';
import { OtherProductComponent } from './components/home-components/main-components/other-product/other-product.component';
import { OtherIncomeComponent } from './components/home-components/main-components/other-income/other-income.component';
import { SearchProductComponent } from './components/home-components/main-components/search-product/search-product.component';
import { StockComponent } from './components/home-components/main-components/stock/stock.component';
import { UserCompanyDetailsComponent } from './components/auth/super-admin/user-company-details/user-company-details.component';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { ForgPassEnterEmailComponent } from './components/home-components/main-components/security/forg-pass-enter-email/forg-pass-enter-email.component';
import { ResetPasswordComponent } from './components/home-components/main-components/security/reset-password/reset-password.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SelectCompanyComponent,
    CreateCompanyComponent,
    SuperAdminComponent,
    UserCompanyDetailsComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    HomeComponent,
    DashboardComponent,
    RegisterComponent,
    CreditNoteComponent,
    DebitNoteComponent,
    LoanComponent,
    OtherProductComponent,
    OtherIncomeComponent,
    SearchProductComponent,
    StockComponent,
    CreditNoteComponent,
    PopupComponent,
    ForgPassEnterEmailComponent,
    ResetPasswordComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'XSRF_DEFAULT_COOKIE_NAME',
      headerName: 'XSRF_DEFAULT_HEADER_NAME',
    }),
    HttpClientModule,
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    NgSelectModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-center',
      newestOnTop: false,
    }),

    MatSelectModule,
    DragDropModule,
    OverlayModule,
    MatOptionModule,
    MatInputModule,
    FormsModule,
    NgxSmartModalModule.forRoot(),
    ReactiveFormsModule,
    MatProgressSpinnerModule,
  ],
  exports: [],

  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
