export function toBengaliNumber(num: number | string | null | undefined): string {
  if (num === null || num === undefined || num === "") {
    return "০";
  }

  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num
    .toString()
    .replace(/\d/g, (d) => bnDigits[parseInt(d, 10)]);
}

export function parseBengaliNumber(bnStr: string | null | undefined): number {
  if (!bnStr) return 0;
  
  const bnDigits: Record<string, string> = {
    '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
    '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9',
  };
  const cleanStr = bnStr.replace(/[০-৯]/g, (d) => bnDigits[d]).replace(/[^\d.-]/g, '');
  return parseFloat(cleanStr) || 0;
}

export function getBengaliDate(dateInput?: Date): string {
  const days = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
  const months = [
    'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
    'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
  ];

  const targetDate = dateInput || new Date("2026-10-06T10:00:00");
  const dayName = days[targetDate.getDay()];
  const dateNum = toBengaliNumber(targetDate.getDate());
  const monthName = months[targetDate.getMonth()];
  const yearNum = toBengaliNumber(targetDate.getFullYear());

  return `${dayName}, ${dateNum} ${monthName}, ${yearNum}`;
}
