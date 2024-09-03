import { Component } from '@angular/core';
import { combineLatest, delay, finalize, map, of } from 'rxjs';

@Component({
  selector: 'app-data-combination',
  standalone: true,
  imports: [],
  templateUrl: './data-combination.component.html',
  styleUrl: './data-combination.component.css',
})
export class DataCombinationComponent {
  combinedData: { user: any; posts: string[] } | null = null;
  loadingUserDetails = true;
  loadingUserPosts = true;

  ngOnInit() {
    // Simulating user details api endpoint
    const userDetails$ = of({
      id: 1,
      name: 'Thomas Jensen',
      email: 'thomas@jensen.com',
    }).pipe(
      delay(1000),
      finalize(() => (this.loadingUserDetails = false))
    );

    // Simulating user posts api endpoint
    const userPosts$ = of([
      'Post 1: I love Angular!',
      'Post 2: RxJS is fun',
      "Post 3: What's the point of combineLatest?",
    ]).pipe(
      delay(1500),
      finalize(() => (this.loadingUserPosts = false))
    );

    // Combine the latest emissions from both observables
    combineLatest([userDetails$, userPosts$])
      .pipe(
        // Transform the combined data into a usable format
        map(([user, posts]) => ({ user, posts }))
      )
      .subscribe((combinedData) => (this.combinedData = combinedData));
  }
}
