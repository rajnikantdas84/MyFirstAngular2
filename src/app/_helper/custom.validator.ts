import { AbstractControl, ValidationErrors } from '@angular/forms';

export class CustomValidators {
    cannotContainSpace(control: AbstractControl) : ValidationErrors | null {
        if ((control.value as string).indexOf(' ') >= 0)
            return{ cannotContainSpace: true };

        return null;

    }
    MatchPassword(AC: AbstractControl) {
       let password = AC.get('password').value; // to get value in input tag
       let confirmPassword = AC.get('confirmpassword').value; // to get value in input tag
        if(password != confirmPassword) {
            console.log('false');
            AC.get('confirmpassword').setErrors( {MatchPassword: true} )
        } else {
            return null
        }
    }    
}