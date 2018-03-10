import { Component, OnInit, Inject, ViewContainerRef } from '@angular/core';
import { Dish } from '../shared/dish';
import { Comment } from '../shared/comment';
import { DishService } from '../services/dish.service';
import { FavoriteService } from '../services/favorite.service';
import { ActivatedRoute, Params } from '@angular/router';
import { TNSFontIconService } from 'nativescript-ngx-fonticon';
import { RouterExtensions } from 'nativescript-angular/router';
import 'rxjs/add/operator/switchMap';
import { Toasty } from 'nativescript-toasty';
import { action } from "ui/dialogs";
import { ModalDialogService, ModalDialogOptions } from "nativescript-angular/modal-dialog";
import { CommentComponent } from "../comment/comment.component";
import { Validators, FormBuilder, FormGroup} from '@angular/forms';


@Component({
  selector: 'app-dishdetail',
    moduleId: module.id,
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.css']
})
export class DishdetailComponent implements OnInit {

  dish: Dish;
  comment: Comment;
  errMess: string;
  avgstars: string;
  numcomments: number;
  favorite: boolean = false;
  addcomment: FormGroup;

  constructor(private dishservice: DishService,
    private favoriteservice: FavoriteService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder, 
    private fonticon: TNSFontIconService,
    private routerExtensions: RouterExtensions,
    private _modalService: ModalDialogService, 
    private vcRef: ViewContainerRef,
    @Inject('BaseURL') private BaseURL) { 
      this.addcomment = this.formBuilder.group({
        rating: 5,
        author: ['test', Validators.required],
        comment: ['comment test', Validators.required],
      });

    }

  ngOnInit() {

    this.route.params
      .switchMap((params: Params) => this.dishservice.getDish(+params['id']))
      .subscribe(dish => { this.dish = dish;
                           this.favorite = this.favoriteservice.isFavorite(this.dish.id);
                           this.numcomments = this.dish.comments.length;

                           let total=0;
                           this.dish.comments.forEach(comment => total += comment.rating);

                           this.avgstars = (total/this.numcomments).toFixed(2);
      },
          errmess => { this.dish = null; this.errMess = <any>errmess; });
  }

  addToFavorites() {
    if (!this.favorite) {
      console.log('Adding to Favorites', this.dish.id);
      this.favorite = this.favoriteservice.addFavorite(this.dish.id);
      const toast = new Toasty("Added Dish "+ this.dish.id, "short", "bottom");
      toast.show();
    }
  }

  addComment(args) {
    console.log('adding comment ' + this.dish.comments.toString);

    let options: ModalDialogOptions = {
      viewContainerRef: this.vcRef,
      context: args,
      fullscreen: false
  };

  this._modalService.showModal(CommentComponent, options)
      .then((result: any) => {
        //this.addcomment.patchValue({rating: result});
        //this.addcomment.patchValue({author: result});
        //this.addcomment.patchValue({comment: result});
        //console.log(this.addComment.toString);
        console.log('DishDetail ' + this.dish.name);
      });
  }
  goBack(): void {
    this.routerExtensions.back();
  }

  dishActions(): void {
    let options = {
      title: "Actions",
      message: "Choose your Action",
      cancelButtonText: "Cancel",
      actions: ["Add to Favorites", "Add Comment"]
    };

    action(options).then((result) => {
      if (result === 'Add to Favorites') {
        console.log("execute add to favorites");
        this.addToFavorites();
      } else
      if (result === 'Add Comment') {
        console.log("execute add comment");
        this.addComment(this.dish);
      } else {
        console.log(result);
      }        
    });
  }
}