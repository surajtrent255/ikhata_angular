import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { ToastrService } from 'ngx-toastr';
import { Product } from 'src/app/models/Product';
import { SplitProduct } from 'src/app/models/SplitProduct';
import { Stock } from 'src/app/models/Stock';
import { Unit } from 'src/app/models/Unit';
import { VatRateTypes } from 'src/app/models/VatRateTypes';
import { ProductService } from 'src/app/service/product.service';
import { SplitProductService } from 'src/app/service/shared/SplitProduct/split-product.service';
import { CommonService } from 'src/app/service/shared/common/common.service';
import { LoginService } from 'src/app/service/shared/login.service';
import { StockService } from 'src/app/service/stock/stock.service';

@Component({
  selector: 'app-create-split-product',
  templateUrl: './create-split-product.component.html',
  styleUrls: ['./create-split-product.component.css'],
})
export class CreateSplitProductComponent {
  @Input() toggleSplitAgain!: boolean;
  @Input() id!: number;
  @ViewChild('splitQty') splitQty!: ElementRef;
  showForm!: boolean;
  @Output() destroyCreatSpiltComponent = new EventEmitter<boolean>(false);
  @Output() emitToReset = new EventEmitter<boolean>(false);

  Unit: Unit[] = [];
  availableProducts: Product[] = [];
  typerate: VatRateTypes[] = [];
  SplitProductObj: SplitProduct = new SplitProduct();
  createproduct: Product = new Product();
  companyId!: number;
  branchId!: number;
  compId!: number;
  splitProducts!: SplitProduct[];
  fetchstock: Stock = new Stock();

  constructor(
    private loginService: LoginService,
    private SplitProductService: SplitProductService,
    private productService: ProductService,
    private toastrService: ToastrService,
    private StockService: StockService,
    private ngxSmartModuleService: NgxSmartModalService,
    public CommonService: CommonService
  ) {}

  ngOnInit() {
    this.companyId = this.loginService.getCompnayId();
    this.branchId = this.loginService.getBranchId();
    this.compId = this.loginService.getCompnayId();
    this.getALLUnit();
    this.getSplitProductById();
    this.getAllVatRateTypes();
    console.log(this.companyId, this.branchId);
    console.log(this.SplitProductObj);
    setTimeout(() => {
      const htmlInputEL = document.getElementById(
        'splitQty'
      ) as HTMLInputElement;
      htmlInputEL.focus();
    });

    // this.getallstock(this.SplitProductObj.productId,this.SplitProductObj.companyId);
  }

  ngAfterViewInit() {
    this.CommonService.enableDragging('splitAgainProd', 'splitAgainProdPopup');
  }

  ngOnChanges() {
    if (this.toggleSplitAgain) {
      this.ngxSmartModuleService.getModal('splitAgainProd').open();
      this.emitToReset.emit(true);
    }
    this.getSplitProductById();
    // this.getallstock(this.SplitProductObj.productId,this.SplitProductObj.companyId);
  }

  goToSplitAgainButton() {
    const splitAgBtnEl = document.getElementById(
      'splitAgBtn'
    ) as HTMLButtonElement;
    setTimeout(() => {
      splitAgBtnEl.focus();
    }, 1000);
  }
  getSplitProductById() {
    this.SplitProductService.getSplitProductById(this.id).subscribe((res) => {
      this.SplitProductObj = res.data[0];
      this.getallstock(
        this.SplitProductObj.productId,
        this.SplitProductObj.companyId
      );
      // alert(JSON.stringify(this.SplitProductObj))
    });
  }

  getallstock(productId: number, companyId: number) {
    // console.log("productId"+this.SplitProductObj.productId);
    this.StockService.getStockWithProdId(
      this.SplitProductObj.productId
    ).subscribe((data) => {
      this.fetchstock = data.data;
      // this.updatestock=this.fetchstock;
      // console.log("get stock qty atul"+JSON.stringify(this.fetchstock));
    });
  }

  selectProductId(productName: string) {
    const product = this.availableProducts.find((p) => p.name === productName);
    if (product) {
      this.SplitProductObj.productId = product.id;
      this.createproduct.tax = this.SplitProductObj.tax = product.tax;
      this.SplitProductObj.qty = product.qtyPerUnit;
      this.createproduct.categoryId = product.categoryId;
      this.createproduct.userId = product.userId;

      this.getallstock(product.id, product.companyId);
    }
  }
  getALLUnit() {
    this.productService.getAllUnit().subscribe((res) => {
      this.Unit = res.data;
    });
  }
  getAllVatRateTypes() {
    this.productService.getAllVatRateTypes().subscribe((res) => {
      console.log(res.data);
      this.typerate = res.data;
    });
  }

  splitAgain(form: any) {
    // alert(JSON.stringify(this.SplitProductObj));
    this.SplitProductService.splitAgain(this.SplitProductObj).subscribe(
      (res) => {
        // alert("stocksplitted")
        this.toastrService.success('stock splitted');
        // console.log(this.SplitPr
        const closeBtnEl = document.getElementById(
          'closeBtn'
        ) as HTMLButtonElement;
        closeBtnEl.click();
      }
    );
  }

  destroyComp() {
    this.ngxSmartModuleService.getModal('splitAgainProd').close();
    let a: number = 0;
    // this.id = 0;
    this.destroyCreatSpiltComponent.emit(true);
  }
}
