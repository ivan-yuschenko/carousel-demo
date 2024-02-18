import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CarouselItem } from '../models/carousel-item';

@Injectable({
  providedIn: 'root'
})
export class CarouselService {

  constructor(private http: HttpClient) { }

  getCarouselItems(): Observable<CarouselItem[]> {
    return this.http.get<CarouselItem[]>('https://run.mocky.io/v3/5d285185-fa57-4b0e-b054-616dfd01bd76');
  }
}
