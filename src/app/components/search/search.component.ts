import { Component } from '@angular/core';
import { delay, finalize, fromEvent, of, tap } from 'rxjs';
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

  ngOnInit() {
    const searchInput = document.getElementById('search') as HTMLInputElement;

    fromEvent(searchInput, 'input')
      .pipe(
        map((event: Event) => (event.target as HTMLInputElement).value),
        debounceTime(300),
        filter((value: string) => value.length > 2),
        tap(() => (this.loading = true)),
        switchMap((term: string) =>
          of(this.fakeApiCall(term)).pipe(
            delay(500),
            finalize(() => (this.loading = false))
          )
        )
      )
      .subscribe((results: string[]) => {
        this.searchResults = results;
      });
  }

  fakeApiCall(term: string): string[] {
    return [
      `Result for "${term}" 1`,
      `Result for "${term}" 2`,
      `Result for "${term}" 3`,
    ];
  }
}
