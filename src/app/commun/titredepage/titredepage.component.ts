import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-titredepage',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './titredepage.component.html',
  styleUrls: ['./titredepage.component.scss']
})
export class TitredepageComponent {
  @Input() items: any[] = [];
  @Input() title?: string;
}
