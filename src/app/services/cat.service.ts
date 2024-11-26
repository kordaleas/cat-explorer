import { Injectable, makeStateKey, TransferState } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, of, throwError } from 'rxjs';
import { CatBreed, CatImage } from '../models/cat.interface';
import { ApiError } from '../models/error.interface';

const BREED_IMAGE_KEY = makeStateKey<Record<string, string>>('breedImages');

@Injectable({
  providedIn: 'root'
})
export class CatService {
  private apiUrl = 'https://api.thecatapi.com/v1';

  constructor(private http: HttpClient, private transferState: TransferState
  ) { }

  getBreeds(): Observable<CatBreed[]> {
    return this.http.get<CatBreed[]>(`${this.apiUrl}/breeds`).pipe(
      catchError((error: HttpErrorResponse) => {
        const apiError: ApiError = {
          statusCode: error.status,
          message: error.message,
          timestamp: new Date().toISOString()
        };
        return throwError(() => apiError);
      })
    );
  }

  getBreedImage(breedId: string): Observable<CatImage[]> {
    const images = this.transferState.get(BREED_IMAGE_KEY, {});
    if (images[breedId]) {
      return of([{ url: images[breedId] } as CatImage]);
    }

    return this.http.get<CatImage[]>(`${this.apiUrl}/images/search?breed_ids=${breedId}`).pipe(
      catchError((error: HttpErrorResponse) => {
        const apiError: ApiError = {
          statusCode: error.status,
          message: error.message,
          timestamp: new Date().toISOString()
        };
        return throwError(() => apiError);
      })
    );
  }
}