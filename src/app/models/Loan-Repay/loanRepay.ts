export class LoanRepay {
  id!: number;
  loanNo!: number;
  loanName: string = '';
  interest!: boolean;
  penalty!: boolean;
  service!: boolean;
  principle!: boolean;
  date!: Date;
  nepaliDate!: string;
  companyId!: number;
  branchId!: number;
  amount!: number;
}
