import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { ModalController, Events } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class TabsauthService implements CanActivate{

  errors:any=['',null,undefined,'null','undefined',0];
  constructor(private router: Router, private events:Events) {
 
  }
  canActivate(route: ActivatedRouteSnapshot): boolean{

    if(this.errors.indexOf(localStorage.getItem('_id'))==-1)
    {

      return true;
     
    }
    else
    { 
      this.router.navigate(['/login']);
    }

}

}
