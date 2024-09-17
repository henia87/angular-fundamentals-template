import { Component } from '@angular/core';
import { faTrashCan, faPencil } from '@fortawesome/free-solid-svg-icons';
import { mockedCoursesList, mockedAuthorsList } from './shared/mocks/mock';

@Component({
  selector: 'app-root',

  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'courses-app';

  // Header
  loginLogoutButton = "Login";
  
  // Button
  showCourseButton = "Show Course";
  trashIcon = faTrashCan;
  pencilIcon = faPencil;
  
  // Info
  infoTitle = "Your List Is Empty";
  infoText = "Please use 'Add New Course' button to add your first course";
  infoButton = "Add new course";
  
  // Course card
  courses: any[] = [];
  editable = true;

  ngOnInit() {
    this.courses = mockedCoursesList.map(course => ({
      ...course,
      creationDate: new Date(course.creationDate),
      authors: course.authors.map(authorID => {
        let author = mockedAuthorsList.find(author => author.id === authorID);
        return author ? author.name : "No author";
      })
    }));
  }
}