import { Component, input, model } from '@angular/core';
import { CourseCategory } from '../models/course-category.model';

@Component({
  selector: 'course-category-combobox',
  standalone: true,
  imports: [],
  templateUrl: './course-category-combobox.component.html',
  styleUrl: './course-category-combobox.component.scss',
})
export class CourseCategoryComboboxComponent {
  label = input.required<string>(); // required input (readonly)

  value = model.required<CourseCategory>(); // model input (writeable)... should use RARELY when two-way binding is Needed.

  onCategoryChange(category: string) {
    this.value.set(category as CourseCategory);
  }
}
