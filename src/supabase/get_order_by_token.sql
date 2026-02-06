-- ============================================================================
-- MATCHA CHÁ - Función RPC Adicional: Obtener Pedido por Token
-- Esta función permite a los clientes anónimos consultar SU pedido con el token
-- ============================================================================

-- Función: Obtener pedido por kiosk token (para tracking del cliente)
CREATE OR REPLACE FUNCTION get_order_by_kiosk_token(token TEXT)
RETURNS JSONB AS $$
DECLARE
  order_record RECORD;
  items JSONB;
BEGIN
  -- Obtener la orden
  SELECT * INTO order_record
  FROM public.orders
  WHERE kiosk_token = token;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'error', 'Order not found',
      'message', 'No se encontró el pedido con este token'
    );
  END IF;
  
  -- Obtener los items del pedido
  SELECT jsonb_agg(
    jsonb_build_object(
      'product_name', product_name,
      'quantity', quantity,
      'milk', milk,
      'size', size,
      'unit_price', unit_price,
      'subtotal', subtotal
    )
  ) INTO items
  FROM public.order_items
  WHERE order_id = order_record.id;
  
  -- Retornar orden completa
  RETURN jsonb_build_object(
    'order_id', order_record.id,
    'order_number', order_record.order_number,
    'status', order_record.status,
    'items', items,
    'extras', jsonb_build_object(
      'collagen', order_record.extra_collagen,
      'ashwagandha', order_record.extra_ashwagandha,
      'honey', order_record.extra_honey
    ),
    'subtotal', order_record.subtotal,
    'extras_total', order_record.extras_total,
    'total', order_record.total,
    'created_at', order_record.created_at
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- INSTRUCCIONES DE USO
-- ============================================================================

-- Para ejecutar este script:
-- 1. Abre Supabase SQL Editor
-- 2. Pega este script
-- 3. Ejecuta
--
-- Esta función permite a los clientes consultar su pedido usando el kiosk_token
-- que recibieron al crear la orden.
--
-- Ejemplo de uso desde el frontend:
-- const { data } = await supabase.rpc('get_order_by_kiosk_token', {
--   token: 'el-kiosk-token-aqui'
-- });
