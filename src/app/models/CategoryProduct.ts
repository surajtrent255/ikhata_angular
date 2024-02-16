export class CategoryProduct {
  id: number = 0;
  name !: string;
  description !: string;
  parentId !: number;
  userId !: number;
  companyId !: number;
  branchId !: number;
  createdDate !: Date;
  editedDate !: Date;
  childCategories !: CategoryProduct[];
  showChildren !: boolean;
  deleted!: boolean;
}
