import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { CatBreed } from '../../models/cat.interface';
import { CatService } from '../../services/cat.service';

@Component({
  selector: 'app-cat-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cat-card.component.html',
  styleUrl: './cat-card.component.scss'
})
export class CatCardComponent implements OnInit {
  @Input() breed!: CatBreed;
  imageUrl: string = '';
  isModalOpen = false;

  constructor(private catService: CatService) {}

  ngOnInit() {
    this.loadBreedImage();
  }

  loadBreedImage() {
    this.catService.getBreedImage(this.breed.id).subscribe(images => {
      if (images.length > 0) {
        this.imageUrl = images[0].url;
      }
    });
  }

  openModal() {
    this.isModalOpen = true;
  }
}
