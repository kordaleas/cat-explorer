import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CatCardComponent } from './components/cat-card/cat-card.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { ThemeToggleComponent } from './components/theme-toggle/theme-toggle.component';
import { CatService } from './services/cat.service';
import { CatBreed } from './models/cat.interface';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, CatCardComponent, SearchBarComponent, ThemeToggleComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'cat-explorer';

  breeds: CatBreed[] = [];

  constructor(private catService: CatService) {}

  ngOnInit() {
    this.catService.getBreeds().subscribe(breeds => {
      this.breeds = breeds;
    });
  }


}
