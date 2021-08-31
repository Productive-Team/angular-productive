import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormControlName,
  FormControl,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-container-ex',
  templateUrl: './container-ex.component.html',
  styleUrls: ['./container-ex.component.css'],
})
export class ContainerExComponent implements OnInit {
  numb = 36;

  inv = false;

  selec = 'val1';
  ses = false;

  dateStr: string;

  sas = 'determinate';

  loading = false;

  isShow = false;

  tableContent = [
    {
      content: 'Chocolate',
      desc: 'Sweet',
      pho: 1.0,
      id: 3,
      selected: false,
    },
    {
      content: 'Coke',
      desc: 'Beverage',
      pho: 2.0,
      id: 2,
      selected: false,
    },
    {
      content: 'Rice',
      desc: 'Grain',
      pho: 5.0,
      id: 1,
      selected: false,
    },
    {
      content: 'Meat',
      desc: 'Red Meat',
      selected: false,
      id: 5,
      pho: 4.99,
    },
    {
      content: 'Chicken',
      desc: 'Chicken Meat',
      id: 4,
      selected: false,
      pho: 1.99,
    },
    {
      content: 'Tomato',
      desc: 'Fruit',
      pho: 0.5,
      id: 6,
      selected: false,
    },
  ];

  completed: boolean;

  sel: string;

  pri = 0;

  b = 'cust2';

  fof: FormGroup;

  ts: Test = {
    pass: 'opt6',
    sel: 50,
  };

  optionArr = [
    // {
    //   value: null,
    //   name: '--none--',
    // },
    {
      value: 'opt1',
      name: 'Option 1',
    },
    {
      value: 'opt2',
      name: 'Option 2',
    },
    {
      value: 'opt3',
      name: 'Option 3',
    },
    {
      value: 'opt4',
      name: 'Option 4',
    },
    {
      value: 'opt5',
      name: 'Option 5',
    },
    {
      value: 'opt6',
      name: 'Option 6',
    },
  ];

  variab = 'Delaware';
  vev = '';

  arr = [];

  states: string[] = [
    'Alabama',
    'Alaska',
    'Arizona',
    'Arkansas',
    'California',
    'Colorado',
    'Connecticut',
    'Delaware',
    'Florida',
    'Georgia',
    'Hawaii',
    'Idaho',
    'Illinois',
    'Indiana',
    'Iowa',
    'Kansas',
    'Kentucky',
    'Louisiana',
    'Maine',
    'Maryland',
    'Massachusetts',
    'Michigan',
    'Minnesota',
    'Mississippi',
    'Missouri',
    'Montana',
    'Nebraska',
    'Nevada',
    'New Hampshire',
    'New Jersey',
    'New Mexico',
    'New York',
    'North Carolina',
    'North Dakota',
    'Ohio',
    'Oklahoma',
    'Oregon',
    'Pennsylvania',
    'Rhode Island',
    'South Carolina',
    'South Dakota',
    'Tennessee',
    'Texas',
    'Utah',
    'Vermont',
    'Virginia',
    'Washington',
    'West Virginia',
    'Wisconsin',
    'Wyoming',
  ];

  @ViewChild('select') testComp: any;

  constructor() {}

  ngOnInit() {
    this.fotmini(this.ts);
    this.arr = this.states;
  }

  completes(ev) {
    this.completed = this.tableContent.every((t) => t.selected);
    this.sum(ev);
  }

  someCompleted(): boolean {
    const a = this.tableContent.filter((x) => x.selected).length;
    this.sel = a.toString();
    return (
      this.tableContent.filter((x) => x.selected).length > 0 && !this.completed
    );
  }

  sum(obj): void {
    if (obj.selected) {
      this.pri += obj.pho;
    } else {
      this.pri -= obj.pho;
    }
  }

  setAll(event): void {
    this.completed = event;
    if (event === true) {
      this.pri = 0;
    }
    this.tableContent.forEach((x) => {
      x.selected = event;
      this.sum(x);
    });
  }

  sess(): void {
    const id = 'name';
    const a = document.getElementById(id) as HTMLFormElement;
    console.log(a.elements[id].value);
  }

  fotmini(model: Test) {
    this.fof = new FormGroup({
      pass: new FormControl(model.pass),
      sel: new FormControl(model.sel, Validators.required),
    });
  }

  search(): void {
    if (this.vev.length === 0) {
      this.arr = this.states;
    } else {
      this.arr = this.states.filter((x) =>
        x.toUpperCase().includes(this.vev.toUpperCase())
      );
    }
    setTimeout(() => {
      this.testComp.updateSearch();
    }, 0);
  }
}

export class Test {
  pass: string;
  sel: number;
}
