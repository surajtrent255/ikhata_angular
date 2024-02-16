export class SalesBill {
  id !: number;
  userId !: number;
  customerId !: number;
  companyId !: number;
  fiscalYear !: string;//imp
  billNo !: string;//imp
  billPrinted: boolean = false;//imp
  billActive: boolean = true;//imp
  realTime: boolean = true;//imp
  customerName !: string;//imp
  customerPan !: number;//imp
  billDate !: string;//imp
  billDateNepali !: string;
  amount !: number;//imp
  discount !: number;//imp
  discountApproach !: number;
  taxableAmount !: number;//imp
  taxAmount !: number;//imp
  totalAmount !: number;//imp
  syncWithIrd: boolean = false;//imp
  printedTime !: string;//imp
  enteredBy !: string;//imp
  printedBy !: string;//imp
  paymentMethod !: string;//imp
  vatRefundAmount !: number;//imp if any
  transactionId !: string;//imp if any
  status: boolean = true;
  branchId !: number;
  counterId !: number;
  draft !: boolean;
  taxApproach !: number;
  customerSearchMethod !: number;
  printCount !: number;
  saleType !: number;
  hasAbbr !: boolean;
  receipt !: boolean;
  email !: string;
}
