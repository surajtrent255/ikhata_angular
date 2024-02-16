//export const BASE_URL = 'http://localhost:9999';
 export const BASE_URL = `http://103.233.58.121:9999`;
export const USER_LOGIN_URL = BASE_URL + '/api/v1/auth/authenticate';

export const USER_REGISTER_URL = BASE_URL + '/api/v1/auth/register';

export const USER_COMPANY_URL = BASE_URL + '/api/v1/company/userCompany';

export const ADD_COMPANY_URL = BASE_URL + '/api/v1/company/add';

export const ROLE_INFO_BASED_ON_COMPANYID = BASE_URL + '/api/v1/userconfig';

// needs to be revised

export const USER_UPDATE_STATUS_URL =
  BASE_URL + '/api/v1/userconfig/update/role/status';

export const UPDATE_USER_COMPANY_STATUS =
  BASE_URL + '/api/v1/userconfig/update/usercompany/status';

// ***************************************
export const ADD_TO_USER_ROLE_TABLE = BASE_URL + '/api/v1/userconfig/add/role';

export const ADD_TO_MULTIPLE_ROLE_TABLE = BASE_URL + '/add/multiple/user/role';

export const GET_ALL_ROLES = BASE_URL + '/api/v1/userconfig/role';

// '''''''''''

export const GET_ALL_USER = BASE_URL + '/api/v1/userconfig/users';

// final urls

export const ASSIGN_COMPANY_TO_USER =
  BASE_URL + '/api/v1/userconfig/assign/user';

export const GET_BRANCH_DETAILS = BASE_URL + '/api/v1/branch';

export const GET_USERS_BY_COMPANYID =
  BASE_URL + '/api/v1/userconfig/users/ByCompanyId';

export const ASSIGN_BRANCH_TO_USER = BASE_URL + '/api/v1/branch/assign';

export const GET_BRANCH_DETAILS_BY_USERID_COMPANYID =
  BASE_URL + '/api/v1/branch/get';
export const COMPANY_BASE_URL = BASE_URL + '/api/v1/company';

export const GET_ALL_PROVINCE = BASE_URL + '/api/v1/province';

export const GET_DISTRICT_BY_PROVINCEID = BASE_URL + '/api/v1/district';

export const GET_BRANCH_USERS = BASE_URL + '/api/v1/branch/users';

export const ENABLE_DISABLE_BRANCH_USER = BASE_URL + '/api/v1/branch/enable';

export const GET_USER_FOR_ASSIGN_BRANCH_LIST =
  BASE_URL + '/api/v1/branch/list/assign';

export const GET_MUNICIPALITY = BASE_URL + '/api/v1/municipality';

// payment

export const ADD_PAYMENT_DETAILS = BASE_URL + '/api/v1/payment';

export const GET_PAYMENT_MODE = BASE_URL + '/api/v1/payment/mode';

export const GET_PAYMENT_DETAILS = BASE_URL + '/api/v1/payment';

// fixed Assets
export const GET_FIXED_ASSETS_DETAILS = BASE_URL + '/api/v1/fixedAssets';
// Expenses
export const GET_EXPENSE_DETAILS = BASE_URL + '/api/v1/expense';
// receipts
export const RECEIPT_URL = BASE_URL + '/api/v1/receipt';
export const GET_ALL_BANK = BASE_URL + '/api/v1/bank/branchid';

export const post_ALL_BANK = BASE_URL + '/api/v1/bank/bank';

export const GET_ALL_deposite = BASE_URL + '/api/v1/bank/deposite?';

export const GET_ALL_DEPOSITE = BASE_URL + '/api/v1/bank/deposite?';

export const post_ALL_DEPOSITE = BASE_URL + '/api/v1/bank/deposite';
export const GET_ALL_WITHDRAW = BASE_URL + '/api/v1/bank/withdraw';
// For Super Admin
export const GET_ALL_USERS_FOR_SUPER_ADMIN_LISTING =
  BASE_URL + '/api/v1/superAdmin/search';

// for counter
export const COUNTER_DETAILS = BASE_URL + '/api/v1/counter';

// for Feature Control
export const FEATURE_CONTROL = BASE_URL + '/api/v1/feature/control';

// for debit note
export const DEBIT_NOTE = BASE_URL + '/ap1/v1/debitNote';

// for credit note
export const CREDIT_NOTE = BASE_URL + '/api/v1/creditNote';

// post date check api
export const CHECK_INFO = BASE_URL + '/api/v1/cheque';

// company Label
export const COMPANY_LABEL_DATA = BASE_URL + '/api/v1/company/label';
