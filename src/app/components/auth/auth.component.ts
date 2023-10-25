import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  showVerificationMessage: boolean;
  mailVerificationMessage: any;

  constructor(
    private authService: AuthService
  ) {
    this.authService.verificationMailSent.subscribe((value) => {
      if (value) {
        this.showVerificationMessage = true;
        setTimeout(() => {
          this.showVerificationMessage = false;
        }, 3000)
      }
    })
  }
  
  ngOnInit(): void {
      this.mailVerificationMessage = [{
        severity: 'success',
        detail: 'Please verify your mail'
      }]
  }

}
