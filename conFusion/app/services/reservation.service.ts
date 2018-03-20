import { Injectable } from '@angular/core';
import { Reservation } from '../shared/reservation';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { CouchbaseService } from '../services/couchbase.service';

@Injectable()
export class ReservationService {

    reservations: Array<Reservation>;
    docId: string = "reservations";

    constructor(private couchbaseService: CouchbaseService) { 
        //this.reservations = [];
        this.couchbaseService.deleteDocument(this.docId);

        let doc = this.couchbaseService.getDocument(this.docId);
        if( doc == null) {
          this.couchbaseService.createDocument({"reservations": []}, this.docId);
          console.log("Reservations document created");
        }

        doc = this.couchbaseService.getDocument(this.docId);
        this.reservations = doc.reservations;
        console.log("Number of Reservations equal " + this.reservations.length);
        console.log("Before add " + JSON.stringify(this.reservations));
    }

    addReservation(reservation: Reservation): void {
        this.reservations.push(reservation);
        this.couchbaseService.updateDocument(this.docId, {"reservations": this.reservations});
        console.log("After add " + JSON.stringify(this.reservations));
        //return true;
    }

} 
