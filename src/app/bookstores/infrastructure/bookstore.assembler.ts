import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { Bookstore } from '../domain/model/bookstore.entity';
import {
  BookstoreResource,
  BookstoresResponse
} from './bookstore.resource';

export class BookstoreAssembler implements BaseAssembler<
  Bookstore,
  BookstoreResource,
  BookstoresResponse
> {
  toEntityFromResource(resource: BookstoreResource): Bookstore {
    return new Bookstore(
      resource.id,
      resource.name,
      resource.specialty,
      resource.minimumCopies
    );
  }

  toResourceFromEntity(entity: Bookstore): BookstoreResource {
    return {
      id: entity.id,
      name: entity.name,
      specialty: entity.specialty,
      minimumCopies: entity.minimumCopies
    };
  }

  toEntitiesFromResponse(response: BookstoresResponse): Bookstore[] {
    return response.bookstores.map(resource =>
      this.toEntityFromResource(resource)
    );
  }
}
