import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '@app/auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent {
  @ViewChild("loginForm") public loginForm!: NgForm;
  //Use the names `email` and `password` for form controls.
  email = "";
  password = "";

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(event: Event) {
    event.preventDefault();
    console.log("Login form submitted.");

    if(this.loginForm.valid) {
      let user = {
        email: this.email,
        password: this.password
      };

      this.authService.login(user).subscribe({
        next: (res) => {
          if(res.successful) {
            this.router.navigate(['/courses']);
          }
          else {
            console.error("Login failed.", res);
          }
        },
        error: (error) => {
          console.error("An error occurred.", error);
        }
      });
    }
  }
}