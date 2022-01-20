import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { CreatePostComponent } from '../../tools/create-post/create-post.component';
import { FirebaseTSFirestore, Limit, OrderBy} from 'firebasets/firebasetsFirestore/firebaseTSFirestore';

@Component({
  selector: 'app-post-feed',
  templateUrl: './post-feed.component.html',
  styleUrls: ['./post-feed.component.css']
})
export class PostFeedComponent implements OnInit {
  firestore = new FirebaseTSFirestore();
  posts : PostData[] = [];
  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getPosts();
  }
  onCreatePostClick(){
    this.dialog.open(CreatePostComponent);
  }

  getPosts(){
    this.firestore.getCollection({
      path:['Posts'],
      where:[
        new OrderBy("timestamp","desc"),
        new Limit(10)
      ],
      onComplete: (result: any) => {
        result.docs.forEach((doc: any) => {
         let post = <PostData>doc.data();
         this.posts.push(post);
        })
      },
      onFail: (err) => {

      }
    })
  }
}

export interface PostData {
  comment: string;
  creatorId: string;
  imageUrl?: string;


}
