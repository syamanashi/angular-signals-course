import {
  afterNextRender,
  Component,
  computed,
  effect,
  EffectRef,
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
import { CoursesServiceWithFetch } from '../services/courses-fetch.service';

@Component({
  selector: 'home',
  imports: [MatTabGroup, MatTab, CoursesCardListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone: true,
})
export class HomeComponent {
  #courses = signal<Course[]>([]);

  coursesService = inject(CoursesService); // Preferred approach over contructor styled injection.
  // coursesService = inject(CoursesServiceWithFetch); // Preferred approach over contructor styled injection.

  beginnerCourses = computed(() => {
    const courses = this.#courses();
    return courses.filter((course) => course.category === 'BEGINNER');
  });
  advancedCourses = computed(() => {
    const courses = this.#courses();
    return courses.filter((course) => course.category === 'ADVANCED');
  });

  constructor() {
    effect(() => {
      console.log(`beginner courses: `, this.beginnerCourses());
      console.log(`advanced courses: `, this.advancedCourses());
    });

    this.loadCourses().then(() =>
      console.log(`All courses loaded: `, this.#courses())
    );
  }

  async loadCourses() {
    try {
      const courses = await this.coursesService.loadAllCourses();
      this.#courses.set(courses.sort(sortCoursesBySeqNo));
    } catch (err) {
      alert(`error handling courses`);
      console.error(err);
    }
  }
}
