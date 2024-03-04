import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styles: [
  ]
})
export class LoginPageComponent {


  constructor(private authService: AuthService){}

  onLogin():void{

    this.authService.login('johnDoe@outlook.com', '123456')
        .subscribe( user => {

          
        } )

  }

}
