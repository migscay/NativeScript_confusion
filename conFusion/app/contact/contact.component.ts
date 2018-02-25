import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { DrawerPage } from '../shared/drawer/drawer.page';

@Component({
  selector: 'app-contact',
    moduleId: module.id,
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent extends DrawerPage implements OnInit {

  constructor(@Inject('BaseURL') private BaseURL,
              private changeDetectorRef:ChangeDetectorRef,) {
                super(changeDetectorRef);
               }

  ngOnInit() {

  }

}