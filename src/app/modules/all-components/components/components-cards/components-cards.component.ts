import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-components-cards',
  templateUrl: './components-cards.component.html',
  styleUrls: ['./components-cards.component.css'],
})
export class ComponentsCardsComponent implements OnInit {
  routes = [
    {
      route: 'AllEx',
      name: 'Example All',
    },
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

  constructor() {}

  ngOnInit() {
    this.routes.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
  }
}
