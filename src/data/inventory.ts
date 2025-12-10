export interface StoreInventory {
  storeId: string;
  storeName: string;
  location: string;
  sku: string;
  quantity: number;
}

export const inventory: StoreInventory[] = [
  { storeId: 'S001', storeName: 'Phoenix Mall Mumbai', location: 'Mumbai', sku: 'LV001', quantity: 15 },
  { storeId: 'S001', storeName: 'Phoenix Mall Mumbai', location: 'Mumbai', sku: 'AB002', quantity: 22 },
  { storeId: 'S001', storeName: 'Phoenix Mall Mumbai', location: 'Mumbai', sku: 'VH003', quantity: 5 },
  { storeId: 'S001', storeName: 'Phoenix Mall Mumbai', location: 'Mumbai', sku: 'PB004', quantity: 8 },
  { storeId: 'S002', storeName: 'DLF Mall Delhi', location: 'Delhi', sku: 'LV001', quantity: 12 },
  { storeId: 'S002', storeName: 'DLF Mall Delhi', location: 'Delhi', sku: 'AB002', quantity: 18 },
  { storeId: 'S002', storeName: 'DLF Mall Delhi', location: 'Delhi', sku: 'VH008', quantity: 25 },
  { storeId: 'S002', storeName: 'DLF Mall Delhi', location: 'Delhi', sku: 'LV011', quantity: 3 },
  { storeId: 'S003', storeName: 'Forum Mall Bangalore', location: 'Bangalore', sku: 'AB007', quantity: 20 },
  { storeId: 'S003', storeName: 'Forum Mall Bangalore', location: 'Bangalore', sku: 'PB009', quantity: 30 },
  { storeId: 'S003', storeName: 'Forum Mall Bangalore', location: 'Bangalore', sku: 'AP005', quantity: 14 },
  { storeId: 'S003', storeName: 'Forum Mall Bangalore', location: 'Bangalore', sku: 'AB012', quantity: 16 },
  { storeId: 'S004', storeName: 'Express Avenue Chennai', location: 'Chennai', sku: 'VH003', quantity: 7 },
  { storeId: 'S004', storeName: 'Express Avenue Chennai', location: 'Chennai', sku: 'LV006', quantity: 10 },
  { storeId: 'S004', storeName: 'Express Avenue Chennai', location: 'Chennai', sku: 'AP010', quantity: 12 },
  { storeId: 'S005', storeName: 'Inorbit Mall Hyderabad', location: 'Hyderabad', sku: 'LV001', quantity: 0 },
  { storeId: 'S005', storeName: 'Inorbit Mall Hyderabad', location: 'Hyderabad', sku: 'PB004', quantity: 6 },
  { storeId: 'S005', storeName: 'Inorbit Mall Hyderabad', location: 'Hyderabad', sku: 'VH008', quantity: 19 },
];

export const checkInventory = (sku: string, storeId?: string) => {
  if (storeId) {
    return inventory.filter(i => i.sku === sku && i.storeId === storeId);
  }
  return inventory.filter(i => i.sku === sku);
};

export const getStoreInventory = (storeId: string) => inventory.filter(i => i.storeId === storeId);
