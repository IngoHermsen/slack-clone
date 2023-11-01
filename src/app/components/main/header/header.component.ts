import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, AfterViewChecked, AfterViewInit } from '@angular/core';
import { EditUserComponent } from '../edit-user/edit-user.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/core/services/auth.service';
import { SearchFilterService } from 'src/app/core/services/search-filter.service';
import { debounceTime, fromEvent } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']

})
export class HeaderComponent implements OnInit, AfterViewInit {
  opened: boolean = false;
  openMenu: boolean = false;

  @ViewChild('searchInput') searchInput: ElementRef;

  source: any;

  constructor(
    public dialog: MatDialog,
    public authService: AuthService,
    public searchService: SearchFilterService,
  ) { }

  ngOnInit(): void {
    this.opened = window.innerWidth > 700;
  }

  ngAfterViewInit(): void {
    const keyUpEvent$ = fromEvent(this.searchInput.nativeElement, 'keyup')

    keyUpEvent$.pipe(debounceTime(300))
      .subscribe(() => {
        this.search()
      })
  }


  @Output()
  sidenavToggled: EventEmitter<boolean> = new EventEmitter<boolean>();

  onSidenavToggled() {
    this.opened = !this.opened
    this.sidenavToggled.emit(this.opened)
  }

  openDialog() {
    this.dialog.open(EditUserComponent);
  }

  search() {
    const inputValue = this.searchInput.nativeElement.value;
    this.searchService.searchValue.next(inputValue);

  }


  clickedOutside() {
    this.openMenu = false;
  }

}

