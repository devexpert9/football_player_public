import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';
import { ToastController} from '@ionic/angular';
import { config} from '../../config';

import 'rxjs/add/operator/map';
import { map } from "rxjs/operators";
import { HttpHeaders,HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  url:any = config.API_URL;
  constructor(private HttpClient:HttpClient) { }

  post(endpoint,data,headers){
    
   return this.HttpClient.post(this.url+endpoint,data).map((responseData) => {
   return responseData;
  // console.log('yes');
  }, error => {
  console.log(error);
  });
  }
}
