// NO CASO DE HAVER ROTAS PROTEGIDAS QUE NECESSITAM DE LOGIN

import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  Router,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class GuardRouteService implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (localStorage.getItem('token')) {
      return true;
    }

    this.router.navigate(['/Login']);
    return false;
  }
}
