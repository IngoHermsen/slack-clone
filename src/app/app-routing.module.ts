import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './components/auth/auth.component';
import { LoginDialogComponent } from './components/auth/login-dialog/login-dialog.component';
import { ForgotPasswordDialogComponent } from './components/auth/forgot-password-dialog/forgot-password-dialog.component';
import { SignUpDialogComponent } from './components/auth/sign-up-dialog/sign-up-dialog.component';
import { MainComponent } from './components/main/main/main.component';
import { ChannelDetailComponent } from './components/main/channel-detail/channel-detail.component';
import { LegalComponent } from './components/main/legal/legal.component';
import { CreateChannelComponent } from './components/main/create-channel/create-channel.component';
import { CreateChatComponent } from './components/main/create-chat/create-chat.component';
import { ChatDetailComponent } from './components/main/chat-detail/chat-detail.component';
import { ThreadOverviewComponent } from './components/main/thread-overview/thread-overview.component';
import { PrivacyPolicyComponent } from './components/main/privacy-policy/privacy-policy.component';
import { LegalNoticeComponent } from './components/main/legal-notice/legal-notice.component';

const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  {
    path: '', component: AuthComponent, children: [
      { path: 'auth/login', component: LoginDialogComponent },
      { path: 'auth/forgotPassword', component: ForgotPasswordDialogComponent },
      { path: 'auth/signup', component: SignUpDialogComponent }
    ]
  },
  { path: 'main', component: MainComponent },
  { path: 'legal', component: LegalComponent },

  {
    path: '', component: MainComponent, children: [
      { path: 'channel/:id', component: ChannelDetailComponent },
      { path: 'createChat', component: CreateChatComponent },
      { path: 'users', component: CreateChatComponent },
      { path: 'chat/:id', component: ChatDetailComponent },
      { path: 'threads', component: ThreadOverviewComponent },
      { path: 'privacy-policy', component: PrivacyPolicyComponent },
      { path: 'legal-notice', component: LegalNoticeComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
