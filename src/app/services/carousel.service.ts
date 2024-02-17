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
    return this.http.get<CarouselItem[]>('https://run.mocky.io/v3/3e7485ee-6c5e-46b2-813c-8da70a0eda32');
  }
}
