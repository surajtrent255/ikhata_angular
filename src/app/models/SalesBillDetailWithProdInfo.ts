export class SalesBillDetailWithProdInfo {
  id!: number;
  productId!: number;
  qty: number = 0;
  date: Date = new Date();
  discountPerUnit: number = 0.0;
  rate: number = 0.0;
  unit!: string;
  billId!: number;
  companyId!: number;
  productName!: string;
  rowTotal!: number;
  taxRate!: number;
  creditReason: string = '';
  total!: number;
}
