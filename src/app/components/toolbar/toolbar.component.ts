import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  @Input() title: string;
  @Input() align: string;

  constructor() { }

  ngOnInit(): void {
    if (!this.align ){
      this.align = 'left';
    }
  }

}
