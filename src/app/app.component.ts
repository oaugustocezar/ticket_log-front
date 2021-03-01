import { Component } from '@angular/core';
import { CidadeService } from './shared/cidade.service';
import { Notification } from './shared/notification.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Ticket Log';
  notification = new Notification();

  constructor(private cidadeService: CidadeService) {}

  ngOnInit(): void {
    this.cidadeService.savedCidade.subscribe((notification: Notification) => {
      this.notification = notification;
    });
    this.cidadeService.deletedCidade.subscribe((notification: Notification) => {
      this.notification = notification;            
    });
  }
}
