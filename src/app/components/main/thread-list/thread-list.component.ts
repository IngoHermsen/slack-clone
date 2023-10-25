import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { from, map, mergeMap } from 'rxjs';
import { Thread } from 'src/app/core/models/thread.class';
import { ChannelService } from 'src/app/core/services/channel.service';
import { SearchFilterService } from 'src/app/core/services/search-filter.service';
import { ThreadService } from 'src/app/core/services/thread.service';

@Component({
  selector: 'app-thread-list',
  templateUrl: './thread-list.component.html',
  styleUrls: ['./thread-list.component.scss']
})
export class ThreadListComponent implements OnInit {
  threads: Array<any> = [];
  threadsCollection: AngularFirestoreCollection;
  fullViewUpdate: boolean = false;
  newThread: Thread = null;
  channelId: string;
  @Input() channelList: boolean;

  constructor(
    private channelService: ChannelService,
    private firestore: AngularFirestore,
    public searchService: SearchFilterService,
    private threadService: ThreadService,

  ) {

  }

  ngOnInit(): void {

    if (this.channelList) {
      this.initChannelList()
    } else {
      this.initFullList()
    }

    this.threadService.newThread.subscribe((threadObject) => {
      if (threadObject != null) {
        this.newThread = threadObject;
      }
    })
  }


  setThreadsCollection(channelId) {

    this.threadsCollection = this.firestore
      .collection('channels')
      .doc(channelId)
      .collection('threads');
  }

  subscribeThreads() {
    this.threadsCollection
      .valueChanges()
      .subscribe((threadsData: any) => {

        this.sortThreadsData(threadsData);

        if (this.fullViewUpdate) { this.threads = threadsData, this.fullViewUpdate = false };
        if (this.newThread !== null) { this.threads.push(this.newThread), this.newThread = null }
      })
  }


  sortThreadsData(data: any) {
    let sortedThreads = data.sort((a, b) => {
      if (a.creationTime < b.creationTime) {
        return -1;
      }
      if (a.creationTime > b.creationTime) {
        return 1;
      }
      return 0;

    });

    return sortedThreads;
  }

  removeIdFromView(i) {
    this.threads.splice(i, 1)
  }

  initChannelList() {
    this.channelService.channelId.subscribe((channelId) => {
      if (channelId != this.channelId) {
        this.setThreadsCollection(channelId);
        this.fullViewUpdate = true;
        this.subscribeThreads();
      }
    }
    )
  }

  initFullList() {
    this.firestore.collection('channels')
      .get()
      .pipe(
        mergeMap(channels => from(channels.docs)),
        mergeMap(channel => channel.ref.collection('threads').get()),
        mergeMap(threads => from(threads.docs)),
        mergeMap(thread => thread.ref.get()),
        map(threadDoc => threadDoc.data())
      )
      .subscribe({
        next: (threadData) => {
          if (threadData['userId'] == JSON.parse(localStorage.getItem('user')).uid) {
            this.threads.push(threadData);
          }
        },
        complete: () => {
          const hasThreads = this.threads.length == 0 ? false : true;
          this.threadService.userHasThreads.next(hasThreads)
        }

      });
  }

}


