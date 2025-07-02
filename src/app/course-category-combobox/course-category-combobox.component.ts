import {
  Component,
  contentChild,
  effect,
  ElementRef,
  input,
  model,
} from '@angular/core';
import { CourseCategory } from '../models/course-category.model';

@Component({
  selector: 'course-category-combobox',
  standalone: true,
  imports: [],
  templateUrl: './course-category-combobox.component.html',
  styleUrl: './course-category-combobox.component.scss',
})
export class CourseCategoryComboboxComponent {
  // label = input.required<string>(); // required input (readonly)

  value = model.required<CourseCategory>(); // model input (writeable)... should use RARELY when two-way binding is Needed.

  title = contentChild<ElementRef>('title'); // queries content inside the content projection with the template (element) reference #title

  constructor() {
    effect(() => {
      console.log('title:', this.title());
    });
  }

  onCategoryChange(category: string) {
    this.value.set(category as CourseCategory);
  }
}
