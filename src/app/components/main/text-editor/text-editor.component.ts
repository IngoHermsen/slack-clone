import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { arrayUnion } from '@angular/fire/firestore';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { Channel } from 'src/app/core/models/channel.class';
import { Thread } from 'src/app/core/models/thread.class';

import { ChannelService } from 'src/app/core/services/channel.service';

@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.scss']
})
export class TextEditorComponent implements OnInit {
  userDataSubscription: any;

  constructor(
    private route: ActivatedRoute,
    private firestore: AngularFirestore,
    public channelService: ChannelService,
  ) {
  }


  ngOnInit(): void {
    this.editorForm = new FormGroup({
      'editor': new FormControl(null)
    });
    this.getChannelId();
    this.getChannelData();

  }

  channelId: string = '';
  channelData: Channel = new Channel;

  editorContent: string;
  editorForm: FormGroup;
  editorStyle = {
    height: '200px',
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

  getChannelId() {
    this.route.params.subscribe(params => {
      this.channelId = params['id'];
      this.channelService.channelId.next(this.channelId);
    })
  }


  getChannelData() {
    this.firestore
      .collection('channels')
      .doc(this.channelId)
      .valueChanges()
      .subscribe((data: any) => {
        this.channelData = new Channel(data);
      })
  }

  maxLength(event) {
    if (event.editor.getLength() > 100) {
      event.editor.deleteText(10, event.editor.getLength())
    }
  }

  onSubmit() {
    this.createNewThread();
    this.editorForm.reset();

  }

  createNewThread() {
    let user = JSON.parse(localStorage.getItem('user'));
   
    let thread = new Thread(
      {
        tId: '',
        userId: user.uid,
        userName: user.displayName,
        message: this.editorForm.get('editor').value,
        creationTime: new Date(),
        answers: [],
      }
    )
  
    this.updateMessagesOfChannel(thread.toJSON())

    return thread;
  }

  updateMessagesOfChannel(message: any) {
    this.channelService.collectionRef.doc(this.channelId)
      .collection('messages').add(message)
      .then((docRef) => {
        docRef.update({ mId: docRef.id })
      })
  }
}
