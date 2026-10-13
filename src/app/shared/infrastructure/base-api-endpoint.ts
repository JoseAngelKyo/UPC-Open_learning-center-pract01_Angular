import {
  HttpClient,
  HttpErrorResponse,
  HttpParams
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BaseEntity } from './base-entity';
import { BaseResource, BaseResponse } from './base-response';
import { BaseAssembler } from './base-assembler';

export class BaseApiEndpoint<
  TEntity extends BaseEntity,
  TResource extends BaseResource,
  TResponse extends BaseResponse,
  TAssembler extends BaseAssembler<TEntity, TResource, TResponse>
> {
  constructor(
    protected http: HttpClient,
    protected endpointUrl: string,
    protected assembler: TAssembler
  ) {}

  getAll(params?: HttpParams): Observable<TEntity[]> {
    return this.http.get<TResponse | TResource[]>(
      this.endpointUrl,
      { params }
    ).pipe(
      map(response => {
        if (Array.isArray(response)) {
          return response.map(resource =>
            this.assembler.toEntityFromResource(resource)
          );
        }

        return this.assembler.toEntitiesFromResponse(response);
      }),
      catchError(this.handleError('Failed to fetch entities'))
    );
  }

  getById(id: number): Observable<TEntity> {
    return this.http.get<TResource>(
      `${this.endpointUrl}/${id}`
    ).pipe(
      map(resource =>
        this.assembler.toEntityFromResource(resource)
      ),
      catchError(this.handleError('Failed to fetch entity'))
    );
  }

  create(entity: TEntity): Observable<TEntity> {
    const resource = this.assembler.toResourceFromEntity(entity);

    return this.http.post<TResource>(
      this.endpointUrl,
      resource
    ).pipe(
      map(created =>
        this.assembler.toEntityFromResource(created)
      ),
      catchError(this.handleError('Failed to create entity'))
    );
  }

  update(entity: TEntity, id: number): Observable<TEntity> {
    const resource = this.assembler.toResourceFromEntity(entity);

    return this.http.put<TResource>(
      `${this.endpointUrl}/${id}`,
      resource
    ).pipe(
      map(updated =>
        this.assembler.toEntityFromResource(updated)
      ),
      catchError(this.handleError('Failed to update entity'))
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.endpointUrl}/${id}`
    ).pipe(
      catchError(this.handleError('Failed to delete entity'))
    );
  }

  protected handleError(operation: string) {
    return (error: HttpErrorResponse): Observable<never> => {
      const message =
        `${operation}: ${error.status} ${error.statusText}`;

      return throwError(() => new Error(message));
    };
  }
}
