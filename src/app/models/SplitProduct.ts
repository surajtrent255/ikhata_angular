export class SplitProduct {
  companyId!: number;
  branchId!: number;
  id!: number;
  productId!: number;
  productName!: string;
  qty!: number;
  splitQty: number = 1;
  totalQty!: number;
  unit!: string;
  price!: number;
  updatedProductId!: number;
  updatedProductName!: string;
  tax!: number;
}
