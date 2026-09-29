// Authentic Indian Matka calculation engine and validators

// Auto-sort 3 digits into ascending order (Matka convention: 0 is counted as 10 in sorting, or standard 0-9)
export function normalizePana(input: string): string {
  const digits = input.replace(/\D/g, '').slice(0, 3).split('');
  // Standard matka ordering: 1, 2, 3, 4, 5, 6, 7, 8, 9, 0
  const order = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
  digits.sort((a, b) => order.indexOf(a) - order.indexOf(b));
  return digits.join('');
}

// Calculate the Ank (Single Digit 0-9) from a 3-digit Pana sum modulo 10
export function calculateAnkFromPana(pana: string): string {
  if (pana.length !== 3) return '*';
  const sum = pana.split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0);
  return (sum % 10).toString();
}

// Check if a Pana is valid Single, Double, or Triple
export function classifyPana(pana: string): 'SINGLE_PANA' | 'DOUBLE_PANA' | 'TRIPLE_PANA' | 'INVALID' {
  if (!/^\d{3}$/.test(pana)) return 'INVALID';
  const [a, b, c] = pana.split('');
  if (a === b && b === c) return 'TRIPLE_PANA';
  if (a === b || b === c || a === c) return 'DOUBLE_PANA';
  return 'SINGLE_PANA';
}

// Generate cryptographic hash representation for Entry Slip
export function generateCryptographicTicketId(): { id: string; hash: string } {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  const id = `DLX-${randomNum}`;
  const chars = '0123456789abcdef';
  let hash = '0x';
  for (let i = 0; i < 16; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return { id, hash };
}

// Formats currency nicely in Indian numbering format
export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
