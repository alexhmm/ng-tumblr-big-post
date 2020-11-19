import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

/**
 * AppService
 */
@Injectable({
  providedIn: 'root'
})
export class AppService {
  /**
   * Social media account names
   */
  social = environment.social;

  /**
   * AppService constructor.
   */
  constructor() { }
}
