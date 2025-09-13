import React, { createContext, useContext, useState } from 'react';

type CartContextType = {
    cart: any[];
    addToCart: (product: any) => void;
    removeFromCart : (productId: string)=>void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [cart, setCart] = useState<any[]>([]);

    const addToCart = (product: any) => {
        setCart((prev) => {
            // Check if product already exists in cart
            const existing = prev.find((p) => p._id === product._id);

            if (existing) {
                // increase quantity
                return prev.map((p) =>
                    p._id === product._id ? { ...p, quantity: (p.quantity || 1) + 1 } : p
                );
            } else {
                // add new product with quantity 1
                return [...prev, { ...product, quantity: 1 }];
            }
        });
    };

    const removeFromCart = (productId: string) => {
        setCart((prevCart) =>
            prevCart.filter((item) => item._id !== productId) // remove item by id
        );
    };



    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
            {children}
        </CartContext.Provider>

    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used inside CartProvider');
    return context;
};
