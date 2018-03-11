import { Injectable } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { CouchbaseService } from '../services/couchbase.service';

/*
  Generated class for the DishProvider provider.
  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class FavoriteService {

    favorites: Array<number>;
    docId: string = "favorites";

    constructor(private dishservice: DishService,
        private couchbaseService: CouchbaseService) { 
        this.favorites = [];

        let doc = this.couchbaseService.getDocument(this.docId);
        if( doc == null) {
          this.couchbaseService.createDocument({"favorites": []}, this.docId);
        }
        else {
          this.favorites = doc.favorites;
        }
    }

    isFavorite(id: number): boolean {
        return this.favorites.some(el => el === id);
    }

    addFavorite(id: number): boolean {
        if (!this.isFavorite(id)) {
            this.favorites.push(id);
            this.couchbaseService.updateDocument(this.docId, {"favorites": this.favorites});
        }
        return true;
    }

    getFavorites(): Observable<Dish[]> {
        return this.dishservice.getDishes()
           .map(dishes => dishes.filter(dish => this.favorites.some(el => el === dish.id)));
    }

    deleteFavorite(id: number): Observable<Dish[]> {
        // check first if it is in the Favorites
        let index = this.favorites.indexOf(id);
        if (index >= 0) {
            this.favorites.splice(index,1);
            this.couchbaseService.updateDocument(this.docId, {"favorites": this.favorites});
            return this.getFavorites();
        }
        else {
            Observable.throw('Deleting non-existant favorite');
        }
    }
} 
