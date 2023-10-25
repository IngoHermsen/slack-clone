import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Channel } from 'src/app/core/models/channel.class';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-channel',
  templateUrl: './create-channel.component.html',
  styleUrls: ['./create-channel.component.scss']
})
export class CreateChannelComponent {

  channel = new Channel();
  allChannels = [];

  constructor(private firestore: AngularFirestore, public dialogRef: MatDialogRef<CreateChannelComponent>){}

  ngOnInit(): void {
    
  }

  createChannel() {
    this.newChannel()
  }

  newChannel() {
    this.firestore
      .collection('channels')
      .add(this.channel.toJson())
      .then((result: any) => {
      })
    this.channel = new Channel
  }

}
