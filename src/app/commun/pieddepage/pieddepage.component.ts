import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pieddepage',
  templateUrl: './pieddepage.component.html',
  styleUrls: ['./pieddepage.component.scss']
})
export class PieddepageComponent implements OnInit {

  year: number = new Date().getFullYear();

  constructor() { }

  
  ngOnInit(): void {
  }

}
