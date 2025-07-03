import {
  Component,
  effect,
  inject,
  resource,
  ResourceRef,
  signal,
} from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { environment } from '../../environments/environment';
import { Lesson } from '../models/lesson.model';

@Component({
  selector: 'resource-demo',
  templateUrl: './resource-demo.component.html',
  styleUrls: ['./resource-demo.component.scss'],
  imports: [MatProgressSpinner],
})
export class ResourceDemoComponent {
  env = environment;

  search = signal<string>('');

  lessons: ResourceRef<Lesson[]> = resource<Lesson[], { searchValue: string }>({
    request: () => ({
      searchValue: this.search(),
    }),
    loader: async ({ request, abortSignal }) => {
      // destructures request value(s) passed in.
      const response = await fetch(
        `${this.env.apiRoot}/search-lessons?query=${request.searchValue}&courseId=18`,
        {
          signal: abortSignal, // not an angular signal, just the 'signal' api of the fetch method for aborting previous requests.
        }
      );
      const json = await response.json();
      return json.lessons; // lessons property in the response json.
    },
  });

  constructor() {
    effect(() => {
      console.log('searching lessons:', this.search());
    });
  }

  searchLessons(search: string) {
    this.search.set(search);
  }

  reset() {}

  reload() {}
}
