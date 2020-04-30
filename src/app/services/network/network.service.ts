import { Component, Injectable } from '@angular/core';
import { Platform, Events } from '@ionic/angular';
import { Network } from '@ionic-native/network/ngx';
import { Router } from '@angular/router';
export enum ConnectionStatusEnum {
  Online,
  Offline
}
@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  previousStatus:any;
  constructor(  private platform: Platform,   
    private events:Events,
    private Router:Router,
    private network: Network) { 
      console.log('Hello NetworkProvider Provider');

      this.previousStatus = ConnectionStatusEnum.Online;

    }

    public initializeNetworkEvents(): void {
      this.network.onDisconnect().subscribe(() => {
          if (this.previousStatus === ConnectionStatusEnum.Online) {
              this.events.publish('network:offline');
              console.log('offile');
          }
          this.previousStatus = ConnectionStatusEnum.Offline;
      });
      this.network.onConnect().subscribe(() => {
          if (this.previousStatus === ConnectionStatusEnum.Offline) {
              this.events.publish('network:online');
              console.log('online');
          }
          this.previousStatus = ConnectionStatusEnum.Online;
      });
  }
}
