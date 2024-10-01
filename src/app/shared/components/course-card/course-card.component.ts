import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

@Component({
  selector: 'app-course-card',
  templateUrl: './course-card.component.html',
  styleUrls: ['./course-card.component.scss']
})
export class CourseCardComponent implements OnInit {
  @Input() title:string = "";
  @Input() description:string = "";
  @Input() creationDate:Date = new Date();
  @Input() duration:number = 0;
  @Input() authors:string[] = [];
  @Input() editable:boolean = false;

  @Output() clickOnShow = new EventEmitter<void>();

  ngOnInit(): void {
    if(typeof this.creationDate === "string") {
      this.creationDate = new Date(this.creationDate);
    }
  }

  showCourseAction() {
    this.clickOnShow.emit();
  }
}
