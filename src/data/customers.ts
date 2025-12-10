export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  loyaltyTier: 'bronze' | 'silver' | 'gold' | 'platinum';
  loyaltyPoints: number;
  preferences: string[];
  purchaseHistory: string[];
  avgOrderValue: number;
}

export const customers: Customer[] = [
  { id: 'C001', name: 'Priya Sharma', email: 'priya@email.com', phone: '+91-9876543210', loyaltyTier: 'gold', loyaltyPoints: 2500, preferences: ['formal', 'ethnic'], purchaseHistory: ['shirt', 'blazer', 'saree'], avgOrderValue: 4500 },
  { id: 'C002', name: 'Rahul Verma', email: 'rahul@email.com', phone: '+91-9876543211', loyaltyTier: 'platinum', loyaltyPoints: 5000, preferences: ['casual', 'sportswear'], purchaseHistory: ['jeans', 'tshirt', 'sneakers'], avgOrderValue: 6200 },
  { id: 'C003', name: 'Ananya Iyer', email: 'ananya@email.com', phone: '+91-9876543212', loyaltyTier: 'silver', loyaltyPoints: 1200, preferences: ['western', 'accessories'], purchaseHistory: ['dress', 'handbag'], avgOrderValue: 3200 },
  { id: 'C004', name: 'Arjun Mehta', email: 'arjun@email.com', phone: '+91-9876543213', loyaltyTier: 'gold', loyaltyPoints: 3200, preferences: ['formal', 'luxury'], purchaseHistory: ['suit', 'watch', 'shoes'], avgOrderValue: 8500 },
  { id: 'C005', name: 'Sneha Patel', email: 'sneha@email.com', phone: '+91-9876543214', loyaltyTier: 'bronze', loyaltyPoints: 500, preferences: ['ethnic', 'traditional'], purchaseHistory: ['kurti'], avgOrderValue: 1800 },
  { id: 'C006', name: 'Vikram Singh', email: 'vikram@email.com', phone: '+91-9876543215', loyaltyTier: 'platinum', loyaltyPoints: 7500, preferences: ['formal', 'premium'], purchaseHistory: ['blazer', 'shirt', 'trousers', 'tie'], avgOrderValue: 9200 },
  { id: 'C007', name: 'Kavya Reddy', email: 'kavya@email.com', phone: '+91-9876543216', loyaltyTier: 'gold', loyaltyPoints: 2800, preferences: ['western', 'casual'], purchaseHistory: ['jeans', 'top', 'jacket'], avgOrderValue: 4100 },
  { id: 'C008', name: 'Aditya Kumar', email: 'aditya@email.com', phone: '+91-9876543217', loyaltyTier: 'silver', loyaltyPoints: 1500, preferences: ['sportswear', 'athleisure'], purchaseHistory: ['trackpants', 'hoodie'], avgOrderValue: 2900 },
  { id: 'C009', name: 'Meera Nair', email: 'meera@email.com', phone: '+91-9876543218', loyaltyTier: 'gold', loyaltyPoints: 3500, preferences: ['ethnic', 'designer'], purchaseHistory: ['lehenga', 'jewelry'], avgOrderValue: 12000 },
  { id: 'C010', name: 'Rohan Gupta', email: 'rohan@email.com', phone: '+91-9876543219', loyaltyTier: 'bronze', loyaltyPoints: 800, preferences: ['casual', 'basics'], purchaseHistory: ['tshirt', 'shorts'], avgOrderValue: 2200 },
];

export const getCustomerById = (id: string) => customers.find(c => c.id === id);
export const getCustomerByPhone = (phone: string) => customers.find(c => c.phone === phone);
