import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { CarouselItem } from '../../models/carousel-item';
import { CarouselService } from '../../services/carousel.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CarouselItemComponent } from '../carousel-item/carousel-item.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CarouselItemComponent, CommonModule],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss'
})
export class CarouselComponent implements OnInit {

  private destroyRef = inject(DestroyRef);

  carouselItems: CarouselItem[] = [];

  constructor(private carouselService: CarouselService) { }

  ngOnInit(): void {
    this.carouselService.getCarouselItems().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(val => {
      this.carouselItems = val;
    });
  }
}
