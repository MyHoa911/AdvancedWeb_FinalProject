import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';

// Layout
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { FooterComponent } from './layout/footer/footer.component';

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

// Shared components
import { RoomCardComponent } from './shared/components/room-card/room-card.component';

@NgModule({
  declarations: [
    App,
    SidebarComponent,
    MainLayoutComponent,
    FooterComponent,
    DashboardComponent,
    FindRoomComponent,
    MyBookingsComponent,
    AiSuggestionsComponent,
    ProfileComponent,
    SettingsComponent,
    PrivacyPolicyComponent,
    TermsOfUseComponent,
    ContactSupportComponent,
    RoomCardComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    AppRoutingModule,
  ],
  providers: [provideBrowserGlobalErrorListeners()],
  bootstrap: [App],
})
export class AppModule {}
