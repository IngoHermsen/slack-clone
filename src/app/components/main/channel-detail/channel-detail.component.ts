import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import { Channel } from 'src/app/core/models/channel.class';
import { Thread } from 'src/app/core/models/thread.class';
import { ChannelService } from 'src/app/core/services/channel.service';
import { SearchFilterService } from 'src/app/core/services/search-filter.service';
import { ThreadService } from 'src/app/core/services/thread.service';

@Component({
  selector: 'app-channel-detail',
  templateUrl: './channel-detail.component.html',
  styleUrls: ['./channel-detail.component.scss'],
  providers: [DatePipe]
})
export class ChannelDetailComponent implements OnInit {
  @Input() textEditorValue: string = null;


  channelId: string = '';
  channelData: Channel = new Channel;
  newThread: Thread = null;
  fullViewUpdate: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private firestore: AngularFirestore,
    private channelService: ChannelService,
    public searchService: SearchFilterService,
    public threadService: ThreadService,

  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {  
      this.channelId = params['id'];
      this.getChannel();
      this.channelService.channelId.next(this.channelId);
    })
  }

  getChannel() {
    this.firestore
      .collection('channels')
      .doc(this.channelId)
      .valueChanges()
      .subscribe((channelData: any) => {   
        this.channelData = new Channel(channelData); 
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

  receiveEditorContent(content) {
    this.textEditorValue = content;
    this.createNewThread()
  }

}
