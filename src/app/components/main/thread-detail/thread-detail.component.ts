import { Component, Input, OnInit, Output } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Subscription, map } from 'rxjs';
import { Channel } from 'src/app/core/models/channel.class';
import { Thread } from 'src/app/core/models/thread.class';
import { User } from 'src/app/core/models/user.class';
import { ChannelService } from 'src/app/core/services/channel.service';
import { ThreadService } from 'src/app/core/services/thread.service';

@Component({
  selector: 'app-thread-detail',
  templateUrl: './thread-detail.component.html',
  styleUrls: ['./thread-detail.component.scss'],
})
export class ThreadDetailComponent implements OnInit {
  @Output() avatarImgPath: string;
  @Input() textEditorValue: string
  thrdObj: Thread = new Thread;
  textEditorContext: string = 'reply';
  answers: Array<any> = [];
  answersText: string;

  channelId: string = '';
  channelData: Channel = new Channel;


  // Subscriptions:
  routeSubscription: Subscription;
  channelIdSubscription: Subscription;

  constructor(
    public threadService: ThreadService,
    public channelService: ChannelService,
    private firestore: AngularFirestore,
    private route: ActivatedRoute,
  
  ) {
    this.thrdObj = threadService.activeThread.getValue();
  }

  ngOnInit(): void {
    this.threadService.activeThread.subscribe((threadObject) => {
      this.thrdObj = threadObject;
      this.getAnswers(threadObject)
      this.updateAvatar(threadObject.userId);
    })
    
    this.routeSubscription = this.route.params.subscribe(params => {
      this.channelId = params['id'];
      this.channelService.channelId.next(this.channelId);
      this.getChannelData()
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

  getAnswers(threadObject) {
    this.threadService
      .getFirebaseDoc(threadObject)
      .collection('answers')
      .valueChanges()
      .subscribe((data) => {
        this.answers = data;
        switch (data.length) {
          case 0: this.answersText = 'no answers'; break;
          case 1: this.answersText = `1 answer`; break;
          default: this.answersText = `${data.length} answers`
        }
      })
  }


  updateAvatar(userId: string) {
    this.firestore.collection('users')
      .doc(userId)
      .get()
      .pipe(map((user) => {
        return user.data();
      }))
      .subscribe((userData: User) => {
        this.avatarImgPath = userData.userImgUrl
      })
  }

  createNewThread() {
    let user = JSON.parse(localStorage.getItem('user'));

    let thread = new Thread(
      {
        channelId: this.channelId,
        tId: '',
        userId: user.uid,
        userName: user.displayName,
        message: this.textEditorValue,
        creationTime: new Date(),
        isReply: false
      }
    )

    this.updateThreadsOfChannel(thread.toJSON())

    return thread;
  }

  updateThreadsOfChannel(thread: any) {
    this.channelService.collectionRef.doc(this.channelId)
      .collection('threads').add(thread)
      .then((docRef) => {
        docRef.update({ tId: docRef.id })
        thread.tId = docRef.id;
        this.threadService.newThread.next(thread)
      })
  }

  receiveTextContent(content: string) {
    this.textEditorValue = content;
    this.createNewThread()
  }
}

