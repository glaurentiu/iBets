import { Component, OnInit } from '@angular/core';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { FirebaseTSFirestore } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { FirebaseTSStorage } from 'firebasets/firebasetsStorage/firebaseTSStorage';
import { FirebaseTSApp } from 'firebasets/firebasetsApp/firebaseTSApp';
import { MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css'],
})
export class CreatePostComponent implements OnInit {
  selectedImageFile?: File;
  auth = new FirebaseTSAuth();
  firestore = new FirebaseTSFirestore();
  storage = new FirebaseTSStorage();

  constructor(private dialog: MatDialogRef<CreatePostComponent>) {}

  ngOnInit(): void {}

  onPostClick(commentInput: HTMLTextAreaElement) {
    let comment = commentInput.value;
    if (comment.length <= 0) return;
    if (this.selectedImageFile) {
      this.uploadImagePost(comment);
    } else {
      this.uploadPost(comment);
    }

  }

  uploadImagePost(comment: string) {
    let postId = this.firestore.genDocId();
    this.storage.upload({
      uploadName: 'Upload Image Post and Text',
      path: ['Posts', postId, 'image'],
      data: {
        data: this.selectedImageFile,
      },
      onComplete: (downloadUrl) => {
        this.firestore.create({
          path: ['Posts', postId],
          data: {
            comment,
            creatorId: this.auth.getAuth().currentUser?.uid as string,
            imageUrl: downloadUrl,
            timestamp: FirebaseTSApp.getFirestoreTimestamp(),
          },
          onComplete: (docId) => {
            this.dialog.close();
            window.location.reload()
          },
        });
      },
    });
  }

  uploadPost(comment: string) {
    this.firestore.create({
      path: ['Posts'],
      data: {
        comment,
        creatorId: this.auth.getAuth().currentUser?.uid as string,
        timestamp: FirebaseTSApp.getFirestoreTimestamp(),
      },
      onComplete: (docId) => {
        this.dialog.close();
        window.location.reload()
      },
    });
  }

  onPhotoSelected(photoSelector: HTMLInputElement) {
    if (photoSelector.files != null) {
      this.selectedImageFile = photoSelector.files[0];
      if(!this.selectedImageFile) {return;}
      let fileReader = new FileReader();
      fileReader.readAsDataURL(this.selectedImageFile);
      fileReader.addEventListener('loadend', (ev) => {
        if (fileReader.result != null) {
          let readableString = fileReader.result.toString();
          let postPreviewImage = <HTMLImageElement>(
            document.getElementById('post-preview-image1')
          );
          postPreviewImage.src = readableString;
        }
      });
    }
    return;
  }
}
