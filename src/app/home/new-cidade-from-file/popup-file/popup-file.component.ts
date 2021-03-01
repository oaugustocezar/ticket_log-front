import { Component, Input, OnInit } from '@angular/core';
import { Estado } from 'src/app/shared/estado.model';

@Component({
  selector: 'app-popup-file',
  templateUrl: './popup-file.component.html',
})
export class PopupFileComponent implements OnInit {
  @Input() data: Estado | undefined;
  constructor() { }

  ngOnInit(): void {
  }

}
