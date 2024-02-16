import { SalesBill } from "./SalesBill";
import { SalesBillDetailWithProdInfo } from "./SalesBillDetailWithProdInfo";
import { SalesReceipt } from "./SalesReceipt";
import { Company } from "./company";

export class SalesBillInvoice {

  salesBillDTO: SalesBill = new SalesBill;
  salesBillDetailsWithProd !: SalesBillDetailWithProdInfo[];
  salesReceipt !: SalesReceipt;
  sellerCompany !: Company;
  customerAddress!: string
}
