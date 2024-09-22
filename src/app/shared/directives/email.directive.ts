import { Directive } from "@angular/core";
import { NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from "@angular/forms";

@Directive({
    selector: '[emailValidator]',
    providers: [/*Add your code here*/
        {
            provide: NG_VALIDATORS,
            useExisting: EmailValidatorDirective,
            multi: true,
        },
    ]
})
export class EmailValidatorDirective implements Validator {
    // Add your code here
    validate(control: AbstractControl): ValidationErrors | null {
        if(!control.value) {
            return null;
        }
        
        let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        let valid = emailRegex.test(control.value);
        
        return valid ? null : { invalidEmail: true };
      }
}