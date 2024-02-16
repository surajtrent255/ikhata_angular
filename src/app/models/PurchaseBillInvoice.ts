import { PurchaseBill } from "./PurchaseBill";
import { PurchaseBillDetailWithProdInfo } from "./PurchaseBillDetailWithProdInfo";

export class PurchaseBillInvoice {

  purchaseBillDTO: PurchaseBill = new PurchaseBill;
  purchaseBillDetailsWithProd !: PurchaseBillDetailWithProdInfo[];
}
