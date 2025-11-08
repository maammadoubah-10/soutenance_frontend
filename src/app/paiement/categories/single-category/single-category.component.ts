
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Category } from '../../models/category';
import { SalaireBase } from '../../models/salaire-base';
import { CategorieService } from '../../services/categorie.service';

@Component({
  selector: 'app-single-category',
  templateUrl: './single-category.component.html',
  styleUrls: ['./single-category.component.scss']
})
export class SingleCategoryComponent implements OnInit {
  items: any[] = [];
  public id: number = 0;
  public category?: Category;
  public salaireBases: SalaireBase[] = [];

  constructor(private route: ActivatedRoute, private _categorieService: CategorieService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: any) => {
      this.id = parseInt(paramMap.get('id'));
    })
    if (this.id > 0) {
      this._categorieService.getCategory(this.id).subscribe((data: any) => {
        this.category = data
      })

      this._categorieService.getSalaireBases(this.id).subscribe((data: any) => {
        this.salaireBases = data
      })
    }
    this.items = [
      { label: 'Paiement' },
      { label: 'Categories/Salaire', active: true },
    ];
  }
}
