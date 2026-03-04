import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';

// Layout
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { FooterComponent } from './layout/footer/footer.component';
import { HeaderComponent } from './layout/header/header.component';

// Feature pages
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { FindRoomComponent } from './features/find-room/find-room.component';
import { MyBookingsComponent } from './features/my-bookings/my-bookings.component';
import { AiSuggestionsComponent } from './features/ai-suggestions/ai-suggestions.component';
import { ProfileComponent } from './features/profile/profile.component';
import { SettingsComponent } from './features/settings/settings.component';
import { PrivacyPolicyComponent } from './features/privacy-policy/privacy-policy.component';
import { TermsOfUseComponent } from './features/terms-of-use/terms-of-use.component';
import { ContactSupportComponent } from './features/contact-support/contact-support.component';

@NgModule({
  declarations: [
    App,
    SidebarComponent,
    MainLayoutComponent,
    FooterComponent,
    HeaderComponent,
    DashboardComponent,
    FindRoomComponent,
    MyBookingsComponent,
    AiSuggestionsComponent,
    ProfileComponent,
    SettingsComponent,
    PrivacyPolicyComponent,
    TermsOfUseComponent,
    ContactSupportComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    AppRoutingModule,
  ],
  providers: [provideBrowserGlobalErrorListeners()],
  bootstrap: [App],
})
export class AppModule {}
