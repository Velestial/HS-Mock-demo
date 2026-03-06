import axios from 'axios';

const API_URL = '/api';

export const createOrder = async (orderData: any) => {
    try {
        const response = await axios.post(`${API_URL}/create-order`, orderData);
        return response.data;
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
};

export const createPaymentIntent = async (amount: number) => {
    try {
        const response = await axios.post(`${API_URL}/create-payment-intent`, { amount });
        return response.data;
    } catch (error) {
        console.error('Error creating payment intent:', error);
        throw error;
    }
};

export const updateOrderStatus = async (orderId: number, status: string, transactionId?: string) => {
    try {
        const response = await axios.post(`${API_URL}/update-order`, { orderId, status, transactionId });
        return response.data;
    } catch (error) {
        console.error('Error updating order:', error);
        throw error;
    }
};

// --- Customer API ---

export const loginUser = async (email: string) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { email });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchCustomerOrders = async (customerId: number) => {
    try {
        const response = await axios.get(`${API_URL}/customer/${customerId}/orders`);
        return response.data;
    } catch (error) {
        console.error('Error fetching orders:', error);
        return [];
    }
};

export const updateCustomer = async (customerId: number, data: any) => {
    try {
        const response = await axios.put(`${API_URL}/customer/${customerId}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchCustomerDownloads = async (customerId: number) => {
    try {
        const response = await axios.get(`${API_URL}/customer/${customerId}/downloads`);
        return response.data;
    } catch (error) {
        return [];
    }
};

export const fetchProducts = async () => {
    try {
        const response = await axios.get(`${API_URL}/products`);
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};
