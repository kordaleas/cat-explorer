import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { CatBreed } from '../../models/cat.interface';
import { CatService } from '../../services/cat.service';
import { CatModalComponent } from '../cat-modal/cat-modal.component';
import { retry } from 'rxjs';

@Component({
  selector: 'app-cat-card',
  standalone: true,
  imports: [CommonModule, CatModalComponent],
  templateUrl: './cat-card.component.html',
  styleUrl: './cat-card.component.scss'
})
export class CatCardComponent implements OnInit {
  @Input() breed!: CatBreed;

  imageUrl: string = '';
  isModalOpen = false;
  isLoading = true;
  hasError = false;

  constructor(private catService: CatService) {}


  ngOnInit() {
    this.loadImage();
  }

  loadImage() {
    this.isLoading = true;
    this.hasError = false;
    
    this.catService.getBreedImage(this.breed.id)
      .pipe(retry(2))
      .subscribe({
        next: (images) => {
          if (images.length > 0) {
            this.imageUrl = images[0].url;
          }
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          this.hasError = true;
        }
      });
  }

  retryLoad() {
    this.loadImage();
  }

  openModal() {
    this.isModalOpen = true;
  }
}
