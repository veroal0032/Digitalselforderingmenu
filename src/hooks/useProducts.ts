import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export interface Product {
  id: string;
  name_key: string;
  category: string;
  price: number;
  image_url: string;
  requires_milk: boolean;
  stock: number;
  is_available: boolean;
}

/**
 * Hook for loading products from Supabase
 */
export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .eq('is_available', true)
        .order('category')
        .order('name_key');

      if (fetchError) {
        console.error('Error loading products:', fetchError);
        setError('Error al cargar productos');
        return;
      }

      setProducts(data || []);
    } catch (err) {
      console.error('Unexpected error loading products:', err);
      setError('Error inesperado al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  const refreshProducts = () => {
    loadProducts();
  };

  return {
    products,
    loading,
    error,
    refreshProducts,
  };
}
