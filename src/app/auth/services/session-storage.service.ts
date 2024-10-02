import { Injectable, Inject, InjectionToken } from '@angular/core';


const TOKEN = 'SESSION_TOKEN'; // Use this constant for the session storage entry key

const WINDOW = new InjectionToken<Window>('WindowToken', {
  providedIn: 'root',
  factory: () => window,
});

// Add your code here

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {
  constructor(@Inject(WINDOW) private window: Window) {}

  setToken(token: string){
    // Add your code here
    this.window.sessionStorage.setItem(TOKEN, token);
  }

  getToken(){
    // Add your code here
    return this.window.sessionStorage.getItem(TOKEN);
  }

  deleteToken(){
    // Add your code here
    this.window.sessionStorage.removeItem(TOKEN);
  }
}
