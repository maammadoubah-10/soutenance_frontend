import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TypeRetenu } from '../../models/type-retenu';
import { Retenu } from '../../models/retenu';
import { TypeRetenuService } from '../../services/type-retenu.service';

@Component({
  selector: 'app-single-type-retenu',
  templateUrl: './single-type-retenu.component.html',
  styleUrls: ['./single-type-retenu.component.scss']
})
export class SingleTypeRetenuComponent implements OnInit {
    items: any[] = [];
  public id:number = 0;
  public typeRetenu?:TypeRetenu;
  public retenus:Retenu[] = [];

  constructor(private router:Router, private route:ActivatedRoute, private _typeRetenuService:TypeRetenuService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe( (paramMap: any)  => {
      this.id = parseInt(paramMap.get('id'));
    })
    if (this.id > 0) {
      this._typeRetenuService.getTypeRetenu(this.id).subscribe( (data: any) => {
        this.typeRetenu = data
      })

      this._typeRetenuService.getRetenus(this.id).subscribe((data: any)  => {
        this.retenus = data
      })
    }
  }

}
