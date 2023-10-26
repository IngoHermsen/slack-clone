import { Injectable, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';

@Injectable({
  providedIn: 'root'
})
export class ImagesService implements OnInit {

  imageDetailList: AngularFireList<any>;
  imgUrl;
  user;
  userName;

  constructor(private firebase:AngularFireDatabase) { }

  ngOnInit(): void {
    
  }

  getInfoFromLocalStorage() {
    this.user = JSON.parse(localStorage.getItem('user'))
    this.userName = this.user.firstName
  }

  getImageDetails() {
    this.imageDetailList = this.firebase.list('this.userName/');
  }

  insertImageDetails(imageDetails) {
    this.imageDetailList = this.firebase.list(`${this.userName}` + '/');
    this.imageDetailList.push(imageDetails.imageUrl);
    this.imgUrl = imageDetails.imageUrl
  }

  showImg() {
    return this.imgUrl;
  }
}
