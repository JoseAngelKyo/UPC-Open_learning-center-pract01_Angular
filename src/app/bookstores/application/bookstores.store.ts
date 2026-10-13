import { computed, inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Bookstore } from '../domain/model/bookstore.entity';
import { BookstoresApi } from '../infrastructure/bookstores-api';

export interface InventorySummaryItem {
  bookstoreId: number;
  bookKey: string;
  bookTitle: string;
  copies: number;
}

@Injectable({ providedIn: 'root' })
export class BookstoresStore {
  private readonly api = inject(BookstoresApi);

  private readonly bookstoresState = signal<Bookstore[]>([]);
  private readonly loadingState = signal(false);
  private readonly loadedState = signal(false);
  private readonly errorState = signal(false);

  readonly bookstores = this.bookstoresState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly loaded = this.loadedState.asReadonly();
  readonly error = this.errorState.asReadonly();

  readonly specialties = computed(() =>
    [...new Set(this.bookstoresState().map(store => store.specialty))]
  );

  async fetchBookstores(): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(false);

    try {
      const bookstores = await firstValueFrom(
        this.api.getBookstores()
      );

      this.bookstoresState.set(bookstores);
      this.loadedState.set(true);
    } catch (error) {
      this.errorState.set(true);
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  getBookstoreById(id: number): Bookstore | undefined {
    return this.bookstoresState().find(store => store.id === id);
  }

  getBookstoreBySpecialty(specialty: string): Bookstore | undefined {
    return this.bookstoresState().find(
      store => store.specialty === specialty
    );
  }

  getInventorySummary(
    bookstoreId: number,
    stocks: InventorySummaryItem[] = []
  ) {
    const bookstore = this.getBookstoreById(bookstoreId);

    const books = new Map<
      string,
      { bookKey: string; bookTitle: string; copies: number }
    >();

    for (const stock of stocks) {
      if (stock.bookstoreId !== bookstoreId) {
        continue;
      }

      const existing = books.get(stock.bookKey);

      if (existing) {
        existing.copies += Number(stock.copies);
      } else {
        books.set(stock.bookKey, {
          bookKey: stock.bookKey,
          bookTitle: stock.bookTitle,
          copies: Number(stock.copies)
        });
      }
    }

    const items = [...books.values()];

    return {
      items,
      availableTitles: items.length,
      replenishmentRequired: bookstore
        ? items.filter(
          book => book.copies < bookstore.minimumCopies
        ).length
        : 0
    };
  }
}
