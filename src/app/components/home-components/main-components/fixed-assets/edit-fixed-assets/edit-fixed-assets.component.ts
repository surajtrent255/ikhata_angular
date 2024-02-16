import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { EventManager } from '@angular/platform-browser';
import { FixedAssets } from 'src/app/models/Fixed Assets/FixedAssets';
import { FixedAssetsService } from 'src/app/service/shared/Assets And Expenses/fixed-assets.service';
import { CommonService } from 'src/app/service/shared/common/common.service';

@Component({
  selector: 'app-edit-fixed-assets',
  templateUrl: './edit-fixed-assets.component.html',
  styleUrls: ['./edit-fixed-assets.component.css'],
})
export class EditFixedAssetsComponent {
  @Input() toggleEditAssests!: boolean;
  @Output() emitToReset = new EventEmitter<boolean>(false);
  @Input() FixedAssetsId!: number;
  @Output() updatedSuccessful = new EventEmitter<boolean>(false);
  asset: FixedAssets = new FixedAssets();

  @ViewChild('closeButton') closeButton!: ElementRef;

  constructor(
    private AssetService: FixedAssetsService,
    private commonService: CommonService
  ) {}

  ngOnChanges() {
    if (this.toggleEditAssests) {
      setTimeout(() => {
        const modal = document.getElementById(
          'editFixedassetPopup'
        ) as HTMLButtonElement;
        if (modal) modal.click();
        this.emitToReset.emit(true);
        if (this.FixedAssetsId) {
          this.getFixedAssetDetailsBySn(this.FixedAssetsId);
        }
      });
    }
  }

  getFixedAssetDetailsBySn(SN: number) {
    this.AssetService.getFixedAssetsDetailsBySN(SN).subscribe((res) => {
      this.asset = res.data;
      let date = this.commonService.formatDate(Number(this.asset.date));
      this.asset.date = date;
    });
  }

  fixedAssetEdit() {
    this.AssetService.updateFixedAssetsDetails(this.asset).subscribe({
      next: () => {
        this.closeButton.nativeElement.click();
        this.updatedSuccessful.emit(true);
      },
    });
  }
}
