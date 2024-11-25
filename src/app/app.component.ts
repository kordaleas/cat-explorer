import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, makeStateKey, OnInit, PLATFORM_ID, TransferState } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CatCardComponent } from './components/cat-card/cat-card.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { ThemeToggleComponent } from './components/theme-toggle/theme-toggle.component';
import { CatService } from './services/cat.service';
import { CatBreed } from './models/cat.interface';
import { FormsModule } from '@angular/forms';
import { SkeletonLoaderComponent } from './components/skeleton-loader/skeleton-loader.component';

const BREEDS_KEY = makeStateKey<CatBreed[]>('breeds');

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, CatCardComponent, SearchBarComponent, ThemeToggleComponent, SkeletonLoaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'cat-explorer';

  breeds: CatBreed[] = [];
  filteredBreeds: CatBreed[] = [];

  isLoading = true;
  error: string | null = null;
  searchError: string | null = null;
  noResults = false;

  constructor(private catService: CatService, private transferState: TransferState,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit() {
    const storedBreeds = this.transferState.get(BREEDS_KEY, null);
    if (storedBreeds) {
      this.breeds = storedBreeds;
      this.filteredBreeds = storedBreeds;
      this.isLoading = false;
    } else {
      this.loadBreeds();
    }
    if (isPlatformBrowser(this.platformId)) {
      this.checkUrlParams();
    }
  }

  loadBreeds() {
    this.isLoading = true;
    this.error = null;
    
    this.catService.getBreeds().subscribe({
      next: (breeds) => {
        this.breeds = breeds;
        this.transferState.set(BREEDS_KEY, breeds);
        this.filteredBreeds = breeds;
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Failed to load cat breeds. Please try again.';
        this.isLoading = false;
      }
    });
  }

  retryLoading() {
    this.loadBreeds();
  }

  handleSearch(searchTerm: string) {
    try {
      this.searchError = null;
      this.noResults = false;
      
      this.filteredBreeds = this.breeds.filter(breed =>
        breed.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      this.noResults = this.filteredBreeds.length === 0;
    } catch (error) {
      this.searchError = 'Error occurred while searching. Please try again.';
    }
  }

  private checkUrlParams() {
    if (isPlatformBrowser(this.platformId)) {
      const params = new URLSearchParams(window.location.search);
      const searchTerm = params.get('search');
      if (searchTerm) {
        this.handleSearch(searchTerm);
      }
    }
  }
}
