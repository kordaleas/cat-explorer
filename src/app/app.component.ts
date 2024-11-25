import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CatCardComponent } from './components/cat-card/cat-card.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { ThemeToggleComponent } from './components/theme-toggle/theme-toggle.component';
import { CatService } from './services/cat.service';
import { CatBreed } from './models/cat.interface';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, CatCardComponent, SearchBarComponent, ThemeToggleComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'cat-explorer';

  breeds: CatBreed[] = [];
  filteredBreeds: CatBreed[] = [];

  constructor(private catService: CatService, @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit() {
    this.loadBreeds();
    if (isPlatformBrowser(this.platformId)) {
      this.checkUrlParams();
    }
  }

  loadBreeds() {
    this.catService.getBreeds().subscribe(breeds => {
      this.breeds = breeds;
      this.filteredBreeds = breeds;
    });
  }

  handleSearch(searchTerm: string) {
    this.filteredBreeds = this.breeds.filter(breed =>
      breed.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
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
