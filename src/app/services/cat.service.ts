import { Injectable, makeStateKey, TransferState } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { CatBreed, CatImage } from '../models/cat.interface';

const BREED_IMAGE_KEY = makeStateKey<Record<string, string>>('breedImages');

@Injectable({
  providedIn: 'root'
})
export class CatService {
  private apiUrl = 'https://api.thecatapi.com/v1';

  constructor(private http: HttpClient, private transferState: TransferState
  ) { }

  getBreeds(): Observable<CatBreed[]> {
    return this.http.get<CatBreed[]>(`${this.apiUrl}/breeds`);
  }

  getBreedImage(breedId: string): Observable<CatImage[]> {
    const images = this.transferState.get(BREED_IMAGE_KEY, {});
    if (images[breedId]) {
      return of([{ url: images[breedId] } as CatImage]);
    }

    return this.http.get<CatImage[]>(`${this.apiUrl}/images/search?breed_ids=${breedId}`);  }
}