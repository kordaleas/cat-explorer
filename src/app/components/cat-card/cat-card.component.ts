import { CommonModule } from '@angular/common';
import { Component, HostListener, Input, OnInit } from '@angular/core';
import { CatBreed } from '../../models/cat.interface';
import { CatService } from '../../services/cat.service';
import { CatModalComponent } from '../cat-modal/cat-modal.component';
import { retry } from 'rxjs';
import { ApiError } from '../../models/error.interface';

@Component({
  selector: 'app-cat-card',
  standalone: true,
  imports: [CommonModule, CatModalComponent],
  templateUrl: './cat-card.component.html',
  styleUrl: './cat-card.component.scss'
})
export class CatCardComponent implements OnInit {
  @Input() breed!: CatBreed;

  @HostListener('keydown.enter')
  @HostListener('keydown.space', ['$event'])
  onKeyPress(event?: KeyboardEvent) {
    if (event) {
      event.preventDefault();
    }
    this.openModal();
  }

  imageUrl: string = '';
  isModalOpen = false;
  isLoading = true;
  hasError = false;
  errorMessage: string = '';

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
        error: (error: ApiError) => {
          this.isLoading = false;
          this.hasError = true;
          this.errorMessage = `Failed to load image (${error.statusCode})`;
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
