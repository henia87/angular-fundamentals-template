import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { EmailValidatorDirective } from '@app/shared/directives/email.directive';

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.scss'],
})
export class RegistrationFormComponent {
  registrationForm!: FormGroup;
  // Use the names `name`, `email`, `password` for the form controls.
  submitted = false;

  constructor(private formBuilder: FormBuilder) {
    this.buildForm();
  }

  buildForm(): void {
    this.registrationForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, this.emailValidator]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  emailValidator(control: AbstractControl): ValidationErrors | null {
    let directive = new EmailValidatorDirective();
    return directive.validate(control);
  }

  get name() {
    return this.registrationForm.get("name")!;
  }
  get email() {
    return this.registrationForm.get("email")!;
  }
  get password() {
    return this.registrationForm.get("password")!;
  }

  onSubmit() {
    this.submitted = true;
  }
}