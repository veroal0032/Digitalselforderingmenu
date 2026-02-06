import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export interface AppSettings {
  id: number;
  business_name: string;
  currency_symbol: string;
  tax_rate: number;
  extra_collagen_price: number;
  extra_ashwagandha_price: number;
  extra_honey_price: number;
  large_size_extra: number;
}

/**
 * Hook for loading app settings from Supabase
 */
export function useAppSettings() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('app_settings')
        .select('*')
        .eq('id', 1)
        .single();

      if (fetchError) {
        console.error('Error loading app settings:', fetchError);
        setError('Error al cargar configuración');
        return;
      }

      setSettings(data);
    } catch (err) {
      console.error('Unexpected error loading app settings:', err);
      setError('Error inesperado al cargar configuración');
    } finally {
      setLoading(false);
    }
  };

  const refreshSettings = () => {
    loadSettings();
  };

  return {
    settings,
    loading,
    error,
    refreshSettings,
  };
}
