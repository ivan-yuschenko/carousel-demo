import { Component, Input } from '@angular/core';
import { CarouselItem } from '../../models/carousel-item';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carousel-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carousel-item.component.html',
  styleUrl: './carousel-item.component.scss'
})
export class CarouselItemComponent {
  @Input() item?: CarouselItem;
}
