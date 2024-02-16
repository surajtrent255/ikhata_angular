import { ModuleWithProviders, NgModule } from '@angular/core';
import { NepaliWordsPipe } from './nepali-words.pipe';

@NgModule({
  declarations: [NepaliWordsPipe],
  imports: [],
  exports: [NepaliWordsPipe]
})
export class NgxNepaliNumberToWordsModule {
  static forRoot(): ModuleWithProviders<any> {
    return {
      ngModule: NgxNepaliNumberToWordsModule,
      providers: []
    }
  }
}
