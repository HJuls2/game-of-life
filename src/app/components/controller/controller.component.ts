import { GridComponent } from '../grid/grid.component';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-controller',
  templateUrl: './controller.component.html',
  styleUrls: ['./controller.component.scss']
})
export class ControllerComponent implements OnInit {

  @Input() grid: GridComponent;

  constructor() { }

  ngOnInit(): void {
  }

}
