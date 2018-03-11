import { Component, OnInit } from '@angular/core';
import { ModalDialogParams } from 'nativescript-angular/modal-dialog';
import { Slider } from 'ui/slider';
import { Page } from 'ui/page';
import { TextField } from 'ui/text-field';
import { Comment } from '../shared/comment';
import { Dish } from '../shared/dish';

@Component({
    moduleId: module.id,
    templateUrl: './comment.component.html',
    styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {

    rating: number=5;
    author: string='';
    comment: string='';
    newComment = <Comment>{};
    dish: Dish;

    constructor(private params: ModalDialogParams,
        private page: Page) {
            this.dish = params.context;
    }

    ngOnInit() {

    }

    onAuthorChange(args) {
        let textField = <TextField>args.object;
        this.author =  textField.text;      
        console.log(this.author);
    }

    onRatingChange(args) {
        let Slider = <Slider>args.object;
        this.rating =  Slider.value;      
        console.log(this.rating);        
    }

    onCommentChange(args) {
        let textField = <TextField>args.object;
        this.comment =  textField.text;      
        console.log(this.comment);
    }

    public submit() {
        console.log('Submitting Comment ' + this.dish.comments.length + this.dish.comments[0].author);
        this.newComment.author = this.author;
        this.newComment.rating = this.rating;
        this.newComment.comment = this.comment;
        this.newComment.date = Date();
        //this.dish.comments.push(this.newComment);
        //this.params.closeCallback(this.comments);
        this.params.closeCallback(this.newComment);
    }
}