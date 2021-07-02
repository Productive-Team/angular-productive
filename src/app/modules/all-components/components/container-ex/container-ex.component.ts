import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-container-ex',
  templateUrl: './container-ex.component.html',
  styleUrls: ['./container-ex.component.css'],
})
export class ContainerExComponent implements OnInit {
  numb: number;

  dateStr: string;

  loading = false;

  isShow = false;

  tableContent = [
    {
      content: 'Chocolate',
      desc: 'Sweet',
      pho: '$1.00',
      id: 3,
      selected: false,
    },
    {
      content: 'Coke',
      desc: 'Beverage',
      pho: '$2.00',
      id: 2,
      selected: false,
    },
    {
      content: 'Rice',
      desc: 'Grain',
      pho: '$5.00',
      id: 1,
      selected: false,
    },
    {
      content: 'Meat',
      desc: 'Red Meat',
      selected: false,
      id: 5,
      pho: '$4.99',
    },
    {
      content: 'Chicken',
      desc: 'Chicken Meat',
      id: 4,
      selected: false,
      pho: '$1.99',
    },
    {
      content: 'Tomato',
      desc: 'Fruit',
      pho: '$0.50',
      id: 6,
      selected: false,
    },
  ];

  completed: boolean;

  constructor() {}

  ngOnInit() {}

  completes() {
    this.completed = this.tableContent.every((t) => t.selected);
  }

  someCompleted(): boolean {
    return (
      this.tableContent.filter((x) => x.selected).length > 0 && !this.completed
    );
  }

  setAll(event): void {
    this.completed = event;
    this.tableContent.forEach((x) => {
      x.selected = event;
    });
  }

  consos() {
    console.log(this.tableContent);
  }
}
