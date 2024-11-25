import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CatBreed, CatImage } from '../models/cat.interface';

@Injectable({
  providedIn: 'root'
})
export class CatService {
  private apiUrl = 'https://api.thecatapi.com/v1';

  constructor(private http: HttpClient) {}

  getBreeds(): Observable<CatBreed[]> {
    return this.http.get<CatBreed[]>(`${this.apiUrl}/breeds`);
  }

  getBreedImage(breedId: string): Observable<CatImage[]> {
    return this.http.get<CatImage[]>(`${this.apiUrl}/images/search?breed_ids=${breedId}`);
  }
}