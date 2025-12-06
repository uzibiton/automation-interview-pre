import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../category.entity';
import { SubCategory } from '../sub-category.entity';
import { DEFAULT_CATEGORIES } from '../constants/categories.constant';

/**
 * Seed Service
 *
 * Ensures default categories exist in the database on application startup.
 * This runs automatically when the application starts, preventing missing categories.
 */
@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    @InjectRepository(SubCategory)
    private subCategoriesRepository: Repository<SubCategory>,
  ) {}

  /**
   * Runs when the module is initialized (on application startup)
   */
  async onModuleInit() {
    await this.seedCategories();
  }

  /**
   * Seeds default categories if they don't exist
   */
  async seedCategories(): Promise<void> {
    try {
      this.logger.log('Checking for default categories...');

      const existingCategories = await this.categoriesRepository.count();

      if (existingCategories > 0) {
        this.logger.log(`Found ${existingCategories} existing categories. Skipping seed.`);
        return;
      }

      this.logger.log('No categories found. Seeding default categories...');

      for (const categoryDef of DEFAULT_CATEGORIES) {
        // Create category
        const category = this.categoriesRepository.create({
          nameEn: categoryDef.nameEn,
          nameHe: categoryDef.nameHe,
          icon: categoryDef.icon,
          color: categoryDef.color,
          isDefault: categoryDef.isDefault,
        });

        const savedCategory = await this.categoriesRepository.save(category);
        this.logger.log(`Created category: ${savedCategory.nameEn}`);

        // Create sub-categories
        for (const subCategoryDef of categoryDef.subCategories) {
          const subCategory = this.subCategoriesRepository.create({
            nameEn: subCategoryDef.nameEn,
            nameHe: subCategoryDef.nameHe,
            category: savedCategory,
          });

          await this.subCategoriesRepository.save(subCategory);
        }

        this.logger.log(
          `Created ${categoryDef.subCategories.length} sub-categories for ${savedCategory.nameEn}`,
        );
      }

      this.logger.log(`Successfully seeded ${DEFAULT_CATEGORIES.length} categories!`);
    } catch (error) {
      this.logger.error('Failed to seed categories:', error);
      // Don't throw - allow app to start even if seeding fails
    }
  }

  /**
   * Force re-seed categories (use with caution - for maintenance only)
   * Call this method if you need to update existing categories
   */
  async forceSeedCategories(): Promise<void> {
    this.logger.warn('Force seeding categories - this will add missing categories...');

    for (const categoryDef of DEFAULT_CATEGORIES) {
      // Try to find existing category
      let category = await this.categoriesRepository.findOne({
        where: { nameEn: categoryDef.nameEn },
        relations: ['subCategories'],
      });

      if (!category) {
        // Create new category
        category = this.categoriesRepository.create({
          nameEn: categoryDef.nameEn,
          nameHe: categoryDef.nameHe,
          icon: categoryDef.icon,
          color: categoryDef.color,
          isDefault: categoryDef.isDefault,
        });
        category = await this.categoriesRepository.save(category);
        this.logger.log(`Created missing category: ${category.nameEn}`);
      }

      // Check for missing sub-categories
      const existingSubCatNames = (category.subCategories || []).map((sc) => sc.nameEn);

      for (const subCategoryDef of categoryDef.subCategories) {
        if (!existingSubCatNames.includes(subCategoryDef.nameEn)) {
          const subCategory = this.subCategoriesRepository.create({
            nameEn: subCategoryDef.nameEn,
            nameHe: subCategoryDef.nameHe,
            category,
          });
          await this.subCategoriesRepository.save(subCategory);
          this.logger.log(
            `Created missing sub-category: ${subCategoryDef.nameEn} under ${category.nameEn}`,
          );
        }
      }
    }

    this.logger.log('Force seed completed!');
  }
}
