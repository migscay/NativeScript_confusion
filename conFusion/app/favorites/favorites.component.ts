import { Component, OnInit, Inject, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FavoriteService } from '../services/favorite.service';
import { Dish } from '../shared/dish';
import { ListViewEventData, RadListView } from 'nativescript-telerik-ui/listview';
import { RadListViewComponent } from 'nativescript-telerik-ui/listview/angular';
import { ObservableArray } from 'tns-core-modules/data/observable-array';
import { DrawerPage } from '../shared/drawer/drawer.page';
@Component({
    selector: 'app-favorites',
    moduleId: module.id,
    templateUrl: './favorites.component.html',
    styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent extends DrawerPage implements OnInit {

    favorites: ObservableArray<Dish>;
    errMess: string;

    @ViewChild('myListView') listViewComponent: RadListViewComponent;

    constructor(private favoriteservice: FavoriteService,
        private changeDetectorRef: ChangeDetectorRef,
        @Inject('BaseURL') private BaseURL) {
            super(changeDetectorRef);
    }

    ngOnInit() {
        this.favoriteservice.getFavorites()
            .subscribe(favorites => this.favorites = new ObservableArray(favorites),
                errmess => this.errMess = errmess);
    }

    deleteFavorite(id: number) {
        this.favoriteservice.deleteFavorites(id)
            .subscribe(favorites => this.favorites = new ObservableArray(favorites),
                errmess => this.errMess = errmess);
    }

}