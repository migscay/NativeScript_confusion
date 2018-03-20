import { Component, OnInit, Inject, ChangeDetectorRef, ViewContainerRef } from '@angular/core';
import { DrawerPage } from '../shared/drawer/drawer.page';
import { TextField } from 'ui/text-field';
import { Switch } from 'ui/switch';
import { Validators, FormBuilder, FormGroup} from '@angular/forms';
import { ModalDialogService, ModalDialogOptions } from "nativescript-angular/modal-dialog";
import { ReservationModalComponent } from "../reservationmodal/reservationmodal.component";
import { Page } from "ui/page";
import { Animation, AnimationDefinition } from "ui/animation";
import { View } from "ui/core/view";
import { SwipeGestureEventData, SwipeDirection } from "ui/gestures";
import { Color } from 'color';
import * as enums from "ui/enums";
import { Reservation } from '../shared/reservation';
import { CouchbaseService } from '../services/couchbase.service';

@Component({
    selector: 'app-reservation',
    moduleId: module.id,
    templateUrl: './reservation.component.html',
    styleUrls: ['./reservation.component.css']
})
export class ReservationComponent extends DrawerPage implements OnInit {

    reservation: FormGroup;
    confirmReservation: boolean = false;
    reserveConfirmation: Reservation;
    reservations: Array<Reservation>;
    docId: string = "reservations";

    reserveForm: View;
    confirmation: View;  

    constructor(private changeDetectorRef: ChangeDetectorRef,
        private formBuilder: FormBuilder,
        private couchbaseService: CouchbaseService, 
        private page: Page,
        private _modalService: ModalDialogService, 
        private vcRef: ViewContainerRef) { 
            super(changeDetectorRef);

            this.reservation = this.formBuilder.group({
                guests: 3,
                smoking: false,
                dateTime: ['', Validators.required]
            });        

            this.reserveConfirmation = <Reservation>{};
        }

    ngOnInit() {

    }

    onSmokingChecked(args) {
        let smokingSwitch = <Switch>args.object;
        if (smokingSwitch.checked) {
            this.reservation.patchValue({ smoking: true });
        }
        else {
            this.reservation.patchValue({ smoking: false });
        }
    }

    onGuestChange(args) {
        let textField = <TextField>args.object;

        this.reservation.patchValue({ guests: textField.text});
    }

    onDateTimeChange(args) {
        let textField = <TextField>args.object;

        this.reservation.patchValue({ dateTime: textField.text});
    }

    onSubmit() {
        console.log(JSON.stringify(this.reservation.value));
        //this.confirmReservation = true;
        this.reserveConfirmation = <Reservation>this.reservation.value;
        this.reserveConfirmation.guests

        this.reserveForm = <View>this.page.getViewById<View>("reserveForm");
        this.confirmation = <View>this.page.getViewById<View>("confirmation");

        let definitions = new Array<AnimationDefinition>();

        let a1: AnimationDefinition = {
            target: this.reserveForm,
            scale: { x: 0, y: 0 },
            //translate: { x: 250, y: 250 },
            //opacity: 0,
            //delay: 5000,
            duration: 2500,
            curve: enums.AnimationCurve.linear
        };
        definitions.push(a1);
    
        let a2: AnimationDefinition = {
            target: this.confirmation,
            scale: { x: 1, y: 1},
            //translate: { x: 0, y: 0 },
            //opacity: 1,
            delay: 2500,
            duration: 5000,
            curve: enums.AnimationCurve.linear
        };
        //definitions.push(a2);
    
        let animationSet = new Animation(definitions);

        //this.confirmation.animate({scale: { x: 1, y: 1}, duration: 3000});

        animationSet.play().then(() => {
          //this.reserveForm.className="confirmation"; 
          //this.confirmReservation = true;
          //this.reserveForm.animate({scale: { x: 1, y: 1}, duration: 3000});
        })
        .catch((e) => {
            console.log(e.message);
        });

        this.confirmation.className="confirmation"; 
        this.confirmation.animate({scale: { x: 1, y: 1}, delay: 3000, duration: 3000});
        this.confirmReservation = true;
        //this.couchbaseService.deleteDocument(this.docId);

        let doc = this.couchbaseService.getDocument(this.docId);
        if( doc == null) {
          this.couchbaseService.createDocument({"reservations": []}, this.docId);
          console.log("Reservations document created");
          let doc = this.couchbaseService.getDocument(this.docId);
          this.reservations = doc.reservations;
        }
        else {
          this.reservations = doc.reservations;
          console.log("Number of Reservations equal " + this.reservations.length);
          //for (var i = 0; i < this.reservations.length; i++) {
            console.log(JSON.stringify(this.reservations));
          //}
        }
        console.log("Before add " + JSON.stringify(this.reservations));      
        this.reservations.push(this.reserveConfirmation);
        this.couchbaseService.updateDocument(this.docId, {"reservations": this.reservations});
        console.log("After add " + JSON.stringify(this.reservations));      

    }

    createModalView(args) {

        let options: ModalDialogOptions = {
            viewContainerRef: this.vcRef,
            context: args,
            fullscreen: false
        };

        this._modalService.showModal(ReservationModalComponent, options)
            .then((result: any) => {
                if (args === "guest") {
                    this.reservation.patchValue({guests: result});
                }
                else if (args === "date-time") {
                    this.reservation.patchValue({ dateTime: result});
                }
            });

    }

}