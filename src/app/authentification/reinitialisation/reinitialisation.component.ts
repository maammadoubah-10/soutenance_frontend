import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {DataStateEnum} from "../../state/state";
import {AsyncPipe, NgClass, NgIf, NgSwitch, NgSwitchCase} from "@angular/common";
import {Observable} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {catchError, map, startWith} from "rxjs/operators";
import {AuthentificationService} from "../services/authentication.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-reinitialisation',
  standalone: true,
  imports: [
    NgSwitch,
    AsyncPipe,
    NgSwitchCase,
    NgIf,
    ReactiveFormsModule,
    NgClass
  ],
  templateUrl: './reinitialisation.component.html',
  styleUrl: './reinitialisation.component.scss'
})
export class ReinitialisationComponent implements OnInit , AfterViewInit{
  showPassword !: boolean;
  showConfirmPassword !: boolean;
  utilise! : boolean;
  motDePasseToken : any;

  resetForm!: FormGroup;
  dataStateEnum = DataStateEnum;
  response !: Observable<any>;
  pattern = "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$";


  // set the currenr year
  year: number = new Date().getFullYear();

  // tslint:disable-next-line: max-line-length
  constructor(private formBuilder: FormBuilder, private authenticationService: AuthentificationService, private route: ActivatedRoute , private router: Router ) { }

  ngOnInit() {
    //this.route.params.subscribe( params => alert(params.token) );
    this.resetForm = this.formBuilder.group({
      motdepasse: ['', [Validators.required, Validators.pattern(this.pattern)]],
      confirmationdemotdepasse: ['', [Validators.required, Validators.pattern(this.pattern)]],
    });
    this.verificationdujetondemotdepasse();
  }

  verificationdujetondemotdepasse() {
    let token: string;
    this.route.params.subscribe(params => {
      token = params['token'];
      this.authenticationService.verifierLeJeton(token).subscribe(x => {
        this.motDePasseToken = x;
      });
    });
  }

  ngAfterViewInit() {
  }

  // convenience getter for easy access to form fields
  //get$ f() { return this.resetForm.controls; }


  onReinitialiseLeMotDePasse() {
    const { motdepasse, confirmationdemotdepasse } = this.resetForm.value;
    let token: string;
    this.route.params.subscribe(params => {
      token = params['token'];
      this.response = this.authenticationService.reinitialiseLeMotDePasse(motdepasse, confirmationdemotdepasse, token).pipe(
        map(data => {
          this.resetForm.reset();
          this.utilise = true;
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
    });
  }
}
