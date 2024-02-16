import { PurchaseBill } from "./PurchaseBill";
import { PurchaseBillDetailWithProdInfo } from "./PurchaseBillDetailWithProdInfo";

export class PurchaseReport {
  purchaseBill !: PurchaseBill;
  purchaseBillDetailWithProdInfos !: PurchaseBillDetailWithProdInfo[];
}
