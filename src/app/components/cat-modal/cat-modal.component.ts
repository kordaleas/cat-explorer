import { Component, Input, Output, EventEmitter, HostListener, OnInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatBreed } from '../../models/cat.interface';

@Component({
  selector: 'app-cat-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cat-modal.component.html',
  styleUrls: ['./cat-modal.component.scss']
})
export class CatModalComponent implements OnInit{
  @HostListener('window:keydown.escape')
  handleEscapeKey() {
    this.closeModal();
  }


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

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    this.trapFocus();
    document.body.style.overflow = 'hidden';
  }

  getRanking(ranking: keyof CatBreed): number {
    return (this.breed[ranking] as number) || 0;
  }

  closeModal() {
    this.close.emit();
  }

  private trapFocus() {
    const focusableElements = this.elementRef.nativeElement.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];

    firstFocusableElement.focus();

    this.elementRef.nativeElement.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstFocusableElement) {
          e.preventDefault();
          lastFocusableElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastFocusableElement) {
          e.preventDefault();
          firstFocusableElement.focus();
        }
      }
    });
  }
}
