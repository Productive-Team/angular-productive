import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { Component, OnInit } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-all-components',
  templateUrl: './all-components.component.html',
  styleUrls: ['./all-components.component.css'],
})
export class AllComponentsComponent implements OnInit {
  routes = [
    {
      route: 'Buttons',
      name: 'Buttons',
    },
    {
      route: 'Containers',
      name: 'Containers',
    },
    {
      route: 'Grid',
      name: 'Grid',
    },
    {
      route: 'Cards',
      name: 'Cards',
    },
    {
      route: 'Ripple',
      name: 'Ripple',
    },
    {
      route: 'Checkbox',
      name: 'Checkbox',
    },
    {
      route: 'Switch',
      name: 'Switch Toggle',
    },
    {
      route: 'Fieldset',
      name: 'Fieldset',
    },
    {
      route: 'Footer',
      name: 'Footer',
    },
    {
      route: 'Modal',
      name: 'Modal',
    },
    {
      route: 'Snackbar',
      name: 'Snackbar',
    },
    {
      route: 'Menu',
      name: 'Menu',
    },
    {
      route: 'Badges',
      name: 'Badges',
    },
    {
      route: 'Tooltips',
      name: 'Tooltips',
    },
    {
      route: 'Select',
      name: 'Select',
    },
    {
      route: 'Radio',
      name: 'Radio Button',
    },
    {
      route: 'Section',
      name: 'Section',
    },
    {
      route: 'Datepicker',
      name: 'Datepicker',
    },
    {
      route: 'Icons',
      name: 'Icons',
    },
    {
      route: 'Collapsible',
      name: 'Collapsible',
    },
    {
      route: 'Tabs',
      name: 'Tabs',
    },
    {
      route: 'Spinner',
      name: 'Progress Spinner',
    },
    {
      route: 'Bar',
      name: 'Progress Bar',
    },
    {
      route: 'Table',
      name: 'Table',
    },
    {
      route: 'Sidenav',
      name: 'Sidenav',
    },
    {
      route: 'Topnav',
      name: 'Topnav',
    },
  ];

  sectionName: string;

  constructor(private snackbar: SnackbarService, private router: Router) {
    this.router.events.subscribe((x) => {
      if (x instanceof ActivationEnd) {
        const route = this.router.url.split('/');
        if (route[2] === undefined) {
          this.sectionName = 'Components';
        } else {
          this.sectionName = route[2];
        }
      }
    });
  }

  ngOnInit() {
    // tslint:disable-next-line: no-shadowed-variable
    this.routes.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
  }
}
