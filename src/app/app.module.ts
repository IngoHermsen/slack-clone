//Angular Fire
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideStorage, getStorage } from '@angular/fire/storage'

//UI Library
import { MenuModule } from 'primeng/menu';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SidebarModule } from 'primeng/sidebar';
import { MultiSelectModule } from 'primeng/multiselect';
import { CalendarModule } from 'primeng/calendar';
import { SelectButtonModule } from 'primeng/selectbutton';
import { MessagesModule } from 'primeng/messages';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { AvatarModule } from 'primeng/avatar';
import { DragDropModule } from 'primeng/dragdrop';
import { SplitButtonModule } from 'primeng/splitbutton';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';


//General
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';

import { LoginDialogComponent } from './components/auth/login-dialog/login-dialog.component';
import { SignUpDialogComponent } from './components/auth/sign-up-dialog/sign-up-dialog.component';
import { ForgotPasswordDialogComponent } from './components/auth/forgot-password-dialog/forgot-password-dialog.component';
import { AuthComponent } from './components/auth/auth.component';
import { FormsModule } from '@angular/forms';
import { AuthService } from './core/services/auth.service';
import { MainComponent } from './components/main/main/main.component';
import { SidebarComponent } from './components/main/sidebar/sidebar.component';
import { HeaderComponent } from './components/main/header/header.component';
import { ContentComponent } from './components/main/content/content.component';
import { ChannelsComponent } from './components/main/channels/channels.component';
import { DirectMessagesComponent } from './components/main/direct-messages/direct-messages.component';
import { CreateChannelComponent } from './components/main/create-channel/create-channel.component';
import { ChannelDetailComponent } from './components/main/channel-detail/channel-detail.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ThreadDetailComponent } from './components/main/thread-detail/thread-detail.component';

import { QuillModule } from 'ngx-quill';
import { TextEditorComponent } from './components/main/text-editor/text-editor.component';
import { ReactiveFormsModule } from '@angular/forms';
import { EditUserComponent } from './components/main/edit-user/edit-user.component';
import { ThreadComponent } from './components/main/thread/thread.component';
import { LegalComponent } from './components/main/legal/legal.component';
import { CreateChatComponent } from './components/main/create-chat/create-chat.component';
import { ChatDetailComponent } from './components/main/chat-detail/chat-detail.component';
import { ThreadListComponent } from './components/main/thread-list/thread-list.component';
import { ThreadOverviewComponent } from './components/main/thread-overview/thread-overview.component';
import { ClickOutsideDirective } from './core/directives/click-outside.directive';
import { PrivacyPolicyComponent } from './components/main/privacy-policy/privacy-policy.component';
import { LegalNoticeComponent } from './components/main/legal-notice/legal-notice.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginDialogComponent,
    SignUpDialogComponent,
    ForgotPasswordDialogComponent,
    AuthComponent,
    MainComponent,
    SidebarComponent,
    HeaderComponent,
    ContentComponent,
    ChannelsComponent,
    DirectMessagesComponent,
    CreateChannelComponent,
    ChannelDetailComponent,
    TextEditorComponent,
    EditUserComponent,
    ThreadComponent,
    ThreadDetailComponent,
    LegalComponent,
    CreateChatComponent,
    ChatDetailComponent,
    ThreadListComponent,
    ThreadOverviewComponent,
    ClickOutsideDirective,
    PrivacyPolicyComponent,
    LegalNoticeComponent,

    
  ],
  imports: [
    QuillModule.forRoot(),
    ReactiveFormsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    MatProgressBarModule,
    MatCardModule,
    MatMenuModule,
    MatDialogModule,
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    MenuModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    CheckboxModule,
    RadioButtonModule,
    SidebarModule,
    MultiSelectModule,
    CalendarModule,
    SelectButtonModule,
    MessagesModule,
    CardModule,
    DropdownModule,
    AvatarModule,
    DragDropModule,
    OverlayPanelModule,
    SplitButtonModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideDatabase(() => getDatabase()),
    provideStorage(() => getStorage()),
    BrowserAnimationsModule,
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
