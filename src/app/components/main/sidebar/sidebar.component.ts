import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

  
  public channels:boolean = false;
  public messages:boolean = false;


  toggleChannels() {
    if (this.channels == true) {
      this.channels = false;
    } else {
      this.channels = true;
    }
  }


  toggleMessages() {
    if (this.messages == true) {
      this.messages = false;
    } else {
      this.messages = true;
    }
  }


}
