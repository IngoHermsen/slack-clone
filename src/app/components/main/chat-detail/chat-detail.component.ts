import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Timestamp } from '@angular/fire/firestore';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ChatMessage } from 'src/app/core/models/chat-message.class';
import { Chat } from 'src/app/core/models/chats.class';

@Component({
  selector: 'app-chat-detail',
  templateUrl: './chat-detail.component.html',
  styleUrls: ['./chat-detail.component.scss'],
  providers: [DatePipe],
})
export class ChatDetailComponent implements OnInit {
  chatId: string = '';
  chatData: Chat = new Chat;
  userNames = [];
  messageData = [];

  // Quill editor
  editorContent: string;
  editorForm: FormGroup;
  editorStyle = {
    height: '200px',
    color: 'white'
  }

  config = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      ['code-block'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['emoji'],
      ['link']
    ]
  }

  // END 

  constructor(
    private route: ActivatedRoute,
    private firestore: AngularFirestore,
    private datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.editorForm = new FormGroup({
      'editor': new FormControl(null)
    });
    this.route.params.subscribe(params => {
      this.chatId = params['id'];
      this.getChat();
      this.getChatMessages();

    })
  }


  getChat() {
    this.firestore
      .collection('chats')
      .doc(this.chatId)
      .valueChanges()
      .subscribe((chatData: any) => {
        this.chatData = new Chat(chatData)
        this.getUserNames();
      })
  }


  getChatMessages() {
    this.firestore
      .collection('chats')
      .doc(this.chatId)
      .collection('messages')
      .valueChanges()
      .subscribe((messageData: any) => {
        this.messageData = messageData;
        this.sortMessageData(this.messageData)
        this.prepareChatMessages();
      })
  }


  sortMessageData(data: any) {
    let sortedMessages = data.sort((a, b) => {
      if (a.date < b.date) {
        return -1;
      }
      if (a.date > b.date) {
        return 1;
      }
      return 0;
    });
    return sortedMessages;
  }


  prepareChatMessages() {
    this.messageData.forEach(element => {
      let message = element.message.slice(3, -4)
      element.message = message;
    });
  }


  transformTimestamp(timestamp: Date | Timestamp) {
    const asDate = timestamp instanceof Timestamp ? timestamp.toDate() : timestamp;
    const formattedDate = this.datePipe.transform(asDate, 'yyyy-MM-dd | HH:mm') + ' Uhr';
    return formattedDate;
  }


  getUserNames() {
    this.userNames = [];
    this.userNames.push(this.chatData.chatName)
  }


  onSubmit() {
    if (this.editorForm.get('editor').value != null) {
      let user = JSON.parse(localStorage.getItem('user'));
      let reply = new ChatMessage({
        userName: user.displayName,
        userId: user.uid,
        message: this.editorForm.get('editor').value,
        date: new Date,
        userImgUrl: user.userImgUrl
      })
      this.editorForm.reset();
      this.updateChatMessages(reply.toJson())
    }
  }


  updateChatMessages(reply: any) {
    this.firestore
      .collection('chats')
      .doc(this.chatId)
      .collection('messages')
      .add(reply)
  }

  
  maxLength(event) {
    if (event.editor.getLength() > 1000) {
      event.editor.deleteText(1000, event.editor.getLength())
    }
  }


}
