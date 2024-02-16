import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CounterService } from 'src/app/service/shared/counter/counter.service';
import { LoginService } from 'src/app/service/shared/login.service';

@Component({
  selector: 'app-create-counter',
  templateUrl: './create-counter.component.html',
  styleUrls: ['./create-counter.component.css'],
})
export class CreateCounterComponent {
  @Input() displayCreateNewCounterPopUp!: boolean;
  @Input() branchId!: number;
  @Output() emitToReset = new EventEmitter<boolean>(false);
  @Output() successfullyAdded = new EventEmitter<boolean>(false);

  @ViewChild('closeButton') closeButton!: ElementRef;

  BranchId!: number;

  ngOnChanges() {
    if (this.displayCreateNewCounterPopUp) {
      setTimeout(() => {
        this.BranchId = this.branchId;
        const initPopUpButton = document.getElementById(
          'createCounterPopUp'
        ) as HTMLButtonElement;
        initPopUpButton.click();
        this.emitToReset.emit(true);
      });
    }
  }

  CounterForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
  });

  constructor(
    private counterService: CounterService,
    private loginService: LoginService,
    private tosatrService: ToastrService
  ) {}

  OnSubmit() {
    if (
      this.CounterForm.valid &&
      this.CounterForm.value.name !== '' &&
      this.CounterForm.value.name !== undefined
    ) {
      this.counterService
        .addCounterDetails({
          id: 0,
          branchId: this.BranchId,
          companyId: this.loginService.getCompnayId(),
          date: new Date(),
          name: this.CounterForm.value.name!,
          status: true,
          userId: 0,
          counterId: 0,
        })
        .subscribe({
          next: (res) => {
            this.successfullyAdded.emit(true);
            this.closeButton.nativeElement.click();
          },
        });
    } else {
      this.tosatrService.error('Please Enter Counter Name');
    }
  }
}
