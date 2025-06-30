import {
  Component,
  computed,
  effect,
  inject,
  Injector,
  signal,
} from '@angular/core';
import { CoursesService } from '../services/courses.service';
import { Course, sortCoursesBySeqNo } from '../models/course.model';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { CoursesCardListComponent } from '../courses-card-list/courses-card-list.component';
import { MatDialog } from '@angular/material/dialog';
import { MessagesService } from '../messages/messages.service';
import { catchError, from, throwError } from 'rxjs';
import {
  toObservable,
  toSignal,
  outputToObservable,
  outputFromObservable,
} from '@angular/core/rxjs-interop';

@Component({
  selector: 'home',
  imports: [MatTabGroup, MatTab, CoursesCardListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone: true,
})
export class HomeComponent {
  // Source Signal:
  counter = signal(0);

  // Computed Signal (always read-only):
  tenXCounter = computed(() => {
    const val = this.counter();
    return val * 10;
  });

  // Computed Signal (always read-only):
  hundredXCounter = computed(() => {
    const val = this.tenXCounter();
    return val * 10;
  });

  constructor() {
    // Use effects *very sparingly* as it easily becomes unweidly to address bugs => NEVER USE FOR CRUD DATABASE OPERATIONS.
    effect(() => {
      console.log(
        `counter value:: ${this.counter()} (100x: ${this.hundredXCounter()})`
      );
    });
  }

  increment() {
    this.counter.update((val) => val + 1);
  }
}
