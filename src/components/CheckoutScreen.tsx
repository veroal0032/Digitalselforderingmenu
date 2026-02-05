import { motion } from 'motion/react';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { Language, products, translations, extras } from '../lib/data';
import { CartItem, OrderExtras } from '../App';
import { useState } from 'react';
import { ExtrasModal } from './ExtrasModal';

interface CheckoutScreenProps {
  language: Language;
  cart: CartItem[];
  orderNumber: number;
  orderExtras: OrderExtras;
  onSetExtras: (extras: OrderExtras) => void;
  onBackToMenu: () => void;
}

export function CheckoutScreen({
  language,
  cart,
  orderNumber,
  orderExtras,
  onSetExtras,
  onBackToMenu,
}: CheckoutScreenProps) {
  const [showExtrasModal, setShowExtrasModal] = useState(true);
  const [extrasConfirmed, setExtrasConfirmed] = useState(false);
  const t = translations[language];

  const cartWithProducts = cart.map((item) => {
    const product = products.find((p) => p.id === item.productId)!;
    return { ...item, product };
  });

  const subtotal = cartWithProducts.reduce((sum, item) => {
    let itemPrice = item.product.price;
    if (item.size === 'large') {
      itemPrice += 1.00;
    }
    return sum + itemPrice * item.quantity;
  }, 0);

  const extrasTotal = 
    (orderExtras.collagen ? extras.find(e => e.id === 'collagen')!.price : 0) +
    (orderExtras.ashwagandha ? extras.find(e => e.id === 'ashwagandha')!.price : 0) +
    (orderExtras.honey ? extras.find(e => e.id === 'honey')!.price : 0);

  const total = subtotal + extrasTotal;

  const handleExtrasConfirm = (selectedExtras: string[]) => {
    onSetExtras({
      collagen: selectedExtras.includes('collagen'),
      ashwagandha: selectedExtras.includes('ashwagandha'),
      honey: selectedExtras.includes('honey'),
    });
    setExtrasConfirmed(true);
    setShowExtrasModal(false);
  };

  return (
    <div className="min-h-screen bg-[#F8F9F5] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.6,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-2xl w-full"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 0.2,
            type: 'spring',
            stiffness: 200,
            damping: 15,
          }}
          className="flex justify-center mb-8"
        >
          <div className="bg-[#C8D96F] rounded-full p-6">
            <CheckCircle className="w-20 h-20 text-[#155020]" />
          </div>
        </motion.div>

        {/* Thank You Message */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="font-serif-brand text-4xl md:text-5xl text-[#155020] text-center mb-4"
        >
          {t.checkout.thankYou}
        </motion.h1>

        {/* Order Number */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center mb-8"
        >
          <p className="font-sans-brand text-gray-600 mb-2">
            {t.checkout.orderNumber}
          </p>
          <div className="inline-block bg-[#155020] text-white px-8 py-4 rounded-2xl">
            <span className="font-serif-brand text-5xl font-bold">
              #{orderNumber}
            </span>
          </div>
        </motion.div>

        {/* Payment Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-[#C8D96F] rounded-2xl p-6 mb-8"
        >
          <p className="font-sans-brand font-bold text-[#155020] text-center text-xl md:text-2xl">
            {t.checkout.paymentMessage}
          </p>
        </motion.div>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <h3 className="font-sans-brand font-bold text-[#155020] text-xl mb-4">
            {t.checkout.orderSummary}
          </h3>
          
          <div className="bg-[#F8F9F5] rounded-2xl p-6 space-y-4">
            {cartWithProducts.map((item) => {
              const productInfo = t.products[item.product.nameKey];
              const itemPrice = item.product.price + (item.size === 'large' ? 1.00 : 0);
              const itemTotal = itemPrice * item.quantity;
              const cartKey = `${item.productId}-${item.milk || 'none'}-${item.size || 'none'}`;
              
              return (
                <div key={cartKey} className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-sans-brand font-semibold text-[#155020]">
                      {productInfo.name}
                    </p>
                    {item.milk && (
                      <p className="font-sans-brand text-xs text-[#155020]/60">
                        {t.milkSelection[item.milk]} • {t.milkSelection[item.size!]}
                      </p>
                    )}
                    <p className="font-sans-brand text-sm text-gray-600">
                      ${itemPrice.toFixed(2)} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-sans-brand font-bold text-[#155020]">
                    ${itemTotal.toFixed(2)}
                  </p>
                </div>
              );
            })}
            
            {/* Extras */}
            {extrasConfirmed && extrasTotal > 0 && (
              <>
                <div className="border-t border-gray-300 pt-4">
                  <p className="font-sans-brand font-semibold text-[#155020] mb-2">
                    {language === 'en' ? 'Extras' : 'Extras'}
                  </p>
                  {orderExtras.collagen && (
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-sans-brand text-gray-600">
                        {t.extras.collagen}
                      </span>
                      <span className="font-sans-brand text-gray-600">
                        +${extras.find(e => e.id === 'collagen')!.price.toFixed(2)}
                      </span>
                    </div>
                  )}
                  {orderExtras.ashwagandha && (
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-sans-brand text-gray-600">
                        {t.extras.ashwagandha}
                      </span>
                      <span className="font-sans-brand text-gray-600">
                        +${extras.find(e => e.id === 'ashwagandha')!.price.toFixed(2)}
                      </span>
                    </div>
                  )}
                  {orderExtras.honey && (
                    <div className="flex justify-between text-sm">
                      <span className="font-sans-brand text-gray-600">
                        {t.extras.honey}
                      </span>
                      <span className="font-sans-brand text-gray-600">
                        +${extras.find(e => e.id === 'honey')!.price.toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              </>
            )}
            
            {/* Total */}
            <div className="border-t-2 border-gray-300 pt-4 flex justify-between items-center">
              <span className="font-sans-brand font-bold text-xl text-[#155020]">
                {t.cart.total}
              </span>
              <span className="font-serif-brand text-3xl font-bold text-[#155020]">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Back to Menu Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onBackToMenu}
          className="w-full bg-[#155020] hover:bg-[#0d3a16] text-white py-5 rounded-2xl font-sans-brand font-bold text-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3"
        >
          <ArrowLeft className="w-6 h-6" />
          <span>{t.checkout.backToMenu}</span>
        </motion.button>
      </motion.div>

      {/* Extras Modal */}
      <ExtrasModal
        isOpen={showExtrasModal}
        onClose={() => {
          setExtrasConfirmed(true);
          setShowExtrasModal(false);
        }}
        onConfirm={handleExtrasConfirm}
        language={language}
      />
    </div>
  );
}
