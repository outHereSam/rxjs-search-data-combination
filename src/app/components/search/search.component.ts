import { Component } from '@angular/core';
import { catchError, delay, finalize, fromEvent, of, tap } from 'rxjs';
import { debounceTime, map, filter, switchMap } from 'rxjs';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent {
  searchResults: string[] = [];
  loading: boolean = false;
  error: string | null = null;

  ngOnInit() {
    const searchInput = document.getElementById('search') as HTMLInputElement;

    fromEvent(searchInput, 'input')
      .pipe(
        map((event: Event) => (event.target as HTMLInputElement).value),
        debounceTime(300),
        filter((value: string) => value.length > 2),
        tap(() => {
          this.loading = true;
          this.error = null;
          this.searchResults = [];
        }),
        switchMap((term: string) =>
          of(this.fakeApiCall(term)).pipe(
            delay(500),
            catchError((err) => {
              this.error = 'Failed to fetch search results.';
              this.loading = false;
              return of([]);
            }),
            finalize(() => (this.loading = false))
          )
        )
      )
      .subscribe({
        next: (results: string[]) => {
          this.searchResults = results;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  fakeApiCall(term: string): string[] {
    if (Math.random() < 0.3) {
      throw new Error('Random API error');
    }
    return [
      `Result for "${term}" 1`,
      `Result for "${term}" 2`,
      `Result for "${term}" 3`,
    ];
  }
}
