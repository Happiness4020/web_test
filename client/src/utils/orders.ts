/**
 * Group products by name and count quantity
 */
export const groupProductsByName = (products: any[]) => {
  const grouped = new Map<string, { product: any; quantity: number }>();
  products.forEach((p) => {
    if (grouped.has(p.name)) {
      const item = grouped.get(p.name)!;
      item.quantity += 1;
    } else {
      grouped.set(p.name, { product: p, quantity: 1 });
    }
  });
  return Array.from(grouped.values());
};
