import axios from 'axios';

const API_URL = '/api';

// --- Auth Types (Phase 2) ---

export interface AuthUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

export interface LoginResponse {
  success: true;
  accessToken: string;
  user: AuthUser;
}

export interface RefreshResponse {
  success: true;
  accessToken: string;
  user: AuthUser;
}

// --- Order / Payment API ---

interface OrderLineItem {
  product_id: number;
  name: string;
  price: string;
  quantity: number;
}

interface OrderShippingLine {
  method_id: string;
  method_title: string;
  total: string;
}

interface OrderAddress {
  first_name: string;
  last_name: string;
  address_1: string;
  address_2?: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  email?: string;
  phone?: string;
}

interface OrderPayload {
  payment_method: string;
  payment_method_title: string;
  set_paid: boolean;
  billing: OrderAddress;
  shipping: OrderAddress;
  line_items: OrderLineItem[];
  shipping_lines: OrderShippingLine[];
}

interface CustomerUpdatePayload {
  first_name?: string;
  last_name?: string;
  email?: string;
  billing?: Partial<OrderAddress>;
  shipping?: Partial<OrderAddress>;
}

export const createOrder = async (orderData: OrderPayload) => {
    try {
        const response = await axios.post(`${API_URL}/create-order`, orderData);
        return response.data;
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
};

export const createPaymentIntent = async (amount: number, wcOrderId?: number) => {
    try {
        const amountInCents = Math.round(amount * 100);
        const response = await axios.post(`${API_URL}/create-payment-intent`, {
          amount: amountInCents,
          ...(wcOrderId !== undefined && { wcOrderId })
        });
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

/**
 * @deprecated Use loginUser(email, password) from AuthContext instead.
 * Legacy single-argument login that matched by email only — no real auth.
 */
export const loginUserLegacy = async (email: string) => {
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

export const updateCustomer = async (customerId: number, data: CustomerUpdatePayload) => {
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

// --- Auth API (Phase 2) ---
// All auth calls use withCredentials: true so the browser sends/receives the hs_refresh httpOnly cookie

export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>(`${API_URL}/auth/login`, { email, password }, {
    withCredentials: true,
  });
  return response.data;
};

export const refreshSession = async (): Promise<RefreshResponse> => {
  const response = await axios.post<RefreshResponse>(`${API_URL}/auth/refresh`, {}, {
    withCredentials: true,
  });
  return response.data;
};

export const logoutUser = async (): Promise<void> => {
  await axios.post(`${API_URL}/auth/logout`, {}, {
    withCredentials: true,
  });
};

export const registerUser = async (
  firstName: string,
  email: string,
  password: string
): Promise<LoginResponse & { requiresLogin?: boolean }> => {
  const response = await axios.post(`${API_URL}/auth/register`, { firstName, email, password }, {
    withCredentials: true,
  });
  return response.data;
};
