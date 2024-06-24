import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private cache: { [key: string]: any } = {};
  private readonly CACHE_DURATION = 21600000;

  set(key: string, data: any): void {
    const item = {
      value: data,
      expiry: new Date().getTime() + this.CACHE_DURATION
    };
    localStorage.setItem(key, JSON.stringify(item));
    this.cache[key] = item;
  }

  get(key: string): any | null {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) {
      return null;
    }

    const item = JSON.parse(itemStr);
    const now = new Date().getTime();

    if (now > item.expiry) {
      localStorage.removeItem(key);
      delete this.cache[key];
      return null;
    }

    return item.value;
  }

  clear(key: string): void {
    localStorage.removeItem(key);
    delete this.cache[key];
  }
}
