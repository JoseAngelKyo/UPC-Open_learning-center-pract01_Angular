import { BaseResource } from '../../shared/infrastructure/base-response';

export interface BookstoreResource extends BaseResource {
  id: number;
  name: string;
  specialty: string;
  minimumCopies: number;
}

export interface BookstoresResponse {
  bookstores: BookstoreResource[];
}
