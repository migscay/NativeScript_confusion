import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { DrawerPage } from '../shared/drawer/drawer.page';
import { TNSFontIconService } from 'nativescript-ngx-fonticon';
import * as Email from 'nativescript-email';
import * as TNSPhone from 'nativescript-phone';

@Component({
  selector: 'app-contact',
    moduleId: module.id,
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent extends DrawerPage implements OnInit {

  constructor(@Inject('BaseURL') private BaseURL,
              private changeDetectorRef:ChangeDetectorRef,
              private fonticon: TNSFontIconService) {
                super(changeDetectorRef);
               }

  ngOnInit() {

  }

  callRestaurant() {
    console.log('Calling Restaurant');
    TNSPhone.dial('+61490784525', true);
  }

  sendEmail() {

    Email.available()
      .then((avail: boolean) => {
        if (avail) {
          Email.compose({
            to: ['confusion@food.net'],
            subject: '[ConFusion]: Query',
            body: 'Dear Sir/Madam:'
          });
        }
        else
          console.log('No Email Configured');
      })

  }

}