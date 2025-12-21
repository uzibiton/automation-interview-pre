/**
 * =============================================================================
 * BDD World Context
 * =============================================================================
 * Custom World class that extends Cucumber's default World to provide
 * shared context across step definitions.
 *
 * The World is instantiated for each scenario and provides:
 * - Playwright page object
 * - Test data storage
 * - Shared state between steps
 * =============================================================================
 */

import { World, IWorldOptions, setWorldConstructor } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, chromium } from '@playwright/test';

export interface ExpenseTestData {
  input?: {
    expenses: Array<{
      date: string;
      category: string;
      description: string;
      amount: number;
      paymentMethod: string;
    }>;
  };
  output?: {
    sorted: {
      [key: string]: any[];
    };
  };
}

/**
 * Custom World class for expense sorting tests
 */
export class ExpenseWorld extends World {
  public browser?: Browser;
  public context?: BrowserContext;
  public page?: Page;
  public testData?: ExpenseTestData;
  public baseURL: string;
  public createdExpenses: any[] = [];
  public createdExpenseIds: number[] = [];
  public authToken?: string;

  constructor(options: IWorldOptions) {
    super(options);
    // Load base URL from environment or use default
    this.baseURL = process.env.BASE_URL || 'http://localhost:5173';
  }

  /**
   * Initialize browser and page
   */
  async init() {
    const slowMo = process.env.SLOWMO ? parseInt(process.env.SLOWMO, 10) : 1000;
    const headless = false; // Temporarily force visible mode for debugging
    console.log(`🌐 Browser mode: VISIBLE with ${slowMo}ms slowMo for debugging`);

    this.browser = await chromium.launch({
      headless: headless,
      slowMo: slowMo, // Delay between actions in milliseconds
    });
    this.context = await this.browser.newContext({
      viewport: { width: 1280, height: 720 },
      ignoreHTTPSErrors: true,
    });
    this.page = await this.context.newPage();
  }

  /**
   * Cleanup browser resources
   */
  async cleanup() {
    if (this.page) await this.page.close();
    if (this.context) await this.context.close();
    if (this.browser) await this.browser.close();
  }
}

setWorldConstructor(ExpenseWorld);
