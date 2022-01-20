import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {
  selectedImageFile: any;

  constructor() { }

  ngOnInit(): void {
  }

  onPhotoSelected(photoSelector: HTMLInputElement){
    if(photoSelector.files != null) {
      this.selectedImageFile = photoSelector.files[0];
      let fileReader = new FileReader();
      fileReader.readAsDataURL(this.selectedImageFile);
      fileReader.addEventListener(
        "loadend",
        ev => {
          if(fileReader.result != null) {
            let readableString = fileReader.result.toString();
            let postPreviewImage = <HTMLImageElement>document.getElementById('post-preview-image')
            postPreviewImage.src = readableString;

          }
        }
      )

    } return;
  }
}
