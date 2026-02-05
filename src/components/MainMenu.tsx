import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import { Language, products, Category, MilkType, DrinkSize } from '../lib/data';
import { translations } from '../lib/data';
import { ProductCard } from './ProductCard';
import { CategoryTabs } from './CategoryTabs';
import { CartDrawer } from './CartDrawer';
import { SweetsAnnouncement } from './SweetsAnnouncement';
import { CartItem } from '../App';

interface MainMenuProps {
  language: Language;
  cart: CartItem[];
  onAddToCart: (productId: string, milk?: MilkType, size?: DrinkSize) => void;
  onUpdateQuantity: (productId: string, delta: number, milk?: MilkType, size?: DrinkSize) => void;
  onRemoveFromCart: (productId: string, milk?: MilkType, size?: DrinkSize) => void;
  onCheckout: () => void;
  onBackToWelcome: () => void;
}

export function MainMenu({
  language,
  cart,
  onAddToCart,
  onUpdateQuantity,
  onRemoveFromCart,
  onCheckout,
  onBackToWelcome,
}: MainMenuProps) {
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const t = translations[language];

  const filteredProducts =
    activeCategory === 'all'
      ? products.filter((p) => p.category !== 'sweets')
      : products.filter((p) => p.category === activeCategory);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#F8F9F5] pb-24">
      {/* Sticky Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-0 z-40 bg-white shadow-md"
      >
        <div className="flex items-center justify-between px-6 md:px-12 py-6">
          {/* Back to Language Selection Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBackToWelcome}
            className="bg-[#155020]/10 text-[#155020] p-3 rounded-full hover:bg-[#155020]/20 transition-colors"
            title={language === 'en' ? 'Change language' : 'Cambiar idioma'}
          >
            <ArrowLeft className="w-6 h-6" />
          </motion.button>

          {/* Brand Logo */}
          <h1 className="font-[Abril_Fatface] text-4xl md:text-5xl font-bold text-[#155020] tracking-tight">
            MATCHA CHÁ
          </h1>

          {/* Floating Cart Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsCartOpen(true)}
            className="relative bg-[#155020] text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-shadow"
          >
            <ShoppingCart className="w-7 h-7" />
            
            {/* Item Count Badge */}
            <AnimatePresence>
              {totalItems > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-2 -right-2 bg-[#C8D96F] text-[#155020] w-8 h-8 rounded-full flex items-center justify-center font-sans-brand font-bold text-sm shadow-lg"
                >
                  {totalItems}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Category Navigation */}
        <CategoryTabs
          language={language}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />
      </motion.header>

      {/* Product Grid */}
      <motion.div
        key={activeCategory}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="px-6 md:px-12 py-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {activeCategory === 'sweets' && (
            <SweetsAnnouncement language={language} />
          )}
          
          {filteredProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              language={language}
              onAddToCart={onAddToCart}
              index={index}
            />
          ))}
        </div>
      </motion.div>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        language={language}
        cart={cart}
        onUpdateQuantity={onUpdateQuantity}
        onRemoveFromCart={onRemoveFromCart}
        onCheckout={() => {
          setIsCartOpen(false);
          onCheckout();
        }}
      />
    </div>
  );
}