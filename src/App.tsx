import { useState } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { MainMenu } from './components/MainMenu';
import { CheckoutScreen } from './components/CheckoutScreen';
import { Language, MilkType, DrinkSize } from './lib/data';

export type AppScreen = 'welcome' | 'menu' | 'checkout';

export interface CartItem {
  productId: string;
  quantity: number;
  milk?: MilkType;
  size?: DrinkSize;
}

export interface OrderExtras {
  collagen: boolean;
  ashwagandha: boolean;
  honey: boolean;
}

export default function App() {
  const [screen, setScreen] = useState<AppScreen>('welcome');
  const [language, setLanguage] = useState<Language>('en');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderNumber, setOrderNumber] = useState<number | null>(null);
  const [orderExtras, setOrderExtras] = useState<OrderExtras>({
    collagen: false,
    ashwagandha: false,
    honey: false,
  });

  const handleSelectLanguage = (lang: Language) => {
    setLanguage(lang);
    setScreen('menu');
  };

  const handleAddToCart = (productId: string, milk?: MilkType, size?: DrinkSize) => {
    setCart((prev) => {
      // For items with milk, treat each milk+size combination as unique
      if (milk && size) {
        const existing = prev.find(
          (item) => 
            item.productId === productId && 
            item.milk === milk && 
            item.size === size
        );
        if (existing) {
          return prev.map((item) =>
            item.productId === productId && 
            item.milk === milk && 
            item.size === size
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return [...prev, { productId, quantity: 1, milk, size }];
      }
      
      // For items without milk, treat as before
      const existing = prev.find((item) => item.productId === productId && !item.milk);
      if (existing) {
        return prev.map((item) =>
          item.productId === productId && !item.milk
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { productId, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId: string, delta: number, milk?: MilkType, size?: DrinkSize) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          // Match by productId and milk+size if provided
          const matches = milk && size
            ? item.productId === productId && item.milk === milk && item.size === size
            : item.productId === productId && !item.milk;
            
          return matches
            ? { ...item, quantity: item.quantity + delta }
            : item;
        })
        .filter((item) => item.quantity > 0);
    });
  };

  const handleRemoveFromCart = (productId: string, milk?: MilkType, size?: DrinkSize) => {
    setCart((prev) =>
      prev.filter((item) => {
        if (milk && size) {
          return !(item.productId === productId && item.milk === milk && item.size === size);
        }
        return !(item.productId === productId && !item.milk);
      })
    );
  };

  const handleCheckout = () => {
    // Generate random 3-digit order number
    const randomOrderNumber = Math.floor(Math.random() * 900) + 100;
    setOrderNumber(randomOrderNumber);
    setScreen('checkout');
  };

  const handleSetExtras = (extras: OrderExtras) => {
    setOrderExtras(extras);
  };

  const handleBackToMenu = () => {
    setCart([]);
    setOrderNumber(null);
    setOrderExtras({ collagen: false, ashwagandha: false, honey: false });
    setScreen('menu');
  };

  const handleResetToWelcome = () => {
    setCart([]);
    setOrderNumber(null);
    setOrderExtras({ collagen: false, ashwagandha: false, honey: false });
    setScreen('welcome');
  };

  return (
    <>
      {screen === 'welcome' && (
        <WelcomeScreen onSelectLanguage={handleSelectLanguage} />
      )}
      {screen === 'menu' && (
        <MainMenu
          language={language}
          cart={cart}
          onAddToCart={handleAddToCart}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveFromCart={handleRemoveFromCart}
          onCheckout={handleCheckout}
          onBackToWelcome={handleResetToWelcome}
        />
      )}
      {screen === 'checkout' && orderNumber && (
        <CheckoutScreen
          language={language}
          cart={cart}
          orderNumber={orderNumber}
          orderExtras={orderExtras}
          onSetExtras={handleSetExtras}
          onBackToMenu={handleBackToMenu}
        />
      )}
    </>
  );
}