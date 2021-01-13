// INTERCEPTOR DE ERRO
// NECESSITA DE SERVICES PARA HTTP REQUESTS

// import { LoginService } from './../services/auth/login.service';
// import {
//   HttpInterceptor,
//   HttpRequest,
//   HttpHandler,
//   HttpEvent,
//   HttpHeaders,
// } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { tap } from 'rxjs/operators';
// import { map } from 'rxjs/operators';
// import { Injectable } from '@angular/core';
// import { ToastService } from '../services/toast/toast.service';

// @Injectable()
// export class HttpErrorInterceptor implements HttpInterceptor {
//   constructor(
//     private authService: LoginService,
//     private toastService: ToastService
//   ) {}

//   intercept(
//     req: HttpRequest<any>,
//     next: HttpHandler
//   ): Observable<HttpEvent<any>> {
//     return next.handle(req).pipe(
//       tap(
//         () => {},
//         (errorHttpResponse: any) => {
//           switch (errorHttpResponse.status) {
//             /**
//              * Unauthorized
//              */
//             case 401:
//               this.authService.Logout();
//               this.toastService.toastWarning(
//                 'Não autorizado. Por favor, tente novamente.'
//               );
//               break;
//             /**
//              * Permissão
//              */
//             case 403:
//               this.authService.Logout();
//               break;
//             /**
//              * Bad Request
//              */
//             case 400:
//               this.toastService.toastWarning(
//                 'Ocorreu uma falha durante sua solicitação. Por favor, tente mais tarde!'
//               );
//               break;
//             /**
//              * Internal Error
//              */
//             case 500:
//               let textErrors = '';
//               console.log(errorHttpResponse.error.message);
//               if (errorHttpResponse.error.message) {
//                 // for (let item of errorHttpResponse.error.mensagens) {
//                 //   textErrors = textErrors + '\n' + item;
//                 // }
//                 this.toastService.toastError(
//                   'Erro: <br/> ' +
//                     errorHttpResponse.error.message.replace('.', '. <br/>')
//                 );
//               }

//               break;
//             default:
//               this.toastService.toastError(
//                 'Ocorreu um erro inesperado. Por favor, tente mais tarde.'
//               );
//           }
//         }
//       )
//     );
//   }
// }
