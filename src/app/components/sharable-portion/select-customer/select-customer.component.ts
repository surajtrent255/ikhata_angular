import { style } from '@angular/animations';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { ToastrService } from 'ngx-toastr';
import { CustomerMetaData } from 'src/app/models/CustomerMetaData';
import { CommonService } from 'src/app/service/shared/common/common.service';

@Component({
  selector: 'app-select-customer',
  templateUrl: './select-customer.component.html',
  styleUrls: ['./select-customer.component.css'],
})
export class SelectCustomerComponent {
  @Input() toggleSelectCustomer!: boolean;
  @Output() emitToReset = new EventEmitter<boolean>(false);
  @Input() customerMetaData: CustomerMetaData = new CustomerMetaData();
  @Output() compIdEvent = new EventEmitter<number>();
  @Output() destroySelectCustomerEvent = new EventEmitter<boolean>(false);
  @Input() title!: string;

  @ViewChild('selectedCustomerBtn', { static: false })
  selectCompanyCustOrSth!: ElementRef;
  @ViewChild('createCustomerBtn')
  createCustomerBtn!: ElementRef;

  @ViewChild(`donotCreateCustomerBtn`)
  dontCreateCustomerBtn!: ElementRef;
  showableALertPopup: boolean = true;

  @ViewChild(`yesPopup`, { static: false }) yesPopUpBtn!: ElementRef;
  @ViewChild(`noPopup`, { static: false }) noPopUpBtn!: ElementRef;

  @Output() destroySelectCompEmitter = new EventEmitter<boolean>(false);
  @Output() fetchCustomerEventEmitter = new EventEmitter<number>();

  // @Output() initCreateCustomer = new EventEmitter<boolean>(false);

  displayCreateCustomerPopup: boolean = false;
  background: boolean = true;

  constructor(
    private toastrService: ToastrService,
    private renderer: Renderer2,
    private el: ElementRef,
    public ngxSmartModalService: NgxSmartModalService,
    public commonService: CommonService
  ) { }

  ngOnInit() {

  }

  ngOnChanges() {


    setTimeout(() => {

      if(this.customerMetaData?.customers?.length! > 0){
        if (this.selectCompanyCustOrSth)
        this.selectCompanyCustOrSth?.nativeElement.focus();
      }  else {
        this.createCustomerBtn?.nativeElement.focus();

      }
    }, 800);

  }

  ngAfterViewInit() {
    this.commonService.enableDragging('createCustomerPopupNew', 'createcustomerPopUpId');

    // setTimeout(() => {
    //   if (this.createCustomerBtn) {
    //     this.createCustomerBtn.nativeElement.focus();
    //   }
    // });
  }

  setCompanyId(id: number) {
    this.compIdEvent.emit(id);
    // this.ngxSmartModalService.getModal('selectCustomer').close();

    // const closeCustomerPopUpEl = document.getElementById(
    //   'closeSelectCustYN'
    // ) as HTMLAnchorElement;
    // closeCustomerPopUpEl.click();
  }

  onButtonKeyUp(event: KeyboardEvent, compId: number) {
    if (event.key === 'Enter') {
      this.setCompanyId(compId);
    }
  }

  onButtonKeyUpForDispalyAddCustomerPopup(event: KeyboardEvent) {
    const eventInputTarget = event.target as HTMLInputElement;
    if (eventInputTarget.name === 'createCustDecs') {
      if (eventInputTarget.value === '1') {
        if (event.key === 'Enter') {
          // this.showableALertPopup = false;
          // this.ngxSmartModalService.getModal('selectCustomer').close();
          this.displayAddCustomerPopup();
          // this.destroySelectCompEmitter.emit(true);

        }
      } else {
        if (event.key === 'Enter') {
          this.destroySelectCustomer();
        }
      }
    }
  }

  alertYes() {
    // this.showableALertPopup = false;
    // this.ngxSmartModalService.getModal('selectCustomer').close();
    this.destroySelectCustomer();
    this.displayAddCustomerPopup();
  }

  alertNo() {
    this.destroySelectCustomer();
  }

  destroySelectCustomer() {
    // this.ngxSmartModalService.getModal('selectCustomer').close();
    this.destroySelectCompEmitter.emit(true);
  }

  displayAddCustomerPopup() {
    this.background = false;

    this.displayCreateCustomerPopup = true;
    this.ngxSmartModalService.getModal("createCustomerPopupNew").open();
    setTimeout(() => {
      const elements: HTMLCollectionOf<Element> =
        document.getElementsByClassName('nsm-overlay-open');
        // nsm-dialog  nsm-overlay-open
      if (elements) {
        const element = elements[1] as HTMLElement;
        element.style.width = 'fit-content';
        element.style.height= 'fit-content';
      }

      const nsmContents: HTMLCollectionOf<Element> = document.getElementsByClassName('nsm-content');
      if(nsmContents){
        const nsmContent = nsmContents[1] as HTMLElement;
        nsmContent.style.margin = "0";
      }
    },0);

  }

  customerAdded($event) {
    this.displayCreateCustomerPopup = false;
    this.toastrService.success('Customer Has been added ');
    this.fetchCustomerEventEmitter.emit($event);
    this.destroySelectCompEmitter.emit(true);
  }

  destroyCreateCustomerComp($event: boolean) {
    if ($event === true) {
      this.displayCreateCustomerPopup = false;
      this.showableALertPopup = true;
    }
    this.destroySelectCompEmitter.emit(true);
  }
}
