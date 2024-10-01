import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appTogglePassword]',
  exportAs: 'togglePassword'
})
export class TogglePasswordDirective {
  private isPasswordVisible = false;

  constructor(private element: ElementRef) { }

  togglePassword() {
    this.isPasswordVisible = !this.isPasswordVisible;
    let inputElement: HTMLInputElement = this.element.nativeElement;
    inputElement.type = this.isPasswordVisible ? 'text' : 'password';
  }

  isVisible() {
    return this.isPasswordVisible;
  }
}