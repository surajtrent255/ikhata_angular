import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-edit-receipt',
  templateUrl: './edit-receipt.component.html',
  styleUrls: ['./edit-receipt.component.css'],
})
export class EditReceiptComponent {
  @Input() toggleReceiptPopup!: boolean;
  @Output() emitToReset = new EventEmitter<boolean>(false);

  @ViewChild('editReceiptDetailsPopup', { static: true })
  togglePopUp!: ElementRef;

  ngOnChnages() {
    if (this.toggleReceiptPopup) {
      setTimeout(() => {
        this.togglePopUp.nativeElement.click();
        this.emitToReset.emit(true);
      });
    }
  }
}
