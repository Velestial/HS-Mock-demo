import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../types';
import { fetchProducts } from '../services/api';
import { mapWooProductToAppProduct } from '../utils/productMapper';

interface ProductContextType {
    products: Product[];
    loading: boolean;
    error: string | null;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProducts = () => {
    const context = useContext(ProductContext);
    if (!context) throw new Error('useProducts must be used within a ProductProvider');
    return context;
};

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const wooProducts = await fetchProducts();
                const mappedProducts = wooProducts.map(mapWooProductToAppProduct);
                setProducts(mappedProducts);
            } catch (err: any) {
                console.error("Failed to load products:", err);
                setError(err.message || 'Failed to load products');
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, []);

    return (
        <ProductContext.Provider value={{ products, loading, error }}>
            {children}
        </ProductContext.Provider>
    );
};
