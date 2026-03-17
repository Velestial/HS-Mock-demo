import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../types';
import { fetchProducts } from '../services/api';
import { products as localProducts } from '../data/products';

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

const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [products, setProducts] = useState<Product[]>(localProducts);

    useEffect(() => {
        fetchProducts()
            .then((serverProducts: Product[]) => {
                if (!serverProducts?.length) return;
                setProducts(prev => prev.map(local => {
                    const match = serverProducts.find(s => normalize(s.name) === normalize(local.name));
                    if (!match) return local;
                    const image = match.image || local.image;
                    const images = match.images?.length ? match.images : local.images;
                    return { ...local, image, images };
                }));
            })
            .catch(() => {});
    }, []);

    return (
        <ProductContext.Provider value={{ products, loading: false, error: null }}>
            {children}
        </ProductContext.Provider>
    );
};
