/**
 * Default Categories Configuration
 *
 * This is the single source of truth for expense categories.
 * To add/modify categories, update this file and run the seed script.
 */

export interface CategoryDefinition {
  nameEn: string;
  nameHe: string;
  icon: string;
  color: string;
  isDefault: boolean;
  subCategories: SubCategoryDefinition[];
}

export interface SubCategoryDefinition {
  nameEn: string;
  nameHe: string;
}

export const DEFAULT_CATEGORIES: CategoryDefinition[] = [
  {
    nameEn: 'Entertainment',
    nameHe: 'פנאי',
    icon: '🎭',
    color: '#FF6B6B',
    isDefault: true,
    subCategories: [
      { nameEn: 'Restaurant', nameHe: 'מסעדה' },
      { nameEn: 'Shows', nameHe: 'הופעות' },
      { nameEn: 'Clothing', nameHe: 'ביגוד' },
      { nameEn: 'Trips', nameHe: 'טיולים' },
    ],
  },
  {
    nameEn: 'Food',
    nameHe: 'מזון',
    icon: '🍔',
    color: '#4ECDC4',
    isDefault: true,
    subCategories: [
      { nameEn: 'Supermarket', nameHe: 'סופר' },
      { nameEn: 'Grocery', nameHe: 'מכולת' },
      { nameEn: 'Kiosk', nameHe: 'קיוסק' },
      { nameEn: 'Greens', nameHe: 'ירקן' },
    ],
  },
  {
    nameEn: 'Health',
    nameHe: 'בריאות',
    icon: '⚕️',
    color: '#45B7D1',
    isDefault: true,
    subCategories: [
      { nameEn: 'Medications', nameHe: 'תרופות' },
      { nameEn: 'Health Tax', nameHe: 'היטל' },
      { nameEn: 'Doctor', nameHe: 'רופא' },
      { nameEn: 'Health Fund', nameHe: 'קופ״ח' },
      { nameEn: 'Dentist', nameHe: 'שיניים' },
    ],
  },
  {
    nameEn: 'Insurance',
    nameHe: 'ביטוח',
    icon: '🛡️',
    color: '#FFA07A',
    isDefault: true,
    subCategories: [
      { nameEn: 'Health Insurance', nameHe: 'בריאות' },
      { nameEn: 'Building Insurance', nameHe: 'מבנה' },
      { nameEn: 'Car Insurance', nameHe: 'רכב' },
      { nameEn: 'Life Insurance', nameHe: 'חיים' },
    ],
  },
  {
    nameEn: 'Education',
    nameHe: 'חינוך',
    icon: '📚',
    color: '#98D8C8',
    isDefault: true,
    subCategories: [
      { nameEn: 'Books', nameHe: 'ספרים' },
      { nameEn: 'Supplies', nameHe: 'ציוד' },
      { nameEn: 'Private Lessons', nameHe: 'שיעורים פרטיים' },
      { nameEn: 'Classes', nameHe: 'חוגים' },
    ],
  },
  {
    nameEn: 'Transportation',
    nameHe: 'תחבורה',
    icon: '🚗',
    color: '#F7B731',
    isDefault: true,
    subCategories: [
      { nameEn: 'Fuel', nameHe: 'דלק' },
      { nameEn: 'Maintenance', nameHe: 'טיפולים' },
      { nameEn: 'Toll Road', nameHe: 'כביש אגרה' },
      { nameEn: 'Fines', nameHe: 'דוחות' },
      { nameEn: 'Parking', nameHe: 'חניה' },
      { nameEn: 'Insurance', nameHe: 'ביטוח' },
      { nameEn: 'License Fee', nameHe: 'אגרת רישוי' },
      { nameEn: 'Public Transport', nameHe: 'תחב״צ' },
    ],
  },
  {
    nameEn: 'Bills',
    nameHe: 'חשבונות',
    icon: '💡',
    color: '#5F27CD',
    isDefault: true,
    subCategories: [
      { nameEn: 'Mortgage', nameHe: 'משכנתא' },
      { nameEn: 'Mortgage Insurance', nameHe: 'ביטוחי משכנתא' },
      { nameEn: 'Water & Sewage', nameHe: 'מים וביוב' },
      { nameEn: 'Electricity', nameHe: 'חשמל' },
      { nameEn: 'Property Tax', nameHe: 'ארנונה' },
      { nameEn: 'Gas', nameHe: 'גז' },
      { nameEn: 'Mobile Phone', nameHe: 'סלולר' },
      { nameEn: 'Internet', nameHe: 'אינטרנט' },
      { nameEn: 'Television', nameHe: 'טלביזיה' },
    ],
  },
  {
    nameEn: 'Savings',
    nameHe: 'חסכונות',
    icon: '💰',
    color: '#26A69A',
    isDefault: true,
    subCategories: [
      { nameEn: 'Bar Mitzvah', nameHe: 'בר מצווה' },
      { nameEn: 'Summer Vacation', nameHe: 'חופשת קיץ' },
      { nameEn: 'Children', nameHe: 'ילדים' },
    ],
  },
  {
    nameEn: 'Household',
    nameHe: 'משק בית',
    icon: '🏠',
    color: '#95A5A6',
    isDefault: true,
    subCategories: [
      { nameEn: 'Repairs & Maintenance', nameHe: 'תקונים ותחזוקה' },
      { nameEn: 'Pets', nameHe: 'חיות מחמד' },
      { nameEn: 'Clothing & Shoes', nameHe: 'ביגוד והנעלה' },
      { nameEn: 'Home Products', nameHe: 'מוצרים לבית' },
      { nameEn: 'Personal Care', nameHe: 'טיפוח' },
    ],
  },
];
