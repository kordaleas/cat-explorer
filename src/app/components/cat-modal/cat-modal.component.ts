import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatBreed } from '../../models/cat.interface';

@Component({
  selector: 'app-cat-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cat-modal.component.html',
  styleUrls: ['./cat-modal.component.scss']
})
export class CatModalComponent {
  @Input() breed!: CatBreed;
  @Input() imageUrl: string = '';
  @Output() close = new EventEmitter<void>();

  selectedRankings: (keyof CatBreed)[] = [
    'adaptability',
    'affection_level',
    'child_friendly',
    'grooming',
    'intelligence',
    'social_needs'
  ];

  getRanking(ranking: keyof CatBreed): number {
    return (this.breed[ranking] as number) || 0;
  }

  closeModal() {
    this.close.emit();
  }
}
