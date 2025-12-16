import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { map } from 'rxjs/operators';
  
  @Injectable()
  export class RoleFilterInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const request = context.switchToHttp().getRequest();
  
      // We get the role from the headers
      const requesterRole = request.headers['role'] || 'client';
  
      return next.handle().pipe(
        map((data) => {
  
          // Admin → Full data
          if (requesterRole === 'admin') {
            return data;
          }
  
          // Client → Only show id + email
          const filterUser = (u: any) => ({
            id: u.id,
            email: u.email,
          });
  
          if (Array.isArray(data)) {
            return data.map((u) => filterUser(u));
          }
  
          return filterUser(data);
        }),
      );
    }
  }
  