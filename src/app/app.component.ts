import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewInit {
  title = 'angular-productive';

  ngAfterViewInit(): void {
    setTimeout(() => {
      const contain = document.querySelector('.content-contain');
      if (contain) {
        document.body.classList.add('vh-height');
      }
    }, 500);
  }
}
