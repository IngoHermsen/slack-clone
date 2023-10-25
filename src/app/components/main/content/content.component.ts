import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Thread } from 'src/app/core/models/thread.class';
import { ThreadService } from 'src/app/core/services/thread.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {
  @Output() showSideNav: EventEmitter<true> = new EventEmitter
  showDetails: boolean = false;
  thrdObj: Thread = new Thread;

  constructor(
    private threadService: ThreadService
  ) {
    let threadJSON = JSON.parse(localStorage.getItem('activeThread'));
    if(threadJSON != null) {
      this.threadService.showThreadDetailsFromJSON(threadJSON);
    }
  }

  ngOnInit(): void {
    this.showDetails = false;
    this.threadService.activeThread.subscribe((value) => {
      if (value.tId != "") {
        this.showDetails = true;
        this.thrdObj = value;
      }
    })
  }


  openDetails() {
    this.showDetails = true;
  }

  closeDetails() {
    localStorage.removeItem('activeThread');
    this.showDetails = false;
  }
}
