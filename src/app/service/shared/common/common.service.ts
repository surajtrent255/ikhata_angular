import { ElementRef, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import * as html2pdf from 'html2pdf.js';
import { utils, writeFile } from 'xlsx';
import * as CryptoJS from 'crypto-js';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from 'src/app/constants/urls';
import { RJResponse } from 'src/app/models/rjresponse';
import { FiscalYear } from 'src/app/models/FiscalYear';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  setTheNotification: boolean = false;

  constructor(
    private modal: NgxSmartModalService,
    private httpClient: HttpClient
  ) {}

  months: { value: string; name: string }[] = [
    { value: '01', name: 'Baishak' },
    { value: '02', name: 'Jestha' },
    { value: '03', name: 'Ashadh' },
    { value: '04', name: 'Shrawan' },
    { value: '05', name: 'Bhadra' },
    { value: '06', name: 'Ashwin' },
    { value: '07', name: 'Kartik' },
    { value: '08', name: 'Mangsir' },
    { value: '09', name: 'Poush' },
    { value: '10', name: 'Magh' },
    { value: '11', name: 'Falgun' },
    { value: '12', name: 'Chaitra' },
  ];

  private dataSubject = new BehaviorSubject<any>(null);
  public data$ = this.dataSubject.asObservable();

  setData(data: any) {
    this.dataSubject.next(data);
  }

  clearData() {
    this.dataSubject.next(null);
  }

  // for millisecond to date (UTC Nepal)
  formatDate(timestamp: number): string {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = this.addZeroPadding(date.getMonth() + 1);
    const day = this.addZeroPadding(date.getDate());
    return `${year}-${month}-${day}`;
  }

  addZeroPadding(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }

  // html to pdf conversion
  convertToPdf(elementId: string, fileName: string) {
    const element = document.getElementById(elementId);
    const options = {
      filename: `${fileName}.pdf`,
      margin: [10, 10],
      orientation: 'landscape',
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' },
    };

    html2pdf().set(options).from(element).save();
  }

  // html to Excel conversion
  convertToExcel(elementId: string, fileName: string) {
    const htmlContent = document.getElementById(elementId)?.outerHTML;

    if (htmlContent) {
      const tempTable = document.createElement('table');
      tempTable.innerHTML = htmlContent;

      const worksheet = utils.table_to_sheet(tempTable);
      const workbook = {
        Sheets: { Sheet1: worksheet },
        SheetNames: ['Sheet1'],
      };

      writeFile(workbook, `${fileName}.xlsx`, {
        bookType: 'xlsx',
        type: 'array',
      });
    }
  }

  // for dragable popup
  private popup!: HTMLElement;
  private offsetX!: number;
  private offsetY!: number;
  private initialX!: number;
  private initialY!: number;

  dragablePopUp(popupElement: HTMLElement) {
    this.popup = popupElement;
    const popupHeader = this.popup.querySelector('.popupHeading');
    if (popupHeader) {
      popupHeader.addEventListener('mousedown' as any, this.startDrag);
    }
  }

  startDrag = (e: MouseEvent) => {
    e.preventDefault();
    this.offsetX = e.clientX;
    this.offsetY = e.clientY;
    this.initialX = this.popup.offsetLeft;
    this.initialY = this.popup.offsetTop;
    document.addEventListener('mousemove', this.dragPopup);
    document.addEventListener('mouseup', this.stopDrag);
  };

  dragPopup = (e: MouseEvent) => {
    e.preventDefault();
    const dx = e.clientX - this.offsetX;
    const dy = e.clientY - this.offsetY;
    this.popup.style.left = this.initialX + dx + 'px';
    this.popup.style.top = this.initialY + dy + 'px';
  };

  stopDrag = () => {
    document.removeEventListener('mousemove', this.dragPopup);
    document.removeEventListener('mouseup', this.stopDrag);
  };

  // // Encrypt function
  // encryptObject(obj: any): string {
  //   const jsonString = JSON.stringify(obj);
  //   const encryptedData = CryptoJS.AES.encrypt(
  //     jsonString,
  //     'mySecretKey'
  //   ).toString();
  //   return encryptedData;
  // }

  // // Decrypt function
  // decryptObject(encryptedData: string): any {
  //   const decryptedData = CryptoJS.AES.decrypt(
  //     encryptedData,
  //     'mySecretKey'
  //   ).toString(CryptoJS.enc.Utf8);
  //   const obj = JSON.parse(decryptedData);
  //   return obj;
  // }

  private key = CryptoJS.enc.Utf8.parse(1203199320052021);
  private iv = CryptoJS.enc.Utf8.parse(1203199320052021);

  encryptUsingAES256(data): any {
    const jsonString = JSON.stringify(data);

    var encrypted = CryptoJS.AES.encrypt(jsonString, this.key, {
      keySize: 128 / 8,
      iv: this.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    return encrypted.toString();
  }

  decryptUsingAES256(decString: string) {
    try {
      if (decString !== null) {
        var decrypted = CryptoJS.AES.decrypt(decString, this.key, {
          keySize: 128 / 8,
          iv: this.iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7,
        }).toString(CryptoJS.enc.Utf8);

        const obj = JSON.parse(decrypted);
        return obj;
      }
    } catch (error) {
      console.error('Error during decryption:', error);
      return null;
    }
  }

  /*
  Neplai Month extractor  
  @Param nepaliDate 
  Type String
  */

  getMonthNameBasedOnNepaliDate(nepaliDate: string): any {
    const selectedMonth = this.months.find(
      (month) => month.value === nepaliDate.toString().slice(5, 7)
    );
    if (selectedMonth === null) return;

    return selectedMonth;
  }

  // NGX Smart Modal Draggable code
  pos1 = 0;
  pos2 = 0;
  pos3 = 0;
  pos4 = 0;
  drag = false;
  element: any;

  enableDragging(modal_identifier: string, modal_id: string): void {
    this.modal.get(`${modal_identifier}`).onOpen.subscribe((modal) => {
      setTimeout(() => {
        this.element = document.querySelector(`#${modal_id} .nsm-dialog`);
      });
    });
  }

  dragMouseDown(e) {
    this.drag = true;
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    this.pos3 = e.clientX;
    this.pos4 = e.clientY;
    //document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    //document.onmousemove = elementDrag;
  }

  elementDrag(e) {
    if (this.drag) {
      // this.element = document.querySelector('#modal-to-drag .nsm-dialog');
      // console.log('element drag', e.clientX, e, this.element);
      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      this.pos1 = this.pos3 - e.clientX;
      this.pos2 = this.pos4 - e.clientY;
      this.pos3 = e.clientX;
      this.pos4 = e.clientY;
      // set the element's new position:
      this.element.style.position = 'absolute';
      this.element.style.top = this.element.offsetTop - this.pos2 + 'px';
      this.element.style.left = this.element.offsetLeft - this.pos1 + 'px';
    }
  }
  closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
  }
  clear() {
    //this.element = null;
    this.drag = false;
    document.onmouseup = null;
    document.onmousemove = null;
  }

  handleMouseDown(event: MouseEvent) {
    // Check the event target element or its parent elements
    if (event.target instanceof HTMLElement) {
      const element = event.target as HTMLElement;
      if (!this.isWithinFormElement(element)) {
        this.dragMouseDown(event);
        event.stopPropagation(); // Prevent the event from propagating
      }
    }
  }
  isWithinFormElement(element: HTMLElement): boolean {
    return element.closest('form') !== null;
  }
  
  sendEmail(obj, params): Observable<RJResponse<number>> {
    let url = `${BASE_URL}/utility/sendEmail${params}`;
    return this.httpClient.post<RJResponse<number>>(url, obj);
  }

  getCurrentFiscalYear(): Observable<RJResponse<FiscalYear>> {
    let url = `${BASE_URL}/fiscalYearInfo/active`;
    return this.httpClient.get<RJResponse<FiscalYear>>(url);
  }
}
