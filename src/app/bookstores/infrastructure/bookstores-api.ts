import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { Bookstore } from '../domain/model/bookstore.entity';
import { BookstoreAssembler } from './bookstore.assembler';
import {
  BookstoreResource,
  BookstoresResponse
} from './bookstore.resource';

@Injectable({ providedIn: 'root' })
export class BookstoresApi extends BaseApi {
  private readonly http = inject(HttpClient);

  private readonly bookstoresEndpoint =
    new BaseApiEndpoint<
      Bookstore,
      BookstoreResource,
      BookstoresResponse,
      BookstoreAssembler
    >(
      this.http,
      environment.platformProviderApiBaseUrl +
      environment.platformProviderBookstoresEndpointPath,
      new BookstoreAssembler()
    );

  getBookstores() {
    return this.bookstoresEndpoint.getAll();
  }

  getBookstoreById(id: number) {
    return this.bookstoresEndpoint.getById(id);
  }
}
