import { Component } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { adToBs, bsToAd } from '@sbmdkl/nepali-date-converter';
import { ErrorStateMatcher } from '@angular/material/core';
import { MyErrorStateMatcher } from '../utility.module';
import { IrdService } from 'src/app/service/ird.service';
import { TaxFileIrd } from 'src/app/models/TaxFileIrd';
import { ActivatedRoute } from '@angular/router';

declare var NepaliFunctions: any;

@Component({
  selector: 'app-utility-tax-file',
  templateUrl: './utility-tax-file.component.html',
  styleUrls: ['./utility-tax-file.component.css']
})
export class UtilityTaxFileComponent {

  monthOptions = [{ optionValue: 4, optionText: "Shrawan" },
  { optionValue: 5, optionText: "Bhadra" },
  { optionValue: 6, optionText: "Ashoj" },
  { optionValue: 7, optionText: "Kartik" },
  { optionValue: 8, optionText: "Mangsir" },
  { optionValue: 9, optionText: "Poush" },
  { optionValue: 10, optionText: "Magh" },
  { optionValue: 11, optionText: "Falgun" },
  { optionValue: 12, optionText: "Chaitra" },
  { optionValue: 1, optionText: "Baisakh" },
  { optionValue: 2, optionText: "Jestha" },
  { optionValue: 3, optionText: "Ashad" },
  ]

  constructor(private irdService: IrdService,
    private route: ActivatedRoute) { }

  taxFileIrd: TaxFileIrd = new TaxFileIrd;
  showInfoCard: boolean = false;
  fiscalYear: string = '2080/2081';
  selected = new FormControl('quarter', Validators.required);

  monthSelected = new FormControl('month', Validators.required);

  matcher = new MyErrorStateMatcher();

  selectFormControl = new FormControl('valid', [Validators.required]);


  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (Object.keys(params).length !== 0) {
        const fiscalYear = params['fiscalYear'];
        const quarter = params['quarter']
        let quarterStartEndDateEnglish = this.fetchQuarterStartEndDate(quarter);
        let quarterStartDateAd = quarterStartEndDateEnglish.quarterStartDateEnglish;
        let quarterEndDateAd = quarterStartEndDateEnglish.quarterEndDateEnglish;
        this.showInfoCard = true;
        this.irdService.taxFileUtilitySummary(fiscalYear, quarterStartDateAd, quarterEndDateAd).subscribe(res => {
          this.taxFileIrd = res.data;
          this.showInfoCard = true;
          this.selected = new FormControl(quarter, Validators.required);
        })
      }
    })
  }

  calculateCalender() {
    let fiscalYear: string[] = this.fiscalYear.split("/");
    //  alert(fiscalYear[0]);
    //  alert(this.monthSelected.value);
    let month = this.monthSelected.value!;
    let year = '';
    if (parseInt(month) > 3) {
      year = fiscalYear[0];
    } else {
      year = fiscalYear[1];
    }

    var daysInMonth = NepaliFunctions.GetDaysInBsMonth(parseInt(year), parseInt(month));
    let beginDateEnglish = bsToAd(year + "-" + month + "-01");
    let endDateEnglish = bsToAd(year + "-" + month + "-" + daysInMonth);
    // let beginEnglishDate = bsToAd(year+"-"+month+"-01");

    this.irdService.taxFileUtilitySummaryForSpecificMonth(beginDateEnglish, endDateEnglish, this.fiscalYear).subscribe(res => {
      this.taxFileIrd = res.data;
      this.showInfoCard = true;

    })
    // let a = new Date(parseInt(year), parseInt(this.monthSelected.value!), 0).getDate();
    // alert(a);
  }

  fetchData() {

    let quarter: string = this.selected.value!;
    this.setRespectiveMontsforQuarter(quarter);
    let quarterStartEndDateEnglish = this.fetchQuarterStartEndDate(quarter);
    // let quarterEndDateEnglish = this.fetchQuarterStartDate(quarter);
    let quarterStartDateAd = quarterStartEndDateEnglish.quarterStartDateEnglish;
    let quarterEndDateAd = quarterStartEndDateEnglish.quarterEndDateEnglish;
    this.showInfoCard = true;
    this.irdService.taxFileUtilitySummary(this.fiscalYear, quarterStartDateAd, quarterEndDateAd).subscribe(res => {
      this.taxFileIrd = res.data;
    })
  }



  fetchQuarterStartEndDate(quarter: string) {
    let quarterStartDateEnglish;
    let quarterEndDateEnglish;
    let year = "";

    let startMonth;
    let dateBsQuarterStart;
    let endMonth;
    let daysInMonth;
    let dateBsQuarterEnd;

    switch (quarter) {
      case "1":
        year = this.fiscalYear.split("/")[0];

        startMonth = 4;
        dateBsQuarterStart = year + "-" + startMonth + "-01";
        quarterStartDateEnglish = bsToAd(dateBsQuarterStart);

        endMonth = 7;
        daysInMonth = NepaliFunctions.GetDaysInBsMonth(parseInt(year), endMonth);
        dateBsQuarterEnd = `${year}-${endMonth}-${daysInMonth}`;
        quarterEndDateEnglish = bsToAd(dateBsQuarterEnd);

        break;
      case "2":
        year = this.fiscalYear.split("/")[0];

        startMonth = 8;
        dateBsQuarterStart = year + "-" + startMonth + "-01";
        quarterStartDateEnglish = bsToAd(dateBsQuarterStart);

        endMonth = 11;
        daysInMonth = NepaliFunctions.GetDaysInBsMonth(parseInt(year), endMonth);
        dateBsQuarterEnd = `${year}-${endMonth}-${daysInMonth}`;
        quarterEndDateEnglish = bsToAd(dateBsQuarterEnd);

        break;
      case "3":
        year = this.fiscalYear.split("/")[0];

        startMonth = 12;
        dateBsQuarterStart = year + "-" + startMonth + "-01";
        quarterStartDateEnglish = bsToAd(dateBsQuarterStart);

        year = this.fiscalYear.split("/")[1];
        endMonth = 3;
        daysInMonth = NepaliFunctions.GetDaysInBsMonth(parseInt(year), endMonth);
        dateBsQuarterEnd = `${year}-${endMonth}-${daysInMonth}`;
        quarterEndDateEnglish = bsToAd(dateBsQuarterEnd);
        break;

    }
    return { quarterStartDateEnglish: quarterStartDateEnglish, quarterEndDateEnglish: quarterEndDateEnglish };
  }



  setRespectiveMontsforQuarter(quarter: string) {
    switch (quarter) {
      case "1":
        this.monthOptions = [
          { optionValue: 4, optionText: "Shrawan" },
          { optionValue: 5, optionText: "Bhadra" },
          { optionValue: 6, optionText: "Ashoj" },
          { optionValue: 7, optionText: "Kartik" },
        ]
        break;
      case "2":
        this.monthOptions = [
          { optionValue: 8, optionText: "Mangsir" },
          { optionValue: 9, optionText: "Poush" },
          { optionValue: 10, optionText: "Magh" },
          { optionValue: 11, optionText: "Falgun" },]
        break;
      case "3":
        this.monthOptions = [
          { optionValue: 12, optionText: "Chaitra" },
          { optionValue: 1, optionText: "Baisakh" },
          { optionValue: 2, optionText: "Jestha" },
          { optionValue: 3, optionText: "Ashad" },]
        break;
      case "0":
        this.monthOptions = [
          { optionValue: 4, optionText: "Shrawan" },
          { optionValue: 5, optionText: "Bhadra" },
          { optionValue: 6, optionText: "Ashoj" },
          { optionValue: 7, optionText: "Kartik" },
          { optionValue: 8, optionText: "Mangsir" },
          { optionValue: 9, optionText: "Poush" },
          { optionValue: 10, optionText: "Magh" },
          { optionValue: 11, optionText: "Falgun" },
          { optionValue: 12, optionText: "Chaitra" },
          { optionValue: 1, optionText: "Baisakh" },
          { optionValue: 2, optionText: "Jestha" },
          { optionValue: 3, optionText: "Ashad" }
        ]
    }
  }
}
