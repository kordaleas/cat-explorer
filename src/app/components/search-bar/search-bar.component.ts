import { Component, EventEmitter, Inject, Output, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent {
  @Output() search = new EventEmitter<string>();
  searchTerm = '';
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(term => {
      this.updateSearchResults(term);
    });
   }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const params = new URLSearchParams(window.location.search);
      this.searchTerm = params.get('search') || '';
      if (this.searchTerm) {
        this.updateSearchResults(this.searchTerm);
      }
    }
  }

  onSearch() {
    this.searchSubject.next(this.searchTerm);
  }

  private updateSearchResults(term: string) {
    this.search.emit(term);
    if (isPlatformBrowser(this.platformId)) {
      const url = new URL(window.location.href);
      url.searchParams.set('search', term);
      window.history.pushState({}, '', url);
    }
  }


  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
