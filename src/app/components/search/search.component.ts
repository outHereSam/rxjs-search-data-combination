import { Component } from '@angular/core';
import {
  catchError,
  delay,
  finalize,
  fromEvent,
  mergeMap,
  Observable,
  of,
  tap,
  throwError,
} from 'rxjs';
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
        }),
        switchMap((term: string) =>
          this.fakeApiCall(term).pipe(
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
      .subscribe((results: string[]) => {
        this.searchResults = results;
        this.loading = false;
      });
  }

  fakeApiCall(term: string): Observable<string[]> {
    return of([
      `Result for "${term}" 1`,
      `Result for "${term}" 2`,
      `Result for "${term}" 3`,
    ]).pipe(
      delay(500),
      mergeMap((results) => {
        if (Math.random() < 0.3) {
          return throwError(() => new Error('Failed to fetch search results'));
        }
        return of(results);
      })
    );
  }
}
