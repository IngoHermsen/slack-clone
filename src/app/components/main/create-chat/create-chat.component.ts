import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, mergeMap, switchMap } from 'rxjs';
import { Chat } from 'src/app/core/models/chats.class';

@Component({
  selector: 'app-create-chat',
  templateUrl: './create-chat.component.html',
  styleUrls: ['./create-chat.component.scss']
})
export class CreateChatComponent implements OnInit {
  allUsers = [];
  allDisplayNames = [];
  selectedUsers = []
  chat = new Chat;
  allChats = [];
  enteredSearchValue: string = '';
  activeUserId: string;

  constructor(private firestore: AngularFirestore) {
    this.activeUserId = JSON.parse(localStorage.getItem('user')).uid;

  }

  ngOnInit(): void {
    this.firestore
      .collection('users')
      .get()
      .pipe(mergeMap(user => {        
        return user.docs
      })
      ).pipe(map(userDoc => {
        const userData = userDoc.data();
        if(userData['uid'] != this.activeUserId) {
          this.allUsers.push(userData)
        }
      }))
      .subscribe();
  }

  generateSearchArray() {
    this.allUsers.forEach(element => {
      if (!this.allDisplayNames.includes(element.displayName)) {
        this.allDisplayNames.push(element.displayName)
      }
    });
  }


  selectUser(i: any) {
    if (!this.selectedUsers.includes(this.allUsers[i])) {
      this.selectedUsers.push(this.allUsers[i])
    }
  }


  removeUserFromSelection(uId: any) {
    this.selectedUsers.forEach(element => {
      if (uId == element.uid) {
        this.selectedUsers.splice(this.selectedUsers.indexOf(element), 1)
      }
    });
  }


  createChat() {
    if (this.selectedUsers.length > 0) {
      this.selectedUsers.forEach(element => {
        this.chat.userImgUrl.push(element.userImgUrl)
        this.chat.userId.push(element.uid)
      });
      // this.chat.userInfo = this.selectedUsers;
      this.createChatName();
      this.addChatToFirestore();
      this.selectedUsers = [];
    }

  }

  addChatToFirestore() {
    this.firestore
      .collection('chats')
      .add(this.chat.toJson())
  }

  createChatName() {
    this.chat.chatName = this.selectedUsers[0].displayName
  }


}
