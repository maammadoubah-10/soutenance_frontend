import {AfterViewInit, Component, OnInit} from '@angular/core';
import {DataStateEnum} from "../../state/state";
import {HttpErrorResponse} from "@angular/common/http";
import {catchError, map, startWith} from "rxjs/operators";
import {AuthentificationService} from "../services/authentication.service";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Observable} from "rxjs";
import {AsyncPipe, NgClass, NgIf, NgSwitch, NgSwitchCase} from "@angular/common";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-motdepassoublie',
  standalone: true,
  imports: [
    AsyncPipe,
    NgSwitch,
    NgClass,
    ReactiveFormsModule,
    NgSwitchCase,
    NgIf,
    RouterLink
  ],
  templateUrl: './motdepassoublie.component.html',
  styleUrl: './motdepassoublie.component.scss'
})
export class MotdepasseoublieComponent implements OnInit {

  resetForm!: FormGroup;
  dataStateEnum = DataStateEnum;
  response !: Observable<any>;

  constructor(private formBuilder: FormBuilder, private authenticationService: AuthentificationService) {
  }

  // set the currenr year
  year: number = new Date().getFullYear();

  // tslint:disable-next-line: max-line-length
  ngOnInit() {
    this.resetForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngAfterViewInit() {
  }

  onReinitialiseLeMotDePasse() {
  if (this.resetForm.invalid) return;

  const payload = {
    email: this.resetForm.get('email')?.value
  };

  this.response = this.authenticationService.motdepasseoublie(payload).pipe(
    map(data => {
      this.resetForm.reset();
      return {
        dataState: DataStateEnum.CHARGE,
        data: data,
      };
    }),
    startWith({ dataState: DataStateEnum.CHARGEMENT }),
    catchError((error: HttpErrorResponse) => {
      return this.authenticationService.gestionnaireDerreur(error);
    }),
  );
}

}
