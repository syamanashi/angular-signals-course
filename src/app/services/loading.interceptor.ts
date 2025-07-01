import {
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { LoadingService } from '../loading/loading.service';
import { finalize } from 'rxjs';
import { SkipLoading } from '../loading/skip-loading.component';

export const loadingInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  // If the SkipLoading HttpContextToken is on, then do nothing and bypass all loadingOn logic.
  if (req.context.get(SkipLoading)) {
    return next(req);
  }

  const loadingService = inject(LoadingService);
  loadingService.loadingOn();
  return next(req).pipe(
    finalize(() => {
      loadingService.loadingOff();
    })
  );
};
