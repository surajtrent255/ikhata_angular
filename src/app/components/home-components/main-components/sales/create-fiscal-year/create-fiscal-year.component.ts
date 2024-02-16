import { BootstrapOptions, Component, EventEmitter, Output } from '@angular/core';
import { Form, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FiscalYear } from 'src/app/models/FiscalYear';
import { SalesBillServiceService } from 'src/app/service/sales-bill-service.service';


@Component({
  selector: 'app-create-fiscal-year',
  templateUrl: './create-fiscal-year.component.html',
  styleUrls: ['./create-fiscal-year.component.css']
})
export class CreateFiscalYearComponent {

  @Output() destroyCreateFiscalYearComp = new EventEmitter<boolean>(false);
  // fiscalYear: FiscalYear = new FiscalYear;

  constructor(private formBuilder: FormBuilder,
     private salesBillService: SalesBillServiceService,
     private toastrService: ToastrService) { }

  ngOnInit() {
    // Set a higher z-index for the datepicker
  }

  fiscalYearInfoForm = this.formBuilder.group({
    fiscalYear: [null, Validators.required],
    firstQuarterStart: [null, Validators.required],
    firstQuarterEnd: [null, Validators.required],

    secondQuarterStart: [null, Validators.required],
    secondQuarterEnd: [null, Validators.required],

    thirdQuarterStart: [null, Validators.required],
    thirdQuarterEnd: [null, Validators.required],

    fourthQuarterStart: [null, Validators.required],
    fourthQuarterEnd: [null, Validators.required]

  });

  destroyComp() {
    this.destroyCreateFiscalYearComp.emit(false);
  }

  createFiscalYear() {

    const formvalue = this.fiscalYearInfoForm.value;
    let fiscalYear: FiscalYear = new FiscalYear();
    fiscalYear.fiscalYear = formvalue.fiscalYear!;

    fiscalYear.firstQuarterStart = formvalue.firstQuarterStart!;
    fiscalYear.firstQuarterEnd = formvalue.firstQuarterEnd!;

    fiscalYear.secondQuarterStart = formvalue.secondQuarterStart!;
    fiscalYear.secondQuarterEnd = formvalue.secondQuarterEnd!;

    fiscalYear.fiscalYear = formvalue.fiscalYear!;

    fiscalYear.thirdQuarterStart = formvalue.thirdQuarterStart!;
    fiscalYear.thirdQuarterEnd = formvalue.thirdQuarterEnd!;

    this.salesBillService.changeFiscalYear(fiscalYear).subscribe(res=>{
      console.log(res);
      this.fiscalYearInfoForm.reset();
      this.toastrService.success(" Fiscal Year created successfully !!!")
   });
  }

  setCss($event: any) {
    const datepickerElement = document.querySelector('.mat-datepicker-content') as HTMLElement;;
    if (datepickerElement) {
      datepickerElement.style.zIndex = '1001';
    }
    const modalElement = document.querySelector('#createFiscalYearPopup') as HTMLElement;
    if (modalElement) {
      modalElement.style.position = 'relative ';
      modalElement.style.zIndex = '1000';
    }
  }
}
