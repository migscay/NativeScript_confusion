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
import { ObservableArray } from 'tns-core-modules/data/observable-array';
import { Page } from "ui/page";
import { Animation, AnimationDefinition } from "ui/animation";
import { View } from "ui/core/view";
import * as gestures from "tns-core-modules/ui/gestures";
import { SwipeGestureEventData, SwipeDirection } from "ui/gestures";
import { Color } from 'color';
import * as enums from "ui/enums";
import * as SocialShare from "nativescript-social-share";
import { ImageSource, fromUrl } from "image-source";

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
  newComment = <Comment>{};
  comments: ObservableArray<Comment>;
  showComments: boolean = false;

  cardImage: View;
  commentList: View;
  cardLayout: View;

  constructor(private dishservice: DishService,
    private favoriteservice: FavoriteService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder, 
    private page: Page, 
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
                           this.comments = new ObservableArray(this.dish.comments);
                           this.numcomments = this.comments.length;

                           let total=0;
                           this.comments.forEach(comment => total += comment.rating);

                           this.avgstars = (total/this.numcomments).toFixed(2);
      },
          errmess => { this.dish = null; this.errMess = <any>errmess; });
  }

  addToFavorites() {
    if (!this.favorite) {
      console.log('Adding to Favorites', this.dish.id);
      this.favorite = this.favoriteservice.addFavorite(this.dish.id);
      const toast = new Toasty(this.dish.name + " added to Favourite Dishes", "short", "bottom");
      toast.show();
    }
  }

  addComment(args) {
    console.log('Dishdetail adding comment ' + this.dish.comments.length);

    let options: ModalDialogOptions = {
      viewContainerRef: this.vcRef,
      context: args,
      fullscreen: false
  };

  this._modalService.showModal(CommentComponent, options)
      .then((result: any) => {
        this.newComment = <Comment>(result);
        this.comments.push(this.newComment);
        //update comment statistics
        this.numcomments = this.comments.length;
        let total=0;
        this.comments.forEach(comment => total += comment.rating);
        this.avgstars = (total/this.numcomments).toFixed(2);
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
      actions: ["Add to Favorites", "Add Comment", "Social Sharing"]
    };

    action(options).then((result) => {
      if (result === 'Add to Favorites') {
        console.log("execute add to favorites");
        this.addToFavorites();
      } else
      if (result === 'Add Comment') {
        console.log("execute add comment");
        this.addComment(this.dish);
      } else 
      if (result === 'Social Sharing') {
        console.log("execute Social Sharing");
        this.socialShare();
      } else
      {
        console.log(result);
      }        
    });
  }

  onSwipe(args: SwipeGestureEventData) {

    console.log('Inside Oswipe Direction ', args.direction);

    if (this.dish) {
      this.cardImage = <View>this.page.getViewById<View>("cardImage");
      this.cardLayout = <View>this.page.getViewById<View>("cardLayout");
      this.commentList = <View>this.page.getViewById<View>("commentList");

      if (args.direction === SwipeDirection.up && !this.showComments ) {
        this.animateUp();
      }
      else if (args.direction === SwipeDirection.down && this.showComments ) {
        this.showComments = false;
        this.animateDown();
      }
    }

  }

  showAndHideComments() {
      this.cardImage = <View>this.page.getViewById<View>("cardImage");
      this.cardLayout = <View>this.page.getViewById<View>("cardLayout");
      this.commentList = <View>this.page.getViewById<View>("commentList");

      if (!this.showComments ) {
        this.animateUp();
      }
      else if (this.showComments ) {
        this.showComments = false;
        this.animateDown();
      }
  }

  socialShare() {
    let image: ImageSource;

    fromUrl(this.BaseURL + this.dish.image)
     .then((img: ImageSource) => {
       image = img; 
        SocialShare.shareImage(image, "How would you like to share this image?")
      })
     .catch(()=> { console.log('Error loading image'); });

  }

  animateUp() {
    let definitions = new Array<AnimationDefinition>();
    let a1: AnimationDefinition = {
        target: this.cardImage,
        scale: { x: 1, y: 0 },
        translate: { x: 0, y: -200 },
        opacity: 0,
        duration: 500,
        curve: enums.AnimationCurve.easeIn
    };
    definitions.push(a1);

    let a2: AnimationDefinition = {
        target: this.cardLayout,
        backgroundColor: new Color("#ffc107"),
        duration: 500,
        curve: enums.AnimationCurve.easeIn
    };
    definitions.push(a2);

    let animationSet = new Animation(definitions);

    animationSet.play().then(() => {
      this.showComments = true;
    })
    .catch((e) => {
        console.log(e.message);
    });
  } 

  animateDown() {
    let definitions = new Array<AnimationDefinition>();
    let a1: AnimationDefinition = {
        target: this.cardImage,
        scale: { x: 1, y: 1 },
        translate: { x: 0, y: 0 },
        opacity: 1,
        duration: 500,
        curve: enums.AnimationCurve.easeIn
    };
    definitions.push(a1);

    let a2: AnimationDefinition = {
        target: this.cardLayout,
        backgroundColor: new Color("#ffffff"),
        duration: 500,
        curve: enums.AnimationCurve.easeIn
    };
    definitions.push(a2);

    let animationSet = new Animation(definitions);

    animationSet.play().then(() => {
    })
    .catch((e) => {
        console.log(e.message);
    });
  } 
}