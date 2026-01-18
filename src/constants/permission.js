export const PERMISSIONS = {
  // Dashboard
  DASHBOARD_VIEW: "dashboard:view",

  // Master Data
  CATEGORY_VIEW: "category:view",
  CATEGORY_MANAGE: "category:manage",
  
  AUTHOR_VIEW: "author:view",
  AUTHOR_CREATE: "author:create",
  AUTHOR_UPDATE: "author:update",
  AUTHOR_DELETE: "author:delete",

  PUBLISHER_VIEW: "publisher:view",
  PUBLISHER_CREATE: "publisher:create",
  PUBLISHER_UPDATE: "publisher:update",
  PUBLISHER_DELETE: "publisher:delete",

  BOOK_VIEW: "book:view",
  BOOK_CREATE: "book:create",
  BOOK_UPDATE: "book:update",
  BOOK_DELETE: "book:delete",

  MEMBER_VIEW: "member:view",
  MEMBER_MANAGE: "member:manage",

  // Transactions
  LOAN_VIEW: "loan:view",
  LOAN_MANAGE: "loan:manage",
  
  FINE_VIEW: "fine:view",
  FINE_MANAGE: "fine:manage",

  // UAM
  USER_VIEW: "user:view",
  USER_MANAGE: "user:manage",
  ROLE_VIEW: "role:view",
  ROLE_MANAGE: "role:manage",

  // Reports
  REPORT_VIEW: "report:view",
};

export const PROTECTED_ROUTES = [
  { path: "/dashboard", permission: PERMISSIONS.DASHBOARD_VIEW },
  // Master Data
  { path: "/master-data/categories", permission: PERMISSIONS.CATEGORY_VIEW },
  { path: "/master-data/authors", permission: PERMISSIONS.AUTHOR_VIEW },
  { path: "/master-data/publishers", permission: PERMISSIONS.PUBLISHER_VIEW },
  { path: "/master-data/books", permission: PERMISSIONS.BOOK_VIEW },
  { path: "/master-data/members", permission: PERMISSIONS.MEMBER_VIEW },
  // UAM
  { path: "/uam/users", permission: PERMISSIONS.USER_VIEW },
  { path: "/uam/roles", permission: PERMISSIONS.ROLE_MANAGE },
  // Transactions
  { path: "/transaction/loans", permission: PERMISSIONS.LOAN_VIEW },
  { path: "/transaction/fines", permission: PERMISSIONS.FINE_VIEW },
  // Reports
  { path: "/reports", permission: PERMISSIONS.REPORT_VIEW },
];