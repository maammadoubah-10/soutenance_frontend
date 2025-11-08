import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TypeAutorisation } from '../../models/type-autorisation';
import { Autorisation } from '../../models/autorisation';
import { TypeAutorisationService } from '../../services/type-autorisation.service';

@Component({
  selector: 'app-single-type-autorisation',
  templateUrl: './single-type-autorisation.component.html',
  styleUrls: ['./single-type-autorisation.component.scss'],
})
export class SingleTypeAutorisationComponent implements OnInit {
  items: any[] = [];
  public id:number= 0;
  public typeAutorisation?:TypeAutorisation;
  public autorisations:Autorisation[] = [];

  constructor(private router:Router, private route:ActivatedRoute, private _typeAutorisationService:TypeAutorisationService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe( (paramMap:any) => {
      this.id = parseInt(paramMap.get('id'));
    })
    if (this.id > 0) {
      this._typeAutorisationService.getTypeAutorisation(this.id).subscribe((data:any) => {
        this.typeAutorisation = data
      })

      this._typeAutorisationService.getAutorisations(this.id).subscribe((data:any) => {
        this.autorisations = data
      })
    }

      this.items = [
      { label: 'Paiement' },
      { label: 'Definitions/Autorisations', active: true },
    ];
  }

}
