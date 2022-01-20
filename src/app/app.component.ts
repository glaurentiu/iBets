import { Component } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { AuthenticatorComponent } from './tools/authenticator/authenticator.component';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { Router } from '@angular/router';
import { FirebaseTSFirestore } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  auth = new FirebaseTSAuth();
  firestore = new FirebaseTSFirestore();
  userHasProfile = true;
  private static userDocument?: UserDocument;

  constructor(private loginSheet: MatBottomSheet, private router: Router) {
    this.auth.listenToSignInStateChanges((user) => {
      this.auth.checkSignInState({
        whenSignedIn: (user) => {},
        whenSignedOut: (user) => {
          AppComponent.userDocument = undefined;
        },
        whenSignedInAndEmailNotVerified: (user) => {
          this.router.navigate(['email']);
        },
        whenSignedInAndEmailVerified: (user) => {
          this.getUserProfile();
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

  public static getUserDocument() {
    return AppComponent.userDocument;
  }

  getUsername() {
    try {
      return AppComponent.userDocument?.name;
    } catch (error) {
      return error;
    }
  }

  getUserProfile() {
    this.firestore.listenToDocument({
      name: 'Getting ocument',
      path: ['Users', this.auth.getAuth().currentUser?.uid as string],
      onUpdate: (result) => {
        AppComponent.userDocument = <UserDocument>result.data();
        this.userHasProfile = result.exists;
        AppComponent.userDocument.userId = this.auth.getAuth().currentUser
          ?.uid as string;
        if (this.userHasProfile) {
          this.router.navigate(['postfeed']);
        }
      },
    });
  }
}

export interface UserDocument {
  name: string;
  betting: string;
  userId: string;
}
