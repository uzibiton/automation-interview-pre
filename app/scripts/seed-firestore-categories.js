/**
 * Seed Firestore with default categories
 * Run with: node scripts/seed-firestore-categories.js
 */

const { Firestore } = require('@google-cloud/firestore');

const DEFAULT_CATEGORIES = [
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
    nameEn: 'Transportation',
    nameHe: 'תחבורה',
    icon: '🚗',
    color: '#F7B731',
    isDefault: true,
    subCategories: [
      { nameEn: 'Fuel', nameHe: 'דלק' },
      { nameEn: 'Maintenance', nameHe: 'טיפולים' },
      { nameEn: 'Parking', nameHe: 'חניה' },
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
      { nameEn: 'Electricity', nameHe: 'חשמל' },
      { nameEn: 'Water', nameHe: 'מים' },
      { nameEn: 'Internet', nameHe: 'אינטרנט' },
      { nameEn: 'Mobile Phone', nameHe: 'סלולר' },
    ],
  },
];

async function seedCategories() {
  const projectId = process.env.FIREBASE_PROJECT_ID || 'skillful-eon-477917-b7';

  console.log(`Connecting to Firestore project: ${projectId}`);
  const firestore = new Firestore({ projectId });

  try {
    // Check if categories already exist
    const categoriesRef = firestore.collection('categories');
    const snapshot = await categoriesRef.limit(1).get();

    if (!snapshot.empty) {
      console.log('Categories already exist. Skipping seed.');
      return;
    }

    console.log('Seeding categories...');

    let categoryId = 1;
    for (const category of DEFAULT_CATEGORIES) {
      const categoryDoc = {
        id: categoryId,
        nameEn: category.nameEn,
        nameHe: category.nameHe,
        icon: category.icon,
        color: category.color,
        isDefault: category.isDefault,
        createdAt: new Date().toISOString(),
      };

      await categoriesRef.doc(categoryId.toString()).set(categoryDoc);
      console.log(`✓ Created category: ${category.nameEn}`);

      // Create subcategories
      const subCategoriesRef = firestore.collection('sub_categories');
      let subCategoryId = categoryId * 100; // Offset by category

      for (const subCategory of category.subCategories) {
        const subCategoryDoc = {
          id: subCategoryId,
          categoryId: categoryId,
          nameEn: subCategory.nameEn,
          nameHe: subCategory.nameHe,
          createdAt: new Date().toISOString(),
        };

        await subCategoriesRef.doc(subCategoryId.toString()).set(subCategoryDoc);
        subCategoryId++;
      }

      console.log(`  ✓ Created ${category.subCategories.length} subcategories`);
      categoryId++;
    }

    console.log(`\n✅ Successfully seeded ${DEFAULT_CATEGORIES.length} categories!`);
  } catch (error) {
    console.error('❌ Error seeding categories:', error);
    process.exit(1);
  }
}

seedCategories();
