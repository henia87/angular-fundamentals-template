import { Component } from '@angular/core';
import { faTrashCan, faPencil } from '@fortawesome/free-solid-svg-icons';

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
}