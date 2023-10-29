import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Thread } from 'src/app/core/models/thread.class';
import { Timestamp } from '@angular/fire/firestore';
import { ThreadService } from 'src/app/core/services/thread.service';
import { AngularFirestore, DocumentData } from '@angular/fire/compat/firestore';
import { User } from 'src/app/core/models/user.class';
import { from, map, mergeMap } from 'rxjs';
import { SearchFilterService } from 'src/app/core/services/search-filter.service';


@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.scss'],
  providers: [DatePipe],
})
export class ThreadComponent implements OnInit {
  @Input() thrdObj: Thread;
  @Input() viewId: number;
  @Input() avatarImgPath: string;
  @Input() showAnswersAmount: boolean;
  @Input() showThis: boolean = true;
  @Output() removeIdFromView: EventEmitter<number> = new EventEmitter;


  onFocus: boolean;
  userIsCreator: boolean = false;
  showIndicator: boolean = false;
  indicatorValue: string;
  answersAmount: number = 0;
  answersText: string;
  confirmDelete: boolean = false;


  dayAsString: string;
  timeAsString: string;

  constructor(
    public threadService: ThreadService,
    private datePipe: DatePipe,
    private firestore: AngularFirestore,
    public searchService: SearchFilterService,
  ) {

  }

  ngOnInit(): void {
    if (!this.thrdObj.isReply) {
      this.getAnswersAmount()
    }

    this.setVisibility();
    this.getUserData();
    this.transformTimestamp(this.thrdObj.creationTime)
  }

  setVisibility() {
    this.searchService.searchValue.subscribe((inputValue) => {
      const adjustedValue = inputValue.toLocaleLowerCase().trim()

      if (adjustedValue.length == 0) {
        this.showThis = true;
        this.showIndicator = false;
      } else {
        this.checkSearchInput(adjustedValue)
      }
    })

  }

  checkSearchInput(searchValue) {
    const message: string = this.thrdObj.message;
    const userName: string = this.thrdObj.userName;

    if (
      message.toLowerCase().includes(searchValue) ||
      userName.toLowerCase().includes(searchValue)
    ) {
      this.showThis = true;
    } else {
      this.checkAnswers(searchValue)
    }
  }

  checkAnswers(searchValue) {
    if (this.answersAmount == 0) {
      this.showThis = false;
      this.showIndicator = false
    } else {
      this.getAnswersData(searchValue)

    
    }
  }

  getAnswersData(searchValue) {
    this.threadService.getFirebaseDoc(this.thrdObj)
    .collection('answers')
    .get()
    .pipe(
      mergeMap(answers => from(answers.docs)),
      mergeMap(answer => answer.ref.get()),
      map(answer => answer.data())
    )
    .subscribe((answer) => {
      this.compareWithSearchInput(answer, searchValue)
    })
  }

  compareWithSearchInput(answer: DocumentData, searchValue: string) {
      if (
        answer['message'].toLowerCase().includes(searchValue) ||
        answer['userName'].toLowerCase().includes(searchValue)
      ) {
        this.showIndicator = true;
        this.showThis = true;
        this.indicatorValue = searchValue;

      } else {
        this.showIndicator = false;
        this.showThis = false;
      }
  }

  getUserData() {
    this.firestore.collection('users')
      .doc(this.thrdObj.userId)
      .get()
      .pipe(map((userSnapshot) => {
        return userSnapshot.data();
      }))
      .subscribe((userData) => {
        let user = new User(userData)
        this.avatarImgPath = user.userImgUrl;

        if (this.thrdObj.userId == JSON.parse(localStorage.getItem('user')).uid) {
          this.userIsCreator = true;
        }
      })
  }

  transformTimestamp(timestamp: Date | Timestamp) {
    const asDate = timestamp instanceof Timestamp ? timestamp.toDate() : timestamp;
    this.dayAsString = this.datePipe.transform(asDate, 'yyyy-MM-dd');
    this.timeAsString = this.datePipe.transform(asDate, 'HH:mm') + ' Uhr';
  }

  showDetails(threadObject) {
    localStorage.setItem('activeThread', JSON.stringify(threadObject));
    this.threadService.activeThread.next(threadObject);
    
  }

  deleteThis() {
    this.removeIdFromView.emit(this.viewId);
    this.threadService.deleteThread(this.thrdObj)

  }

  getAnswersAmount() {
    this.threadService.getFirebaseDoc(this.thrdObj)
      .collection('answers')
      .get()
      .subscribe((answers) => {
        this.answersAmount = answers.size;
        switch (answers.size) {
          case 0: this.answersText = 'no answers'; break;
          case 1: this.answersText = `1 answer`; break;
          default: this.answersText = `${answers.size} answers`
        }
      })
  }

  public lookout() {
    return true
  }

}

