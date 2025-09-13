export function formatPrice(value) {
  // Safety checks for undefined, null, or non-numeric values
  if (value === undefined || value === null) return '₹0';
  if (typeof value !== 'number') return '₹0';
  if (isNaN(value)) return '₹0';
  
  return `₹${value.toLocaleString('en-IN')}`;
}
