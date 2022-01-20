import { Component } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { AuthenticatorComponent } from './tools/authenticator/authenticator.component';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  auth = new FirebaseTSAuth();

  constructor(private loginSheet: MatBottomSheet, private router: Router) {
    this.auth.listenToSignInStateChanges((user) => {
      this.auth.checkSignInState({
        whenSignedIn: (user) => {
          console.log(`hi ${user.email}`);
        },
        whenSignedOut: (user) => {},
        whenSignedInAndEmailNotVerified: (user) => {
          console.log(`user ${user.email} has the email not verified`);
          this.router.navigate(['email-verification']);
        },
        whenSignedInAndEmailVerified: (user) => {
          console.log('Email verified successfully')
        },
        whenChanged: (user) => {},
      });
    });
  }

  loggedIn() {
    return this.auth.isSignedIn();
  }

  onLoginClick() {
    this.loginSheet.open(AuthenticatorComponent);
  }

  onLogoutClick() {
    this.auth.signOut();
  }
}
