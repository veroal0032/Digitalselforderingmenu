import { useState, useEffect } from 'react';
import { Order, OrderStatus } from '../types/admin';
import { products } from '../lib/data';

/**
 * Hook for managing orders with mock data
 * In production, this would fetch from Supabase
 */
export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setOrders(generateMockOrders());
      setLoading(false);
    }, 500);
  }, []);

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;

        const now = new Date();
        const statusHistory = [
          ...order.statusHistory,
          { status: newStatus, timestamp: now },
        ];

        return {
          ...order,
          status: newStatus,
          updatedAt: now,
          ...(newStatus === 'completed' && { completedAt: now }),
          ...(newStatus === 'cancelled' && { cancelledAt: now }),
          statusHistory,
        };
      })
    );
  };

  const cancelOrder = (orderId: string) => {
    updateOrderStatus(orderId, 'cancelled');
  };

  const getOrdersByStatus = (status: OrderStatus | 'all') => {
    if (status === 'all') {
      return orders.filter((o) => o.status !== 'completed' && o.status !== 'cancelled');
    }
    return orders.filter((o) => o.status === status);
  };

  const getTodayOrders = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return orders.filter((o) => o.createdAt >= today);
  };

  const getCompletedOrders = () => {
    return orders.filter((o) => o.status === 'completed' || o.status === 'cancelled');
  };

  return {
    orders,
    loading,
    updateOrderStatus,
    cancelOrder,
    getOrdersByStatus,
    getTodayOrders,
    getCompletedOrders,
  };
}

/**
 * Generate realistic mock orders using actual product data
 */
function generateMockOrders(): Order[] {
  const mockOrders: Order[] = [];
  const now = new Date();

  // Helper to create random time within last 4 hours
  const randomRecentTime = (hoursAgo: number) => {
    const time = new Date(now);
    time.setHours(time.getHours() - Math.random() * hoursAgo);
    return time;
  };

  // Helper to get random product
  const getRandomProduct = () => {
    return products[Math.floor(Math.random() * products.length)];
  };

  // Helper to calculate extras total
  const calculateExtrasTotal = (extras: any) => {
    let total = 0;
    if (extras.collagen) total += 1.5;
    if (extras.ashwagandha) total += 1.5;
    if (extras.honey) total += 1.0;
    return total;
  };

  // Order 1 - Pending
  const product1 = products[0]; // Matcha Latte
  const createdAt1 = randomRecentTime(0.5);
  mockOrders.push({
    id: '1',
    orderNumber: 'M001',
    items: [
      {
        productId: product1.id,
        productName: 'Matcha Latte',
        quantity: 2,
        milk: 'oat',
        size: 'large',
        unitPrice: 6.50,
        subtotal: 13.00,
      },
    ],
    extras: { collagen: true },
    extrasTotal: 1.50,
    subtotal: 13.00,
    total: 14.50,
    status: 'pending',
    createdAt: createdAt1,
    updatedAt: createdAt1,
    statusHistory: [{ status: 'pending', timestamp: createdAt1 }],
  });

  // Order 2 - Preparing
  const product2 = products[1]; // Strawberry Matcha
  const product3 = products[6]; // Skin Food
  const createdAt2 = randomRecentTime(1);
  const updatedAt2 = new Date(createdAt2.getTime() + 300000); // 5 min later
  mockOrders.push({
    id: '2',
    orderNumber: 'M002',
    items: [
      {
        productId: product2.id,
        productName: 'Strawberry Matcha',
        quantity: 1,
        milk: 'almond',
        size: 'regular',
        unitPrice: 6.50,
        subtotal: 6.50,
      },
      {
        productId: product3.id,
        productName: 'Skin Food',
        quantity: 1,
        milk: 'oat',
        size: 'large',
        unitPrice: 10.50,
        subtotal: 10.50,
      },
    ],
    extras: { collagen: true, ashwagandha: true },
    extrasTotal: 3.00,
    subtotal: 17.00,
    total: 20.00,
    status: 'preparing',
    createdAt: createdAt2,
    updatedAt: updatedAt2,
    statusHistory: [
      { status: 'pending', timestamp: createdAt2 },
      { status: 'preparing', timestamp: updatedAt2 },
    ],
  });

  // Order 3 - Ready
  const product4 = products[16]; // Sandwich Vegano
  const product5 = products[10]; // Americano
  const createdAt3 = randomRecentTime(1.5);
  const updatedAt3 = new Date(createdAt3.getTime() + 600000); // 10 min later
  const readyAt3 = new Date(updatedAt3.getTime() + 300000); // 5 min later
  mockOrders.push({
    id: '3',
    orderNumber: 'M003',
    items: [
      {
        productId: product4.id,
        productName: 'Sándwich Vegano',
        quantity: 1,
        unitPrice: 10.99,
        subtotal: 10.99,
      },
      {
        productId: product5.id,
        productName: 'Americano',
        quantity: 2,
        unitPrice: 3.00,
        subtotal: 6.00,
      },
    ],
    extras: { honey: true },
    extrasTotal: 1.00,
    subtotal: 16.99,
    total: 17.99,
    status: 'ready',
    createdAt: createdAt3,
    updatedAt: readyAt3,
    statusHistory: [
      { status: 'pending', timestamp: createdAt3 },
      { status: 'preparing', timestamp: updatedAt3 },
      { status: 'ready', timestamp: readyAt3 },
    ],
  });

  // Order 4 - Pending
  const product6 = products[11]; // Capuchino
  const createdAt4 = randomRecentTime(0.3);
  mockOrders.push({
    id: '4',
    orderNumber: 'M004',
    items: [
      {
        productId: product6.id,
        productName: 'Capuchino',
        quantity: 3,
        milk: 'coconut',
        size: 'regular',
        unitPrice: 4.50,
        subtotal: 13.50,
      },
    ],
    extras: {},
    extrasTotal: 0,
    subtotal: 13.50,
    total: 13.50,
    status: 'pending',
    createdAt: createdAt4,
    updatedAt: createdAt4,
    statusHistory: [{ status: 'pending', timestamp: createdAt4 }],
  });

  // Order 5 - Preparing
  const product7 = products[19]; // Matcha Cookie
  const product8 = products[5]; // Matcha Limonada
  const createdAt5 = randomRecentTime(2);
  const updatedAt5 = new Date(createdAt5.getTime() + 180000); // 3 min later
  mockOrders.push({
    id: '5',
    orderNumber: 'M005',
    items: [
      {
        productId: product7.id,
        productName: 'Matcha Cookie',
        quantity: 2,
        unitPrice: 4.99,
        subtotal: 9.98,
      },
      {
        productId: product8.id,
        productName: 'Matcha Limonada',
        quantity: 1,
        unitPrice: 4.99,
        subtotal: 4.99,
      },
    ],
    extras: { ashwagandha: true, honey: true },
    extrasTotal: 2.50,
    subtotal: 14.97,
    total: 17.47,
    status: 'preparing',
    createdAt: createdAt5,
    updatedAt: updatedAt5,
    statusHistory: [
      { status: 'pending', timestamp: createdAt5 },
      { status: 'preparing', timestamp: updatedAt5 },
    ],
  });

  // Order 6 - Completed (for history)
  const product9 = products[13]; // Banana Brulee Latte
  const createdAt6 = randomRecentTime(3);
  const completedAt6 = new Date(createdAt6.getTime() + 900000); // 15 min later
  mockOrders.push({
    id: '6',
    orderNumber: 'M006',
    items: [
      {
        productId: product9.id,
        productName: 'Banana Brûlée Latte',
        quantity: 1,
        milk: 'oat',
        size: 'large',
        unitPrice: 7.50,
        subtotal: 7.50,
      },
    ],
    extras: { collagen: true },
    extrasTotal: 1.50,
    subtotal: 7.50,
    total: 9.00,
    status: 'completed',
    createdAt: createdAt6,
    updatedAt: completedAt6,
    completedAt: completedAt6,
    statusHistory: [
      { status: 'pending', timestamp: createdAt6 },
      { status: 'preparing', timestamp: new Date(createdAt6.getTime() + 300000) },
      { status: 'ready', timestamp: new Date(createdAt6.getTime() + 600000) },
      { status: 'completed', timestamp: completedAt6 },
    ],
  });

  // Order 7 - Completed (for history)
  const product10 = products[17]; // Sandwich Tuna
  const createdAt7 = randomRecentTime(4);
  const completedAt7 = new Date(createdAt7.getTime() + 1200000); // 20 min later
  mockOrders.push({
    id: '7',
    orderNumber: 'M007',
    items: [
      {
        productId: product10.id,
        productName: 'Sándwich Tuna',
        quantity: 2,
        unitPrice: 12.99,
        subtotal: 25.98,
      },
    ],
    extras: {},
    extrasTotal: 0,
    subtotal: 25.98,
    total: 25.98,
    status: 'completed',
    createdAt: createdAt7,
    updatedAt: completedAt7,
    completedAt: completedAt7,
    statusHistory: [
      { status: 'pending', timestamp: createdAt7 },
      { status: 'preparing', timestamp: new Date(createdAt7.getTime() + 400000) },
      { status: 'ready', timestamp: new Date(createdAt7.getTime() + 800000) },
      { status: 'completed', timestamp: completedAt7 },
    ],
  });

  // Order 8 - Ready
  const createdAt8 = randomRecentTime(1.2);
  mockOrders.push({
    id: '8',
    orderNumber: 'M008',
    items: [
      {
        productId: products[2].id,
        productName: 'Blueberry Cinnamon Matcha',
        quantity: 1,
        milk: 'almond',
        size: 'large',
        unitPrice: 8.00,
        subtotal: 8.00,
      },
    ],
    extras: { collagen: true, ashwagandha: true, honey: true },
    extrasTotal: 4.00,
    subtotal: 8.00,
    total: 12.00,
    status: 'ready',
    createdAt: createdAt8,
    updatedAt: new Date(createdAt8.getTime() + 720000),
    statusHistory: [
      { status: 'pending', timestamp: createdAt8 },
      { status: 'preparing', timestamp: new Date(createdAt8.getTime() + 240000) },
      { status: 'ready', timestamp: new Date(createdAt8.getTime() + 720000) },
    ],
  });

  return mockOrders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}
