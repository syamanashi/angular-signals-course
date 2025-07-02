import {
  afterNextRender,
  Component,
  computed,
  effect,
  EffectRef,
  ElementRef,
  inject,
  Injector,
  signal,
  viewChild,
} from '@angular/core';
import { CoursesService } from '../services/courses.service';
import { Course, sortCoursesBySeqNo } from '../models/course.model';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { MatTooltip } from '@angular/material/tooltip';
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
import { openEditCourseDialog } from '../edit-course-dialog/edit-course-dialog.component';
import { LoadingService } from '../loading/loading.service';

@Component({
  selector: 'home',
  imports: [MatTabGroup, MatTab, CoursesCardListComponent, MatTooltip],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone: true,
})
export class HomeComponent {
  #courses = signal<Course[]>([]);

  coursesService = inject(CoursesService); // Preferred approach over contructor styled injection.
  // coursesService = inject(CoursesServiceWithFetch); // Preferred approach over contructor styled injection.

  dialog = inject(MatDialog);

  beginnerCourses = computed(() => {
    const courses = this.#courses();
    return courses.filter((course) => course.category === 'BEGINNER');
  });
  advancedCourses = computed(() => {
    const courses = this.#courses();
    return courses.filter((course) => course.category === 'ADVANCED');
  });

  messagesService = inject(MessagesService);

  beginnersList = viewChild<CoursesCardListComponent>('beginnersList');
  beginnersListElementRef = viewChild('beginnersList', {
    read: ElementRef,
  });
  beginnersListTooltipDirectiveRef = viewChild('beginnersList', {
    read: MatTooltip,
  });

  // courses$ = toObservable(this.#courses);

  constructor() {
    // this.courses$.subscribe((courses) => console.log(`>>> courses$`, courses));

    effect(() => {
      console.log(`beginnersList`, this.beginnersList());
      console.log(`beginnersListElementRef`, this.beginnersListElementRef());
      console.log(
        `beginnersListTooltipDirectiveRef`,
        this.beginnersListTooltipDirectiveRef()
      );
    });

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
      console.error(err);
      this.messagesService.showMessage(`Error loading courses!`, 'error');
    }
  }

  onCourseUpdated(updatedCourse: Course) {
    const courses = this.#courses();
    const newCourses = courses.map((course) =>
      course.id === updatedCourse.id ? updatedCourse : course
    );
    this.#courses.set(newCourses);
  }

  async onCourseDeleted(courseId: string) {
    try {
      await this.coursesService.deleteCourse(courseId);
      const courses = this.#courses();
      const newCourses = courses.filter((course) => course.id !== courseId);
      this.#courses.set(newCourses);
    } catch (err) {
      console.error(err);
      this.messagesService.showMessage(`Error deleting course!`, 'error');
    }
  }

  async onAddCourse() {
    const newCourse = await openEditCourseDialog(this.dialog, {
      mode: 'create',
      title: 'Create New Course',
    });

    if (!newCourse) {
      return;
    }

    const newCourses: Course[] = [...this.#courses(), newCourse];
    this.#courses.set(newCourses);
  }

  injector = inject(Injector);

  onToObservableExample() {
    // const courses$ = toObservable(this.#courses, {
    //   injector: this.injector,
    // });
    // courses$.subscribe((courses) => console.log(`>>> courses$`, courses));

    const numbers = signal(0);
    numbers.set(1);
    numbers.set(2);
    numbers.set(3);

    const numbers$ = toObservable(numbers, {
      injector: this.injector,
    });
    numbers.set(4);

    numbers$.subscribe((val) => {
      console.log('val', val);
    });

    numbers.set(5);

    setTimeout(() => {
      numbers.set(6);
      numbers.set(7);
    }, 0);
    setTimeout(() => {
      numbers.set(8);
    }, 0);
  }
}
