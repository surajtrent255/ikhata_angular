import { Component, EventEmitter, Output, Input } from '@angular/core';
import { bsToAd } from '@sbmdkl/nepali-date-converter';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent {
  @Input() disablePan: boolean = true;
  @Input() disableDate: boolean = true;
  @Input() disableDateBetween: boolean = true;
  @Input() disableMonth: boolean = true;
  @Input() disableFisicalYear: boolean = true;
  @Input() disableCustomerOrSeller: boolean = true;
  @Input() disableBillNo: boolean = true;

  @Output() searchInput = new EventEmitter<any>();

  isPan: boolean = true;
  isDate: boolean = false;
  isDateBetween: boolean = false;
  isMonth: boolean = false;
  isFisicalYear: boolean = false;
  isCustomerOrSellerName: boolean = false;
  isBillNo: boolean = false;

  // to acquire value
  inputPanNo: number = 0;
  inputCustomerOrSellerName: string = '';
  inputBillNo: string = '';
  inputMonth: number = 0;
  inputFiscalYear: number = 0;

  constructor() {}

  ngOnInit() {}

  onSelectChange(selectedData: any) {
    if (selectedData === 'pan') {
      this.isPan = true;
    } else {
      this.isPan = false;
    }
    if (selectedData === 'date') {
      this.isDate = true;
    } else {
      this.isDate = false;
    }

    if (selectedData === 'dateBetween') {
      this.isDateBetween = true;
    } else {
      this.isDateBetween = false;
    }

    if (selectedData === 'month') {
      this.isMonth = true;
    } else {
      this.isMonth = false;
    }

    if (selectedData === 'fiscal') {
      this.isFisicalYear = true;
    } else {
      this.isFisicalYear = false;
    }

    if (selectedData === 'name') {
      this.isCustomerOrSellerName = true;
    } else {
      this.isCustomerOrSellerName = false;
    }

    if (selectedData === 'billNo') {
      this.isBillNo = true;
    } else {
      this.isBillNo = false;
    }
  }

  Search() {
    if (this.isPan) {
      const data = { searchBy: 'pan', value: this.inputPanNo };
      this.searchInput.emit(data);
    }
    if (this.isDate) {
      const date = document.getElementById(
        'nepali-datepicker3'
      ) as HTMLInputElement;
      const inputDate = date.value;
      if (inputDate !== '' && inputDate !== null && inputDate.length !== 0) {
        const data = { searchBy: 'date', value: bsToAd(inputDate) };
        this.searchInput.emit(data);
      } else {
        const data = { searchBy: 'date', value: '' };
        this.searchInput.emit(data);
      }
    }

    if (this.isDateBetween) {
      const sDate = document.getElementById(
        'nepali-datepicker1'
      ) as HTMLInputElement;
      const startDate = sDate.value;

      const eDate = document.getElementById(
        'nepali-datepicker2'
      ) as HTMLInputElement;
      const enddate = eDate.value;

      if (
        startDate !== '' &&
        startDate !== null &&
        startDate.length !== 0 &&
        enddate !== '' &&
        enddate !== null &&
        enddate.length !== 0
      ) {
        const data = {
          searchBy: 'dateBetween',
          value: bsToAd(startDate) + ' ' + bsToAd(enddate),
        };
        this.searchInput.emit(data);
      } else {
        const data = {
          searchBy: 'dateBetween',
          value: '',
        };
        this.searchInput.emit(data);
      }
    }

    if (this.isBillNo) {
      const data = { searchBy: 'billNo', value: this.inputBillNo };
      this.searchInput.emit(data);
    }

    if (this.isCustomerOrSellerName) {
      const data = {
        searchBy: 'customerOrSellerName',
        value: this.inputCustomerOrSellerName,
      };
      this.searchInput.emit(data);
    }

    if (this.isMonth) {
      const data = {
        searchBy: 'month',
        value: this.inputMonth,
      };
      this.searchInput.emit(data);
    }

    if (this.isFisicalYear) {
      const data = {
        searchBy: 'fiscalYear',
        value: this.inputFiscalYear,
      };
      this.searchInput.emit(data);
    }
  }

  clearSearch() {
    const data = {
      searchBy: 'clear',
      value: '',
    };
    this.searchInput.emit(data);
  }
}
