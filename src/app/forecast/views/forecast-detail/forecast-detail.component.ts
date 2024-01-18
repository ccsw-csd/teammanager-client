import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Group } from 'src/app/group/models/Group';

@Component({
  selector: 'app-forecast-detail',
  templateUrl: './forecast-detail.component.html',
  styleUrls: ['./forecast-detail.component.scss']
})
export class ForecastDetailComponent implements OnInit {

  group: Group;
  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.group = JSON.parse(params['group']);
    });
  }
}
