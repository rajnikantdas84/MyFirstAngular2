import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent implements OnInit {
  currentyear: any = "2017";
  constructor() {
    const datevalue: Date = new Date();
    this.currentyear = datevalue.getFullYear();
   }

  ngOnInit() {
  }

}
