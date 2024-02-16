export class PurchaseBillDetail {
  id!: number;
  productId!: number;
  qty: number = 0;
  taxTypeId!: number;
  date: Date = new Date();
  discountPerUnit: number = 0.0;
  rate: number = 0.0;
  purchaseBillId!: number;
  companyId!: number;
}
