// services/analyticsService.ts
export interface SellerAnalyticsData {
  status: number;
  message: string;
  data: {
    year: number;
    seller_info: {
      seller_id: number;
      business_name: string;
    };
    yearly_summary: {
      paid_amount: number;
      unpaid_amount: number;
      total_amount: number;
    };
    monthly_breakdown: Array<{
      month: number;
      month_name: string;
      payment_summary: {
        paid_amount: number;
        unpaid_amount: number;
        total_amount: number;
      };
      products_sold: Array<{
        product_id: number;
        product_name: string;
        unit: string;
        quantity_sold: number;
        revenue: number;
        orders: number;
      }>;
      category_wise_orders: Array<{
        category_id: number;
        category_name: string;
        total_orders: number;
        total_revenue: number;
      }>;
    }>;
  };
}

export interface BuyerAnalyticsData {
  status: number;
  message: string;
  data: {
    year: number;
    yearly_summary: {
      total_spent: number;
      total_orders: number;
      total_quantity_purchased: number;
    };
    monthly_breakdown: Array<{
      month: number;
      month_name: string;
      spending_summary: {
        total_spent: number;
        total_orders: number;
        total_quantity_purchased: number;
        total_shipping_paid: number;
        average_order_value: number;
      };
      products_purchased: Array<{
        product_id: number | null;
        product_name: string | null;
        category: string | null;
        unit: string | null;
        quantity_purchased: number;
        amount_spent: number;
        orders: number;
      }>;
    }>;
  };
}

export class AnalyticsService {
  private baseURL = 'https://api.ecoflaresolutions.com/dashboard';

  async getSellerAnalytics(year: number, token: string): Promise<SellerAnalyticsData> {
    try {
      const response = await fetch(`${this.baseURL}/admin_user/?year=${year}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching seller analytics:', error);
      throw error;
    }
  }

  async getBuyerAnalytics(year: number, token: string): Promise<BuyerAnalyticsData> {
    try {
      const response = await fetch(`${this.baseURL}/admin_user/?year=${year}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching buyer analytics:', error);
      throw error;
    }
  }
}

export const analyticsService = new AnalyticsService();