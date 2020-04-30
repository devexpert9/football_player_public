import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-previous-matchdetails',
  templateUrl: './previous-matchdetails.page.html',
  styleUrls: ['./previous-matchdetails.page.scss'],
})
export class PreviousMatchdetailsPage implements OnInit {
  title="Club 1 Vs Club 2";
  presentModal:any;
  constructor() { }

  ngOnInit() {
  }

}
