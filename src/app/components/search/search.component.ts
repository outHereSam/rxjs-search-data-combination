import { Component } from '@angular/core';
import { delay, fromEvent, of } from 'rxjs';
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

  ngOnInit() {
    const searchInput = document.getElementById('search') as HTMLInputElement;

    fromEvent(searchInput, 'input')
      .pipe(
        map((event: Event) => (event.target as HTMLInputElement).value),
        debounceTime(300),
        filter((value: string) => value.length > 2),
        switchMap((term: string) => of(this.fakeApiCall(term)).pipe(delay(500)))
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
