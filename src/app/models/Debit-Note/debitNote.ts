import { date } from '@sbmdkl/nepali-date-converter/types/interfaces';

export class DebitNote {
  id!: number;
  panNumber!: number;
  receiverName!: string;
  receiverAddress!: string;
  billNumber!: number;
  date!: Date;
  nepaliDate!: string;
  totalAmount!: number;
  totalTax!: number;
  companyId!: number;
  branchId!: number;
  fiscalYear!: string;
}
