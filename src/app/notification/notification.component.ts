  import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

  @Component({
    selector: 'app-notification',
    templateUrl: './notification.component.html'
  })
  export class NotificationComponent implements OnInit {

    @Input() show = false
    @Input() msg = "This a notification message"
    @Input() value = ""

    constructor() { }

    ngOnInit(): void {
    }

    ngOnChanges(changes: SimpleChanges) {
      if (changes.show) {
        setTimeout(() => {
          this.show = false;
        }, 3000)
      }
    }

  }