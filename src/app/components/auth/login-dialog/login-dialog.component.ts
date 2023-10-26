import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent {
  formActive: boolean = true;
  wrongInput: boolean;
  visible: boolean;

  constructor(
    public authService: AuthService
  ) {
    this.visible = true;
    authService.noMatchingData.subscribe((value) => {
      this.wrongInput = value;
    })
  }

  @ViewChild('loginForm') loginForm?: NgForm

  formData = {
    usermail: '',
    password: '',
    rememberPassword: false
  }

  submitForm() {
    this.authService.SignIn(this.formData.usermail, this.formData.password)
    this.loginForm?.reset();
  }

  loginAsGuest() {
    this.authService.SignIn('john.doe@existiert.net', '3kdfw2Iei3nwp')
    this.loginForm?.reset();
  }
}

