import { Injectable, OnInit } from '@angular/core';
import { Thread } from '../models/thread.class';
import { BehaviorSubject, Observable, Subject, concatMap, from, map, mergeMap, switchMap, tap } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { doc, docData, docSnapshots } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ThreadService implements OnInit {
  activeThread = new BehaviorSubject(new Thread);
  newThread: Subject<Thread> = new Subject;
  deletedThreadId: Subject<number> = new Subject;
  userHasThreads: Subject<boolean> = new Subject;

  constructor(
    private firestore: AngularFirestore,

  ) {

  }

  ngOnInit(): void {

  }

  deleteThread(threadObject) {
    this.getFirebaseDoc(threadObject).delete()
  }

  showThreadDetailsFromJSON(JSON) {
    this.getFirebaseDoc(JSON)
      .get()
      .subscribe((data) => {
        let thrdObj: Thread = new Thread(data.data());
        this.activeThread.next(thrdObj)
      })
  }

  getFirebaseDoc(object: any) {
    const channelCollection = this.firestore.collection('channels');
    const channelDoc = channelCollection.doc(object.channelId);
    const threadsCollection = channelDoc.collection('threads');
    const threadDoc = threadsCollection.doc(object.tId);

    return threadDoc;
  }

  hello() {
    console.log("hello");
    
  }
  
}
