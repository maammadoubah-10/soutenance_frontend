import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Check if control value is inferior to date in parameter
 * @export
 */
export function minDateValidator(minDate: Date): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    // parse control value to Date
    const date = new Date(control.value);
    // check if control value is superior to date given in parameter
    if (minDate.getTime() < date.getTime()) {
      return null;
    } else {
      // return { min: { value: control.value, expected: minDate } };
      return { min: true };
    }
  };
}

export function getDirtyValues(form: any) {
  let dirtyValues: { [key: string]: any } = {};

  Object.keys(form.controls).forEach((key) => {
    let currentControl = form.controls[key];
    if (currentControl.dirty) {
      if (currentControl.controls)
        dirtyValues[key] = getDirtyValues(currentControl);
      else dirtyValues[key] = currentControl.value;
    }
  });

  return dirtyValues;
}
