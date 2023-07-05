import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { getStorage, Storage, ref, getDownloadURL, uploadBytesResumable } from '@angular/fire/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { ImagesService } from 'src/app/core/services/images.service';
import * as firebase from 'firebase/app';
import 'firebase/storage';
import { updateCurrentUser } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { QuerySnapshot } from '@angular/fire/firestore';


@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  userIsGuest: boolean;

  user;
  uID;

  imgStorage;
  imgRef;

  imgUrl: string // = 'https://firebasestorage.googleapis.com/v0/b/slack-clone-8b87c.appspot.com/o/Mbg1TQ3ATyYpzd71lHxckYKimEI2%2F1?alt=media&token=481f4d37-2f8a-4a6a-a940-adcb751aab41'

  imgSrc: string //= './assets/gender.png'
  selectedImage: any = null;
  isSubmitted: boolean = false;

  formTemplate = new FormGroup({
    firstname: new FormControl(''),
    lastname: new FormControl(''),
    imageUrl: new FormControl(''),
  })

  constructor(private storage: AngularFireStorage, private service: ImagesService, private firestore: AngularFirestore) { }

  async ngOnInit() {
    this.getInfoFromLocalStorage();
    this.userIsGuest = this.uID == 'cvbncetIG8Tdbm01uT18jBoIYSI2' ? true : false;

    //this.getUserFotoFromFireStorage();
  }

  onFileSelected(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader;
      reader.onload = (e: any) => this.imgSrc = e.target.result;
      reader.readAsDataURL(event.target.files[0])
      this.selectedImage = event.target.files[0]
      console.log(this.selectedImage)
    } else {
      this.imgSrc = './assets/gender.png';
      this.selectedImage = null;
    }
  }

  submit(formValue: any) {
    this.isSubmitted = true;
    if (this.formTemplate.valid) {
      if (formValue.imageUrl != '') {
        const filePath = `${this.uID}/${this.selectedImage.name.split('.').slice(0, -1).join('.')}`;
        const fileRef = this.storage.ref(filePath);
        this.storage.upload(filePath, this.selectedImage).snapshotChanges().pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe((url) => {
              formValue['imageUrl'] = url;
              this.updateLocalStorage(formValue)
              this.updateFirebase(formValue)
              //this.service.insertImageDetails(formValue);
              this.updateThreadsUserName(formValue)
            })
          })).subscribe();
      } else {
        this.updateLocalStorage(formValue)
        this.updateWithoutImg(formValue)
        this.updateThreadsUserName(formValue)
      }
    }

  }

  updateLocalStorage(formValue) {
    let currentUserInfo = JSON.parse(localStorage.getItem('user'))
    currentUserInfo.firstName = formValue.firstname;
    currentUserInfo.lastName = formValue.lastname;
    currentUserInfo.displayName = formValue.firstname + ' ' + formValue.lastname
    if (formValue.imageUrl != '') {
      currentUserInfo.userImgUrl = formValue.imageUrl
    }
    localStorage.setItem('user', JSON.stringify(currentUserInfo));
  }


  updateFirebase(formValue) {
    this.firestore
      .collection('users')
      .doc(this.uID)
      .update({ userImgUrl: formValue.imageUrl, firstName: formValue.firstname, lastName: formValue.lastname, displayName: formValue.firstname + ' ' + formValue.lastname })
  }

  updateWithoutImg(formValue) {
    this.firestore
      .collection('users')
      .doc(this.uID)
      .update({ firstName: formValue.firstname, lastName: formValue.lastname, displayName: formValue.firstname + ' ' + formValue.lastname })

  }


  updateThreadsUserName(formValue) {
    let channelIds = []
    this.firestore
      .collection('channels')
      .valueChanges({ idField: 'ID' })
      .subscribe((changes) => {
        channelIds.push(changes)
        console.log(channelIds)
       // this.update(channelIds)
      })
      
    
    /*  let channelIds = []
      this.firestore
        .collection('channels')
        .valueChanges({ idField: 'ID' })
        .subscribe((changes) => {
          channelIds.push(changes)
          console.log(channelIds)
          channelIds[0].forEach(element => {
            console.log(element)
            this.firestore
              .collection('channels')
              .doc(element.ID)
              .collection('threads')
              .valueChanges({ idField: 'ID' })
              .subscribe((changes) => {
                changes.forEach(element => {
                  console.log(element.ID)
                  //console.log(element['userId'])
                  //  console.log(this.uID)
                  if (element['userId'] == this.uID) {
                    console.log(element['userName'])
                    console.log(formValue.firstname + ' ' + formValue.lastname)
                    element['userName'] = formValue.firstname + ' ' + formValue.lastname
                    this.update(element.ID, formValue)
                  }
                });
              })
          });
        })*/
  }

  update(channelIds) {
    let threadsId = []
    channelIds[0].forEach(element => {
      this.firestore
      .collection('channels')
      .doc(element.ID)
      .collection('threads')
      .valueChanges({idField: 'ID'})
      .subscribe((changes) => {
        threadsId.push(changes)
        threadsId
        console.log(threadsId)
        this.firestore
        .collection('threads')
        .doc
      })
      });
  }


  getInfoFromLocalStorage() {
    this.user = JSON.parse(localStorage.getItem('user'))
    this.uID = this.user.uid
    this.imgSrc = this.user.userImgUrl
  }


  getUserFotoFromFireStorage() {
    const storage = getStorage();
    getDownloadURL(ref(storage, `${this.uID}/1`)).then((url) => {
      console.log(url)
      this.imgUrl = url;
    })
  }
}


