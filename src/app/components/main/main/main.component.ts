import { Component, Input, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  constructor(
    private router: Router
  ) {
    router.events.pipe(filter(event => event instanceof NavigationEnd))
    .subscribe(() => {
      if(window.innerWidth <= 700) {
        this.opened = false;      
    }})
  }
 
  public createChannelDialog: boolean;
  public sidebar: boolean = false;

  @Input() opened: boolean = true;

  ngOnInit(): void {

  }

  receiverSidebar(sidebar:boolean){
    this.sidebar = sidebar;
  }

  receiverChannelDialog(createChannelDialog:boolean){
    this.createChannelDialog = createChannelDialog;
  }

  receiverChannelDialogClose(createChannelDialog:boolean){
    this.createChannelDialog = createChannelDialog;
  }

  OnSidenavToggled(event) {
    this.opened = event
  }

}
