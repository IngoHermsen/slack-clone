import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Channel } from 'src/app/core/models/channel.class';
import { CreateChannelComponent } from '../create-channel/create-channel.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.scss']
})
export class ChannelsComponent implements OnInit {
  channel = new Channel();
  allChannels = [];


  constructor(
    private firestore: AngularFirestore,
    public dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {    
    this.firestore
      .collection('channels')
      .valueChanges({ idField: 'ID' })
      .subscribe((changes: any) => {
        
        this.allChannels = changes;
      })
  }

  openDialog() {
    this.dialog.open(CreateChannelComponent);
  }


}
