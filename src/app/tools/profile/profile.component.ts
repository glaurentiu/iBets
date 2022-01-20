import { Component, Input, OnInit } from '@angular/core';
import { FirebaseTSFirestore } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  @Input() show: boolean = false;

  firestore: FirebaseTSFirestore;
  auth: FirebaseTSAuth;

  constructor() {
    this.firestore = new FirebaseTSFirestore();
    this.auth = new FirebaseTSAuth();
  }

  ngOnInit(): void {}

  onContinueClick(
    nameInput: HTMLInputElement,
    bettingSports: HTMLTextAreaElement
  ) {
    let name = nameInput.value;
    let betting = bettingSports.value;

    this.firestore.create({
      path: ["Users", this.auth.getAuth().currentUser?.uid as string],
      data: {
        name,
        betting
      },
      onComplete: (docId) => {
        alert('Profile Created');
        nameInput.value = "";
        bettingSports.value ="";

      },
      onFail: (err) => {

      }
    })

  }
}
