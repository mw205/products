import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  status: boolean;
  message: string;
  data: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();

    // Determine default message based on HTTP method
    let defaultMessage = 'Request processed successfully';
    const method = request.method;
    if (method === 'POST') {
      defaultMessage = 'Resource created successfully';
    } else if (method === 'GET') {
      defaultMessage = 'Resource(s) fetched successfully';
    } else if (method === 'PATCH' || method === 'PUT') {
      defaultMessage = 'Resource updated successfully';
    } else if (method === 'DELETE') {
      defaultMessage = 'Resource deleted successfully';
    }

    return next.handle().pipe(
      map((data) => {
        let message = defaultMessage;
        let resultData = data;

        if (data && typeof data === 'object') {
          if ('message' in data) {
            message = data.message;
          }
          if ('data' in data) {
            resultData = data.data;
          }
        }

        return {
          status: true,
          message,
          data: resultData,
        };
      }),
    );
  }
}
