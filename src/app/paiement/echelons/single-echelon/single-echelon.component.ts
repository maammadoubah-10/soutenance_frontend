import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Echelon } from '../../models/echelon';
import { SalaireBase } from '../../models/salaire-base';
import { EchelonService } from '../../services/echelon.service';

@Component({
  selector: 'app-single-echelon',
  templateUrl: './single-echelon.component.html',
  styleUrls: ['./single-echelon.component.scss']
})
export class SingleEchelonComponent implements OnInit {
  items: any[] = [];
  public id:number=0;
  public echelon?:Echelon;
  public salaireBases:SalaireBase[] = [];

  constructor(private router:Router, private route:ActivatedRoute, private _echelonService:EchelonService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe( (paramMap:any) => {
      this.id = parseInt(paramMap.get('id'));
    })
    if (this.id > 0) {
      this._echelonService.getEchelon(this.id).subscribe((data:any) => {
        this.echelon = data
      })

      this._echelonService.getSalaireBases(this.id).subscribe((data:any) => {
        this.salaireBases = data
      })
    }
     this.items = [
      { label: 'Paiement' },
      { label: 'Salaire/Echelons', active: true },
    ];
  }

}
