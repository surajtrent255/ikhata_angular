import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-alert',
  templateUrl: './confirm-alert.component.html',
  styleUrls: ['./confirm-alert.component.css']
})
export class ConfirmAlertComponent {

  @Output() destroyConfirmAlertSectionEmitter = new EventEmitter<boolean>(false);
  @Input() msg: string = '';

  emitStatus(status: boolean) {
    this.destroyConfirmAlertSectionEmitter.emit(status)
  }

  ngAfterViewInit() {
    this.setCss();
  }

  setCss() {
    const elements: HTMLCollectionOf<Element> =
      document.getElementsByClassName('nsm-dialog');

    if (elements) {
      const element = elements[0] as HTMLElement;
      element.style.maxWidth = 'fit-content';
    }
  }
}
