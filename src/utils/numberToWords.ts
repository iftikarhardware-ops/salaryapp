/**
 * Converts numeric salary figures into Bengali and English words for official Payslips & Bank Advices
 */

const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

export function toBanglaNumber(num: number | string): string {
  return String(num).replace(/\d/g, (d) => banglaDigits[parseInt(d, 10)]);
}

export function formatCurrency(amount: number, symbol: string = '৳', useBanglaNumber: boolean = false): string {
  const rounded = Math.round(amount);
  const formatted = new Intl.NumberFormat('en-IN').format(rounded);
  if (useBanglaNumber) {
    return `${symbol} ${toBanglaNumber(formatted)}`;
  }
  return `${symbol} ${formatted}`;
}

// Bengali number in words
const bnUnits = ['', 'এক', 'দুই', 'তিন', 'চার', 'পাঁচ', 'ছয়', 'সাত', 'আট', 'নয়', 'দশ', 
  'এগারো', 'বারো', 'তেরো', 'চৌদ্দ', 'পনেরো', 'ষোলো', 'সতেরো', 'আঠারো', 'উনিশ', 'বিশ',
  'একুশ', 'বাইশ', 'তেইশ', 'চব্বিশ', 'পঁচিশ', 'ছাব্বিশ', 'সাতাশ', 'আটাশ', 'ঊনত্রিশ', 'ত্রিশ',
  'একত্রিশ', 'বত্রিশ', 'তেত্রিশ', 'চৌত্রিশ', 'পঁয়ত্রিশ', 'ছত্রিশ', 'সাঁইত্রিশ', 'আটত্রিশ', 'ঊনচল্লিশ', 'চল্লিশ',
  'একচল্লিশ', 'বিয়াল্লিশ', 'তেতাল্লিশ', 'চুয়াল্লিশ', 'পঁয়তাল্লিশ', 'ছেচল্লিশ', 'সাতচল্লিশ', 'আটচল্লিশ', 'ঊনপঞ্চাশ', 'পঞ্চাশ',
  'একান্ন', 'বায়ান্ন', 'তিপ্পান্ন', 'চুয়ান্ন', 'পঞ্চান্ন', 'ছাপ্পান্ন', 'সাতান্ন', 'আটান্ন', 'ঊনষাট', 'ষাট',
  'একষট্টি', 'বাষট্টি', 'তেষট্টি', 'চৌষট্টি', 'পঁয়ষট্টি', 'ছেষট্টি', 'সাতষট্টি', 'আটষট্টি', 'ঊনসত্তর', 'সত্তর',
  'একাত্তর', 'বাহাত্তর', 'তিয়াত্তর', 'চুয়াত্তর', 'পঁচাত্তর', 'ছিয়াত্তর', 'সাতাত্তর', 'আটাত্তর', 'ঊনআশি', 'আশি',
  'একাশি', 'বিরাশি', 'তিরাশি', 'চুরাশি', 'পঁচাশি', 'ছিয়াশি', 'সাতাশি', 'অষ্টআশি', 'ঊননব্বই', 'নব্বই',
  'একানব্বই', 'বানব্বই', 'তিরানব্বই', 'চুরানব্বই', 'পঁচানব্বই', 'ছিয়ানব্বই', 'সাতানব্বই', 'আটানব্বই', 'নিরানব্বই'];

export function numberToBanglaWords(num: number): string {
  const n = Math.floor(Math.abs(num));
  if (n === 0) return 'শূন্য টাকা মাত্র';

  let result = '';
  
  const crore = Math.floor(n / 10000000);
  const lakh = Math.floor((n % 10000000) / 100000);
  const thousand = Math.floor((n % 100000) / 1000);
  const hundred = Math.floor((n % 1000) / 100);
  const rest = n % 100;

  if (crore > 0) {
    result += (crore < 100 ? bnUnits[crore] : numberToBanglaWordsHelper(crore)) + ' কোটি ';
  }
  if (lakh > 0) {
    result += bnUnits[lakh] + ' লাখ ';
  }
  if (thousand > 0) {
    result += bnUnits[thousand] + ' হাজার ';
  }
  if (hundred > 0) {
    result += bnUnits[hundred] + ' শত ';
  }
  if (rest > 0) {
    result += bnUnits[rest] + ' ';
  }

  return result.trim() + ' টাকা মাত্র';
}

function numberToBanglaWordsHelper(n: number): string {
  if (n < 100) return bnUnits[n] || '';
  const h = Math.floor(n / 100);
  const r = n % 100;
  return (bnUnits[h] ? bnUnits[h] + ' শত ' : '') + (bnUnits[r] ? bnUnits[r] : '');
}

// English words converter
const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 
  'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

export function numberToEnglishWords(num: number): string {
  const n = Math.floor(Math.abs(num));
  if (n === 0) return 'Zero Taka Only';

  function convertLessThousand(val: number): string {
    if (val === 0) return '';
    if (val < 20) return a[val] + ' ';
    if (val < 100) return b[Math.floor(val / 10)] + (val % 10 !== 0 ? '-' + a[val % 10] : '') + ' ';
    return a[Math.floor(val / 100)] + ' Hundred ' + convertLessThousand(val % 100);
  }

  const crore = Math.floor(n / 10000000);
  const lakh = Math.floor((n % 10000000) / 100000);
  const thousand = Math.floor((n % 100000) / 1000);
  const remainder = n % 1000;

  let words = '';
  if (crore > 0) {
    words += convertLessThousand(crore) + 'Crore ';
  }
  if (lakh > 0) {
    words += convertLessThousand(lakh) + 'Lakh ';
  }
  if (thousand > 0) {
    words += convertLessThousand(thousand) + 'Thousand ';
  }
  if (remainder > 0) {
    words += convertLessThousand(remainder);
  }

  return words.trim() + ' Taka Only';
}
