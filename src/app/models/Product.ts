export class Product {
  id!: number;
  name!: string;
  description!: string;
  sellingPrice: number = 0;
  costPrice: number = 0;
  productType!: boolean;
  ratePercentage: number = 0;
  averagePriceStatus!: boolean;
  userId!: number;
  companyId!: number;
  branchId!: number;
  sellerId!: number;
  categoryId!: number;
  barcode!: string;
  discount: number = 0;
  stock!: number;
  tax: number = 3;
  unit: string = 'other';
  createDate!: Date;
  updateDate!: Date;
  vatRate!: number;
  qtyPerUnit: number = 1;
  taxApproach!: number;
  taxTypeId: number = 3;
  qty!: number;


}
