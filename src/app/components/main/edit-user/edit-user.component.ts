import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { getStorage, Storage, ref, getDownloadURL, uploadBytesResumable } from '@angular/fire/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { ImagesService } from 'src/app/core/services/images.service';
import * as firebase from 'firebase/app';
import 'firebase/storage';


@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {

  user;
  uID;

  imgStorage;
  imgRef;

  imgSrc: string = './assets/gender.png'
  selectedImage: any = null;
  isSubmitted: boolean = false;

  formTemplate = new FormGroup({
    name: new FormControl(''),
    email: new FormControl(''),
    imageUrl: new FormControl(''),
  })

  constructor(private storage: AngularFireStorage, private service: ImagesService) { }

  ngOnInit(): void {
    this.getInfoFromLocalStorage();
   // this.getUserFotoFromFireStorage();
  }

  onFileSelected(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader;
      reader.onload = (e: any) => this.imgSrc = e.target.result;
      reader.readAsDataURL(event.target.files[0])
      this.selectedImage = event.target.files[0]
    } else {
      this.imgSrc = './assets/gender.png';
      this.selectedImage = null;
    }
  }

  submit(formValue: any) {
    this.isSubmitted = true;
    if (this.formTemplate.valid) {
      const filePath = `${this.uID}/${this.selectedImage.name.split('.').slice(0, -1).join('.')}`;
      const fileRef = this.storage.ref(filePath);
      this.storage.upload(filePath, this.selectedImage).snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            formValue['imageUrl'] = url;
            console.log(formValue);
            this.service.insertImageDetails(formValue);
          })
        })).subscribe();
    }
  }

  getInfoFromLocalStorage() {
    this.user = JSON.parse(localStorage.getItem('user'))
    console.log(this.user)
    this.uID = this.user.uid
    console.log(this.uID)
  }

  /*
    getUserFotoFromFireStorage() {
      this.imgStorage = getStorage();
      this.imgRef = ref(this.imgStorage, `${this.uID}`);
      getDownloadURL(this.imgRef)
      .then((url) => {
        console.log(url)
      })
    }
  */
/*
  getUserFotoFromFireStorage() {
    let storageRef = firebase.storage().ref().child('images/image.png');
    storageRef.getDownloadURL().then(url => console.log(url) );

  }
*/
}


