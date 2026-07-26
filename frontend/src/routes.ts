// GENERATED from the architecture plan — do not edit by hand.
// The complete navigation contract: every page, its route, and its nav
// metadata. Link via ROUTES.*, render nav from routeTable — never hardcode
// a path string. This file imports NOTHING by design (cycle-safe).

export const ROUTES = {
  HOME: '/',
  CHECKOUT: '/checkout',
  CONTACT: '/contact',
  LOGIN: '/login',
  MEMBERSHIPS: '/memberships',
  PURCHASE_SUCCESS: '/purchase-success',
  SCHEDULE: '/schedule',
  TRAINER_DETAIL: '/trainer/:id',
  TRAINERS: '/trainers',
  ADMIN_DASHBOARD: '/admin',
  ADMIN_MEMBERSHIPS: '/admin/memberships',
  ADMIN_SCHEDULING: '/admin/scheduling',
  ADMIN_TESTIMONIALS: '/admin/testimonials',
  ADMIN_TRAINERS: '/admin/trainers',
  NOT_FOUND: '*',
} as const;

export interface RouteEntry {
  key: keyof typeof ROUTES;
  path: string;
  page: string;        // component name, e.g. 'AdminOrdersPage'
  importPath: string;  // string metadata only — App.tsx does the importing
  label: string;
  admin: boolean;
  nav: boolean;
}

export const routeTable: RouteEntry[] = [
  { key: 'HOME', path: ROUTES.HOME, page: 'HomePage', importPath: './pages/HomePage', label: 'Home', admin: false, nav: true },
  { key: 'CHECKOUT', path: ROUTES.CHECKOUT, page: 'CheckoutPage', importPath: './pages/CheckoutPage', label: 'Checkout', admin: false, nav: true },
  { key: 'CONTACT', path: ROUTES.CONTACT, page: 'ContactPage', importPath: './pages/ContactPage', label: 'Contact', admin: false, nav: true },
  { key: 'LOGIN', path: ROUTES.LOGIN, page: 'LoginPage', importPath: './pages/LoginPage', label: 'Login', admin: false, nav: false },
  { key: 'MEMBERSHIPS', path: ROUTES.MEMBERSHIPS, page: 'MembershipsPage', importPath: './pages/MembershipsPage', label: 'Memberships', admin: false, nav: true },
  { key: 'PURCHASE_SUCCESS', path: ROUTES.PURCHASE_SUCCESS, page: 'PurchaseSuccessPage', importPath: './pages/PurchaseSuccessPage', label: 'Purchase Success', admin: false, nav: true },
  { key: 'SCHEDULE', path: ROUTES.SCHEDULE, page: 'SchedulePage', importPath: './pages/SchedulePage', label: 'Schedule', admin: false, nav: true },
  { key: 'TRAINER_DETAIL', path: ROUTES.TRAINER_DETAIL, page: 'TrainerDetailPage', importPath: './pages/TrainerDetailPage', label: 'Trainer', admin: false, nav: false },
  { key: 'TRAINERS', path: ROUTES.TRAINERS, page: 'TrainersPage', importPath: './pages/TrainersPage', label: 'Trainers', admin: false, nav: true },
  { key: 'ADMIN_DASHBOARD', path: ROUTES.ADMIN_DASHBOARD, page: 'AdminDashboardPage', importPath: './pages/AdminDashboardPage', label: 'Dashboard', admin: true, nav: true },
  { key: 'ADMIN_MEMBERSHIPS', path: ROUTES.ADMIN_MEMBERSHIPS, page: 'AdminMembershipsPage', importPath: './pages/AdminMembershipsPage', label: 'Memberships', admin: true, nav: true },
  { key: 'ADMIN_SCHEDULING', path: ROUTES.ADMIN_SCHEDULING, page: 'AdminSchedulingPage', importPath: './pages/AdminSchedulingPage', label: 'Scheduling', admin: true, nav: true },
  { key: 'ADMIN_TESTIMONIALS', path: ROUTES.ADMIN_TESTIMONIALS, page: 'AdminTestimonialsPage', importPath: './pages/AdminTestimonialsPage', label: 'Testimonials', admin: true, nav: true },
  { key: 'ADMIN_TRAINERS', path: ROUTES.ADMIN_TRAINERS, page: 'AdminTrainersPage', importPath: './pages/AdminTrainersPage', label: 'Trainers', admin: true, nav: true },
  { key: 'NOT_FOUND', path: ROUTES.NOT_FOUND, page: 'NotFoundPage', importPath: './pages/NotFoundPage', label: 'Not Found', admin: false, nav: false },
];
