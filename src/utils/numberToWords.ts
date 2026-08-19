// Indian English Currency Formatting and Number to Words Converter (Lakhs & Crores)

export function formatCurrency(amount: number, symbol: string = '₹'): string {
  if (isNaN(amount)) return `${symbol} 0.00`;
  
  // Format with Indian numbering system (e.g. 1,50,000.00)
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  
  const parts = absAmount.toFixed(2).split('.');
  let integerPart = parts[0];
  const decimalPart = parts[1];
  
  // Indian comma separation: last 3 digits, then every 2 digits
  if (integerPart.length > 3) {
    const lastThree = integerPart.substring(integerPart.length - 3);
    const otherNumbers = integerPart.substring(0, integerPart.length - 3);
    integerPart = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
  }
  
  const formatted = `${symbol} ${integerPart}.${decimalPart}`;
  return isNegative ? `-${formatted}` : formatted;
}

const ones = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
  'Seventeen', 'Eighteen', 'Nineteen'
];

const tens = [
  '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
];

function convertLessThanThousand(n: number): string {
  if (n === 0) return '';
  if (n < 20) return ones[n];
  if (n < 100) {
    return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + ones[n % 10] : '');
  }
  return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' and ' + convertLessThanThousand(n % 100) : '');
}

export function numberToEnglishWords(amount: number): string {
  const rounded = Math.round(amount);
  if (rounded === 0) return 'Rupees Zero Only';

  let n = Math.abs(rounded);
  let str = '';

  const crore = Math.floor(n / 10000000);
  n %= 10000000;

  const lakh = Math.floor(n / 100000);
  n %= 100000;

  const thousand = Math.floor(n / 1000);
  n %= 1000;

  const remainder = n;

  if (crore > 0) {
    str += convertLessThanThousand(crore) + ' Crore ';
  }
  if (lakh > 0) {
    str += convertLessThanThousand(lakh) + ' Lakh ';
  }
  if (thousand > 0) {
    str += convertLessThanThousand(thousand) + ' Thousand ';
  }
  if (remainder > 0) {
    str += convertLessThanThousand(remainder) + ' ';
  }

  return `Rupees ${str.trim()} Only`;
}
