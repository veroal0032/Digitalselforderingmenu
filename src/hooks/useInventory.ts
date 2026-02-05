import { useState, useEffect } from 'react';
import { InventoryProduct } from '../types/admin';
import { products, translations } from '../lib/data';

/**
 * Hook for managing inventory with mock data
 * In production, this would sync with Supabase
 */
export function useInventory() {
  const [inventory, setInventory] = useState<InventoryProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call and initialize inventory
    setTimeout(() => {
      setInventory(initializeInventory());
      setLoading(false);
    }, 400);
  }, []);

  const updateStock = (productId: string, newStock: number) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, stock: Math.max(0, newStock) } : item
      )
    );
  };

  const toggleAvailability = (productId: string) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, isAvailable: !item.isAvailable } : item
      )
    );
  };

  const updatePrice = (productId: string, newPrice: number) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, price: Math.max(0, newPrice) } : item
      )
    );
  };

  const getLowStockProducts = () => {
    return inventory.filter((item) => item.stock < item.lowStockThreshold);
  };

  const getProductsByCategory = (category: string) => {
    if (category === 'all') return inventory;
    return inventory.filter((item) => item.category === category);
  };

  const searchProducts = (query: string) => {
    const lowerQuery = query.toLowerCase();
    return inventory.filter((item) => {
      const productName = translations.en.products[item.nameKey as keyof typeof translations.en.products]?.name || '';
      return productName.toLowerCase().includes(lowerQuery);
    });
  };

  return {
    inventory,
    loading,
    updateStock,
    toggleAvailability,
    updatePrice,
    getLowStockProducts,
    getProductsByCategory,
    searchProducts,
  };
}

/**
 * Initialize inventory with random stock levels
 */
function initializeInventory(): InventoryProduct[] {
  return products.map((product) => {
    // Generate random stock between 5 and 50
    const stock = Math.floor(Math.random() * 46) + 5;
    
    // Some products intentionally have low stock
    const isLowStock = Math.random() < 0.3;
    const finalStock = isLowStock ? Math.floor(Math.random() * 4) + 1 : stock;

    return {
      id: product.id,
      nameKey: product.nameKey,
      category: product.category,
      price: product.price,
      image: product.image,
      requiresMilk: product.requiresMilk,
      stock: finalStock,
      isAvailable: true,
      lowStockThreshold: 5,
    };
  });
}
