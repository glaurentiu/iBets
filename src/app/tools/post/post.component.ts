import { Component, Input, OnInit } from '@angular/core';
import { PostData } from 'src/app/pages/post-feed/post-feed.component';
import { FirebaseTSFirestore } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { UserDocument } from 'src/app/app.component';
import {MatDialog} from '@angular/material/dialog';
import { ReplyComponent } from '../reply/reply.component';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent implements OnInit {
  @Input() postData?: PostData;
  firestore = new FirebaseTSFirestore();
  creatorName?: string;
  creatorDescription?: string;
  creatorAvatar?: string;

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.getCreatorInfo();
  }

  getCreatorInfo() {
    this.firestore.getDocument({
      path: ['Users', this.postData?.creatorId as string],
      onComplete: (result) => {
        let userDocument = <UserDocument>result.data();
        this.creatorName = userDocument.name;
        this.creatorDescription = userDocument.betting;
        this.creatorAvatar = userDocument.avatar;
      },
    });
  }

  onReplyClick(){
    this.dialog.open(ReplyComponent,{data: this.postData?.postId})

  }
}
