export class SalesBillDetail {
  id !: number;
  productId !: number;
  qty: number = 0;
  date!: string;
  discountPerUnit: number = 0.0;
  rate: number = 0.0;
  billId !: number;
  companyId !: number;
  branchId !: number;
  taxRate !: number;
  rowTotal!: number;
}
