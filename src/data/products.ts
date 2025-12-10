export interface Product {
  sku: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  image: string;
  description: string;
  tags: string[];
  sizes: string[];
  colors: string[];
}

export const products: Product[] = [
  { sku: 'LV001', name: 'Premium Linen Shirt', brand: 'Louis Philippe', category: 'formal', price: 2999, image: '/products/shirt1.jpg', description: 'Classic white linen shirt', tags: ['formal', 'premium'], sizes: ['S', 'M', 'L', 'XL'], colors: ['white', 'blue'] },
  { sku: 'AB002', name: 'Slim Fit Chinos', brand: 'Allen Solly', category: 'casual', price: 2499, image: '/products/chinos1.jpg', description: 'Comfortable slim fit chinos', tags: ['casual', 'office'], sizes: ['30', '32', '34', '36'], colors: ['beige', 'navy', 'grey'] },
  { sku: 'VH003', name: 'Ethnic Silk Saree', brand: 'Van Heusen', category: 'ethnic', price: 8999, image: '/products/saree1.jpg', description: 'Pure silk saree with zari work', tags: ['ethnic', 'traditional', 'wedding'], sizes: ['Free'], colors: ['red', 'gold', 'green'] },
  { sku: 'PB004', name: 'Wool Blend Blazer', brand: 'Peter England', category: 'formal', price: 5999, image: '/products/blazer1.jpg', description: 'Single-breasted wool blazer', tags: ['formal', 'business'], sizes: ['38', '40', '42', '44'], colors: ['black', 'charcoal'] },
  { sku: 'AP005', name: 'Cotton Kurti', brand: 'Pantaloons', category: 'ethnic', price: 1499, image: '/products/kurti1.jpg', description: 'Printed cotton kurti', tags: ['ethnic', 'casual'], sizes: ['S', 'M', 'L', 'XL'], colors: ['pink', 'yellow', 'blue'] },
  { sku: 'LV006', name: 'Leather Formal Shoes', brand: 'Louis Philippe', category: 'footwear', price: 4999, image: '/products/shoes1.jpg', description: 'Genuine leather oxford shoes', tags: ['formal', 'premium'], sizes: ['7', '8', '9', '10'], colors: ['black', 'brown'] },
  { sku: 'AB007', name: 'Denim Jacket', brand: 'Allen Solly', category: 'casual', price: 3499, image: '/products/jacket1.jpg', description: 'Classic blue denim jacket', tags: ['casual', 'western'], sizes: ['S', 'M', 'L', 'XL'], colors: ['blue', 'black'] },
  { sku: 'VH008', name: 'Formal Trousers', brand: 'Van Heusen', category: 'formal', price: 2299, image: '/products/trousers1.jpg', description: 'Flat front formal trousers', tags: ['formal', 'office'], sizes: ['30', '32', '34', '36'], colors: ['black', 'grey', 'navy'] },
  { sku: 'PB009', name: 'Polo T-Shirt', brand: 'Peter England', category: 'casual', price: 999, image: '/products/polo1.jpg', description: 'Cotton polo t-shirt', tags: ['casual', 'basics'], sizes: ['S', 'M', 'L', 'XL'], colors: ['white', 'navy', 'red'] },
  { sku: 'AP010', name: 'Designer Handbag', brand: 'Pantaloons', category: 'accessories', price: 2999, image: '/products/bag1.jpg', description: 'Faux leather handbag', tags: ['accessories', 'western'], sizes: ['Free'], colors: ['black', 'tan', 'burgundy'] },
  { sku: 'LV011', name: 'Three-Piece Suit', brand: 'Louis Philippe', category: 'formal', price: 15999, image: '/products/suit1.jpg', description: 'Premium wool suit set', tags: ['formal', 'luxury', 'wedding'], sizes: ['38', '40', '42', '44'], colors: ['navy', 'charcoal'] },
  { sku: 'AB012', name: 'Casual Sneakers', brand: 'Allen Solly', category: 'footwear', price: 2799, image: '/products/sneakers1.jpg', description: 'Comfortable casual sneakers', tags: ['casual', 'sportswear'], sizes: ['7', '8', '9', '10'], colors: ['white', 'grey', 'black'] },
];

export const getProductBySku = (sku: string) => products.find(p => p.sku === sku);
export const getProductsByCategory = (category: string) => products.filter(p => p.category === category);
export const getProductsByTags = (tags: string[]) => products.filter(p => p.tags.some(t => tags.includes(t)));
