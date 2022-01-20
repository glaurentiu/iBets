import { Component, OnInit } from '@angular/core';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import {MatBottomSheetRef} from '@angular/material/bottom-sheet'
@Component({
  selector: 'app-authenticator',
  templateUrl: './authenticator.component.html',
  styleUrls: ['./authenticator.component.css'],
})
export class AuthenticatorComponent implements OnInit {
  state = AuthenticatorCompState.LOGIN;
  firebasetsAuth: FirebaseTSAuth;
  constructor(private bottomSheetRef: MatBottomSheetRef) {
    this.firebasetsAuth = new FirebaseTSAuth();
  }

  ngOnInit(): void {}

  onResetClick(resetEmail: HTMLInputElement){
    let email = resetEmail.value;
    if(this.isNotEmpty(email)){
      this.firebasetsAuth.sendPasswordResetEmail({
        email,
        onComplete: (err)=>{
          this.bottomSheetRef.dismiss();
        }
      });
    }

  }

  onLoginClick(
    loginEmail:HTMLInputElement,
    loginPassword:HTMLInputElement,
  ){
    let email = loginEmail.value;
    let password = loginPassword.value;

    if(this.isNotEmpty(email) && this.isNotEmpty(password)) {
      this.firebasetsAuth.signInWith({
        email,
        password,
        onComplete: (uc) =>{
          this.bottomSheetRef.dismiss();
        },
        onFail: (err)=>{
          alert(err);
        }
      })
    }
  }

  onRegisterClick(
    registerEmail: HTMLInputElement,
    registerPassword: HTMLInputElement,
    registerConfirmPassword: HTMLInputElement
  ) {
    let email = registerEmail.value;
    let password = registerPassword.value;
    let confirmPassword = registerConfirmPassword.value;

    if(
      this.isNotEmpty(email) &&
      this.isNotEmpty(password) &&
      this.isNotEmpty(confirmPassword) &&
      this.isAMatch(password,confirmPassword)
    ){

      this.firebasetsAuth.createAccountWith({
        email,
        password,
        onComplete: (uc) => {
          this.bottomSheetRef.dismiss();
          registerEmail.value="";
          registerPassword.value="";
          registerConfirmPassword.value="";
        },
        onFail: (err) => {
          alert('Failed to create the account.');
        },
      });
    }
  }

  isNotEmpty(text: string){
    return text != null && text.length > 0;
  }

  isAMatch(text: string, compared:string){
    return text == compared;
  }

  onForgot() {
    this.state = AuthenticatorCompState.FORGOT_PASSWORD;
  }

  onCreate() {
    this.state = AuthenticatorCompState.REGISTER;
  }

  onLogin() {
    this.state = AuthenticatorCompState.LOGIN;
  }

  isLoginState() {
    return this.state == AuthenticatorCompState.LOGIN;
  }

  isRegisterState() {
    return this.state == AuthenticatorCompState.REGISTER;
  }

  isForgotPasswordState() {
    return this.state == AuthenticatorCompState.FORGOT_PASSWORD;
  }

  getStateText() {
    switch (this.state) {
      case AuthenticatorCompState.LOGIN:
        return 'Login';
      case AuthenticatorCompState.FORGOT_PASSWORD:
        return 'Forgot Password ?';
      case AuthenticatorCompState.REGISTER:
        return 'Register';
    }
  }
}

export enum AuthenticatorCompState {
  LOGIN,
  REGISTER,
  FORGOT_PASSWORD,
}
