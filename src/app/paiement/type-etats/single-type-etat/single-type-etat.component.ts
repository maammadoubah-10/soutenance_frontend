import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TypeEtat } from '../../models/type-etat';
import { Etat } from '../../models/etat';
import { TypeEtatService } from '../../services/type-etat.service';

@Component({
  selector: 'app-single-type-etat',
  templateUrl: './single-type-etat.component.html',
  styleUrls: ['./single-type-etat.component.scss']
})
export class SingleTypeEtatComponent implements OnInit {
  items: any[] = [];
  public id:number=0;
  public typeEtat?:TypeEtat;
  public etats:Etat[] = [];

  constructor(private router:Router,
     private route:ActivatedRoute, 
     private _typeEtatService:TypeEtatService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap:any) => {
      this.id = parseInt(paramMap.get('id'));
    })
    if (this.id > 0) {
      this._typeEtatService.getTypeEtat(this.id).subscribe((data:any) => {
        this.typeEtat = data
      })

      this._typeEtatService.getEtats(this.id).subscribe((data:any) => {
        this.etats = data
      })
    }

     this.items = [
      { label: 'Paiement' },
      { label: 'Type Etat', active: true },
    ];
  }

}
