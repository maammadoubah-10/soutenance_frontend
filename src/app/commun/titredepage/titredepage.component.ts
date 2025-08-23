import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-titredepage',
  templateUrl: './titredepage.component.html',
  styleUrls: ['./titredepage.component.scss']
})
export class TitredepageComponent implements OnInit {
  @Input() items: any[] = [];
  @Input() title ?: string;
  
  constructor() { }

  ngOnInit(): void {
  }

}
