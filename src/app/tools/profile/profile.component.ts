import { Component, Input, OnInit } from '@angular/core';
import { FirebaseTSFirestore } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { FirebaseTSStorage } from 'firebasets/firebasetsStorage/firebaseTSStorage';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  @Input() show: boolean = false;
  selectedImageFile: any;
  firestore: FirebaseTSFirestore;
  auth: FirebaseTSAuth;
  storage = new FirebaseTSStorage();

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
    let avatar = this.selectedImageFile


    let postId = this.firestore.genDocId();
    this.storage.upload({
      uploadName: 'upload Image Post',
      path: ['Users', postId, 'image'],
      data: {
        data: this.selectedImageFile,
      },
      onComplete: (downloadUrl) => {
        this.firestore.create({
          path: ["Users", this.auth.getAuth().currentUser?.uid as string],
          data: {
            name,
            betting,
            avatar : downloadUrl
          },
          onComplete: (docId) => {
            alert('Profile Created');
            nameInput.value = "";
            bettingSports.value ="";

          },
          onFail:(error) => {

          }
        });
      },
    });

  }



  onPhotoSelected(photoSelector: HTMLInputElement) {
    if (photoSelector.files != null) {
      this.selectedImageFile = photoSelector.files[0];
      let fileReader = new FileReader();
      fileReader.readAsDataURL(this.selectedImageFile);
      fileReader.addEventListener('loadend', (ev) => {
        if (fileReader.result != null) {
          let readableString = fileReader.result.toString();
          let postPreviewImage = <HTMLImageElement>(
            document.getElementById('post-preview-image')
          );
          postPreviewImage.src = readableString;
        }
      });
    }
    return;
  }
}
