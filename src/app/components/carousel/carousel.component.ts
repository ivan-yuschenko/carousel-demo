import { Component, OnInit, inject, DestroyRef, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CarouselItem } from '../../models/carousel-item';
import { CarouselService } from '../../services/carousel.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CarouselItemComponent } from '../carousel-item/carousel-item.component';
import { CommonModule } from '@angular/common';
import { animate, AnimationBuilder, AnimationFactory, AnimationPlayer, style } from '@angular/animations';
import { fromEvent, zipWith, withLatestFrom } from 'rxjs';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CarouselItemComponent, CommonModule],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss'
})
export class CarouselComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('carousel') carousel!: ElementRef;

  private animationPlayer!: AnimationPlayer

  private destroyRef = inject(DestroyRef);

  carouselItems: CarouselItem[] = [];

  itemWidth = 428;

  currentIndex = 1;

  transitionTiming = '150ms ease-in';

  isLoaded = false;

  intervalId!: ReturnType<typeof setInterval>;

  constructor(private carouselService: CarouselService, private animationBuilder: AnimationBuilder) { }

  ngOnInit(): void {
    this.carouselService.getCarouselItems().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(val => {
      const tempCarousel = val;
      tempCarousel.unshift(val[val.length-1]);
      tempCarousel.push(val[0]);
      this.carouselItems = tempCarousel;
      this.animateCarousel(0);
      this.isLoaded = true;
    });
  }

  ngAfterViewInit(): void {
    this.setTimer();
    fromEvent<TouchEvent>(document, 'touchstart')
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        zipWith(
          fromEvent<TouchEvent>(document, 'touchend').pipe(
            withLatestFrom(fromEvent<TouchEvent>(document, 'touchmove'))
          )
        )
      )
      .subscribe(([touchstart, [_, touchmove]]) => {
        clearInterval(this.intervalId);
        const xDiff = touchstart.touches[0].clientX - touchmove.touches[0].clientX;
        if (Math.abs(xDiff) > 0.3 * document.body.clientWidth && touchstart.timeStamp <= touchmove.timeStamp) {
          if (xDiff > 0) {
            this.nextSlide();
          } else {
            this.prevSlide();
          }
          this.setTimer();
        }
      });
  }

  nextSlide(): void {
    if (this.currentIndex + 1 === this.carouselItems.length - 1) {
      this.currentIndex = 0;
      this.animateCarousel(0);
    }
    this.currentIndex++;
    this.animateCarousel(this.transitionTiming);
  }

  prevSlide(): void {
    if (this.currentIndex === 0) {
      this.currentIndex = this.carouselItems.length - 2;
      this.animateCarousel(0);
    }
    this.currentIndex--;
    this.animateCarousel(this.transitionTiming);
  }

  buildAnimation(offset: number, transitionTiming: string | number = 0): AnimationFactory {
    return this.animationBuilder.build([
      animate(transitionTiming, style({ transform: `translateX(-${offset}px)` }))
    ]);
  }

  animateCarousel(transitionTiming: string | number) {
    const offset = this.currentIndex * this.itemWidth;
    const myAnimation: AnimationFactory = this.buildAnimation(offset, transitionTiming);
    this.animationPlayer = myAnimation.create(this.carousel.nativeElement);
    this.animationPlayer.play();
  }

  setTimer(): void {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 10000);
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

}
