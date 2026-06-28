export const DEMO_MODE = false; // Toggle this to true to force demo data

export const DEMO_DASHBOARD_DATA = {
  totalProducts: 48,
  totalCategories: 6,
  todayOrders: 27,
  todayRevenue: 12850,
  pendingOrders: 8,
  latestOrder: { orderNumber: "ORD-2026-105" },
  mostViewedProduct: "Chicken Wings",
  topCategory: "Chicken Items",
  weeklyOrdersChart: [
    { name: 'Sun', value: 12 },
    { name: 'Mon', value: 18 },
    { name: 'Tue', value: 15 },
    { name: 'Wed', value: 22 },
    { name: 'Thu', value: 28 },
    { name: 'Fri', value: 31 },
    { name: 'Sat', value: 27 },
  ],
  weeklyRevenueChart: [
    { name: 'Sun', value: 4200 },
    { name: 'Mon', value: 5100 },
    { name: 'Tue', value: 4700 },
    { name: 'Wed', value: 6500 },
    { name: 'Thu', value: 8900 },
    { name: 'Fri', value: 11200 },
    { name: 'Sat', value: 12850 },
  ]
};

export const DEMO_CATEGORIES_DATA = [
  { _id: 'demo-c1', name: 'Chicken Items', description: 'Fried chicken products', productCount: 15 },
  { _id: 'demo-c2', name: 'Combos', description: 'Meal combos', productCount: 8 },
  { _id: 'demo-c3', name: 'Bucket Meals', description: 'Family bucket meals', productCount: 6 },
  { _id: 'demo-c4', name: 'Snacks', description: 'Quick bites', productCount: 10 },
  { _id: 'demo-c5', name: 'Beverages', description: 'Cold drinks', productCount: 5 },
  { _id: 'demo-c6', name: 'Desserts', description: 'Sweet items', productCount: 4 }
];

export const DEMO_MENU_DATA = {
  products: [
    { _id: 'demo-p1', name: 'Chicken Leg', price: 150, category: { _id: 'demo-c1', name: 'Chicken Items' }, status: 'Available', description: 'Crispy fried chicken leg' },
    { _id: 'demo-p2', name: 'Chicken Wings', price: 220, category: { _id: 'demo-c1', name: 'Chicken Items' }, status: 'Available', description: 'Spicy chicken wings' },
    { _id: 'demo-p3', name: 'Chicken Strips', price: 180, category: { _id: 'demo-c4', name: 'Snacks' }, status: 'Available', description: 'Boneless chicken strips' },
    { _id: 'demo-p4', name: 'Bucket Meal', price: 799, category: { _id: 'demo-c3', name: 'Bucket Meals' }, status: 'Available', description: '8 pcs chicken + 2 fries' },
    { _id: 'demo-p5', name: 'Family Combo', price: 999, category: { _id: 'demo-c2', name: 'Combos' }, status: 'Available', description: '12 pcs chicken + 4 beverages' },
    { _id: 'demo-p6', name: 'Pepsi', price: 40, category: { _id: 'demo-c5', name: 'Beverages' }, status: 'Available', description: 'Chilled Pepsi' },
    { _id: 'demo-p7', name: 'Coke', price: 40, category: { _id: 'demo-c5', name: 'Beverages' }, status: 'Out Of Stock', description: 'Chilled Coke' },
    { _id: 'demo-p8', name: 'Chocolate Brownie', price: 99, category: { _id: 'demo-c6', name: 'Desserts' }, status: 'Available', description: 'Warm fudge brownie' },
    { _id: 'demo-p9', name: 'Popcorn Chicken', price: 140, category: { _id: 'demo-c4', name: 'Snacks' }, status: 'Available', description: 'Bite-sized fried chicken' },
    { _id: 'demo-p10', name: 'Spicy Fries', price: 90, category: { _id: 'demo-c4', name: 'Snacks' }, status: 'Available', description: 'Fries with spicy seasoning' },
    { _id: 'demo-p11', name: 'Chicken Burger', price: 160, category: { _id: 'demo-c1', name: 'Chicken Items' }, status: 'Available', description: 'Crispy chicken fillet burger' },
    { _id: 'demo-p12', name: 'Cheese Dip', price: 30, category: { _id: 'demo-c4', name: 'Snacks' }, status: 'Available', description: 'Creamy cheese dip' },
    { _id: 'demo-p13', name: 'Sprite', price: 40, category: { _id: 'demo-c5', name: 'Beverages' }, status: 'Available', description: 'Chilled Sprite' },
    { _id: 'demo-p14', name: 'Water Bottle', price: 20, category: { _id: 'demo-c5', name: 'Beverages' }, status: 'Available', description: 'Mineral water' },
    { _id: 'demo-p15', name: 'Mini Combo', price: 299, category: { _id: 'demo-c2', name: 'Combos' }, status: 'Available', description: '2 pcs chicken + fries + drink' },
    { _id: 'demo-p16', name: 'Zinger Meal', price: 349, category: { _id: 'demo-c2', name: 'Combos' }, status: 'Out Of Stock', description: 'Zinger burger + fries + drink' },
    { _id: 'demo-p17', name: 'Muffins', price: 60, category: { _id: 'demo-c6', name: 'Desserts' }, status: 'Available', description: 'Blueberry muffins' },
    { _id: 'demo-p18', name: 'Ice Cream', price: 80, category: { _id: 'demo-c6', name: 'Desserts' }, status: 'Out Of Stock', description: 'Vanilla ice cream' },
    { _id: 'demo-p19', name: 'Party Bucket', price: 1499, category: { _id: 'demo-c3', name: 'Bucket Meals' }, status: 'Available', description: '20 pcs chicken bucket' },
    { _id: 'demo-p20', name: 'Nuggets', price: 120, category: { _id: 'demo-c4', name: 'Snacks' }, status: 'Available', description: '6 pcs chicken nuggets' }
  ],
  stats: {
    total: 20,
    available: 17,
    outOfStock: 3
  }
};

export const DEMO_ANALYTICS_DATA = {
  metrics: {
    dailyScans: 145,
    weeklyScans: 954,
    monthlyScans: 4120,
    peakHour: "20:00 (8 PM)"
  },
  charts: {
    mostOrdered: [
      { name: "Chicken Wings", orders: 340 },
      { name: "Chicken Leg", orders: 300 },
      { name: "Bucket Meal", orders: 240 },
      { name: "Family Combo", orders: 180 },
      { name: "Chicken Strips", orders: 150 }
    ],
    mostViewed: [
      { name: "Chicken Wings", views: 580 },
      { name: "Chicken Leg", views: 560 },
      { name: "Popcorn Chicken", views: 410 },
      { name: "Chicken Strips", views: 380 },
      { name: "Bucket Meal", views: 290 }
    ],
    trafficTrend: [
      { time: '08:00', traffic: 50 },
      { time: '10:00', traffic: 90 },
      { time: '12:00', traffic: 180 },
      { time: '14:00', traffic: 170 },
      { time: '16:00', traffic: 120 },
      { time: '18:00', traffic: 250 },
      { time: '20:00', traffic: 280 },
      { time: '22:00', traffic: 140 },
    ],
    categoryPerformance: [
      { name: "Chicken Items", value: 45 },
      { name: "Snacks", value: 20 },
      { name: "Combos", value: 15 },
      { name: "Bucket Meals", value: 10 },
      { name: "Beverages", value: 10 }
    ],
    scanSource: [
      { name: "QR Code", value: 75 },
      { name: "Direct Link", value: 25 }
    ]
  }
};

export const DEMO_QR_ANALYTICS_DATA = {
  totalScans: 4120,
  dailyScans: 145,
  weeklyScans: 954,
  lastScannedAt: "2026-06-20T16:15:00Z",
  scansPerDay: [
    { date: "Mon", scans: 110 },
    { date: "Tue", scans: 135 },
    { date: "Wed", scans: 120 },
    { date: "Thu", scans: 150 },
    { date: "Fri", scans: 175 },
    { date: "Sat", scans: 140 },
    { date: "Sun", scans: 124 }
  ]
};

export const DEMO_ORDERS_DATA = [
  { _id: 'demo-o1', orderNumber: 'ORD-2026-101', customerName: 'Arun Kumar', customerPhone: '9876543210', items: [{ name: 'Chicken Wings', quantity: 2 }], totalAmount: 440, status: 'Preparing', paymentStatus: 'Paid', createdAt: new Date().setHours(12, 15, 0) },
  { _id: 'demo-o2', orderNumber: 'ORD-2026-102', customerName: 'Priya', customerPhone: '9876543211', items: [{ name: 'Bucket Meal', quantity: 1 }], totalAmount: 799, status: 'Pending', paymentStatus: 'Paid', createdAt: new Date().setHours(12, 20, 0) },
  { _id: 'demo-o3', orderNumber: 'ORD-2026-103', customerName: 'Rahul', customerPhone: '9876543212', items: [{ name: 'Chicken Leg', quantity: 3 }], totalAmount: 450, status: 'Ready', paymentStatus: 'Paid', createdAt: new Date().setHours(12, 30, 0) },
  { _id: 'demo-o4', orderNumber: 'ORD-2026-104', customerName: 'Sanjay', customerPhone: '9876543213', items: [{ name: 'Pepsi', quantity: 2 }, { name: 'Snacks', quantity: 1 }], totalAmount: 200, status: 'Completed', paymentStatus: 'Paid', createdAt: new Date().setHours(13, 0, 0) },
  { _id: 'demo-o5', orderNumber: 'ORD-2026-105', customerName: 'Anita', customerPhone: '9876543214', items: [{ name: 'Family Combo', quantity: 1 }], totalAmount: 999, status: 'Pending', paymentStatus: 'Pending', createdAt: new Date().setHours(13, 10, 0) },
  { _id: 'demo-o6', orderNumber: 'ORD-2026-106', customerName: 'Vikram', customerPhone: '9876543215', items: [{ name: 'Chicken Strips', quantity: 2 }], totalAmount: 360, status: 'Completed', paymentStatus: 'Failed', createdAt: new Date().setHours(13, 15, 0) },
  { _id: 'demo-o7', orderNumber: 'ORD-2026-107', customerName: 'Deepa', customerPhone: '9876543216', items: [{ name: 'Chicken Wings', quantity: 1 }], totalAmount: 220, status: 'Completed', paymentStatus: 'Paid', createdAt: new Date().setHours(13, 40, 0) },
  { _id: 'demo-o8', orderNumber: 'ORD-2026-108', customerName: 'Karthik', customerPhone: '9876543217', items: [{ name: 'Chocolate Brownie', quantity: 2 }], totalAmount: 198, status: 'Completed', paymentStatus: 'Paid', createdAt: new Date().setHours(14, 5, 0) },
  { _id: 'demo-o9', orderNumber: 'ORD-2026-109', customerName: 'Sneha', customerPhone: '9876543218', items: [{ name: 'Bucket Meal', quantity: 1 }], totalAmount: 799, status: 'Preparing', paymentStatus: 'Paid', createdAt: new Date().setHours(14, 20, 0) },
  { _id: 'demo-o10', orderNumber: 'ORD-2026-110', customerName: 'Manoj', customerPhone: '9876543219', items: [{ name: 'Mini Combo', quantity: 2 }], totalAmount: 598, status: 'Completed', paymentStatus: 'Paid', createdAt: new Date().setHours(14, 45, 0) },
  { _id: 'demo-o11', orderNumber: 'ORD-2026-111', customerName: 'Divya', customerPhone: '9876543220', items: [{ name: 'Popcorn Chicken', quantity: 1 }], totalAmount: 140, status: 'Completed', paymentStatus: 'Paid', createdAt: new Date().setHours(15, 0, 0) },
  { _id: 'demo-o12', orderNumber: 'ORD-2026-112', customerName: 'Ganesh', customerPhone: '9876543221', items: [{ name: 'Chicken Leg', quantity: 4 }], totalAmount: 600, status: 'Completed', paymentStatus: 'Paid', createdAt: new Date().setHours(15, 30, 0) },
  { _id: 'demo-o13', orderNumber: 'ORD-2026-113', customerName: 'Lakshmi', customerPhone: '9876543222', items: [{ name: 'Spicy Fries', quantity: 3 }], totalAmount: 270, status: 'Pending', paymentStatus: 'Pending', createdAt: new Date().setHours(15, 50, 0) },
  { _id: 'demo-o14', orderNumber: 'ORD-2026-114', customerName: 'Ramesh', customerPhone: '9876543223', items: [{ name: 'Party Bucket', quantity: 1 }], totalAmount: 1499, status: 'Completed', paymentStatus: 'Paid', createdAt: new Date().setHours(16, 10, 0) },
  { _id: 'demo-o15', orderNumber: 'ORD-2026-115', customerName: 'Meera', customerPhone: '9876543224', items: [{ name: 'Chicken Burger', quantity: 2 }], totalAmount: 320, status: 'Completed', paymentStatus: 'Paid', createdAt: new Date().setHours(16, 30, 0) }
];

export const DEMO_QR_INFO = {
  status: 'Active',
  createdAt: '01-Jan-2026',
  lastScannedAt: '2026-06-20T16:15:00Z',
  shopUrl: 'https://kokkarakko.com/shop/kokkarakko-fried-chicken'
};
