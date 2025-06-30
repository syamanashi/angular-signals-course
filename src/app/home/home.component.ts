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

type Counter = {
  value: number;
};

@Component({
  selector: 'home',
  imports: [MatTabGroup, MatTab, CoursesCardListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone: true,
})
export class HomeComponent {
  counter = signal<Counter>({
    value: 0,
  });

  increment() {
    // this.counter().value++; // DO NOT DO THIS.  DO NOT MUTATE VALUE OF SIGNAL LIKE THIS AS SIGNAL CHANGE DETECTION WILL FAIL.

    // Updating Signals: always emits a new value and works with signals change detection.
    this.counter.update((counter) => ({
      ...counter, // include a copy of the object
      value: counter.value + 1, // then modify only the properties you intend.  Don't modify the value directly like this.counter.value++. <= Avoid: It will not work with signal change detection.
    }));
  }

  decrement() {
    this.counter.update((counter) => ({
      ...counter,
      value: counter.value - 1,
    }));
  }

  // SIGNALS METHOD 2: WRITEABLE SIGNAL WITH UPDATE
  // counter = signal(0);
  // increment() {
  //   this.counter.update((val) => val + 1);
  // }

  // SIGNALS METHOD 1
  // counter = signal(0);
  // increment() {
  //   this.counter.set(this.counter() + 1);
  // }
  // <!-- <h3>All Courses {{ counter() }}</h3> -->

  // OLD WAY
  // counter = 0;
  // increment() {
  //   this.counter++;
  // }
  // <!-- <h3>All Courses {{ counter }}</h3> -->
}
