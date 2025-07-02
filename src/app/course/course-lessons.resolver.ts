import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { Lesson } from '../models/lesson.model';
import { inject } from '@angular/core';
import { LessonsService } from '../services/lessons.service';

export const courseLessonsResolver: ResolveFn<Lesson[]> = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const courseId = route.paramMap.get('courseId');
  if (!courseId) {
    return [];
  }

  const lessonsSerivce = inject(LessonsService);

  return lessonsSerivce.loadLessons({ courseId });
};
