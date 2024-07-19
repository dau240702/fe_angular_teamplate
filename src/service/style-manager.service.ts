import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class StyleManagerService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  setStyles(theme: string, ...hrefs: string[]) {
    if (isPlatformBrowser(this.platformId)) {
      this.removeStyle(theme);
      hrefs.forEach((href, index) => {
        this.setStyle(`${theme}-${index}`, href);
      });
    }
  }

  setStyle(key: string, href: string) {
    if (isPlatformBrowser(this.platformId)) {
      getLinkElementForKey(key).setAttribute('href', href);
    }
  }

  removeStyle(theme: string) {
    if (isPlatformBrowser(this.platformId)) {
      const links = document.head.querySelectorAll(`link[rel="stylesheet"].${theme}`);
      links.forEach(link => document.head.removeChild(link));
    }
  }
}

function getLinkElementForKey(key: string) {
  return getExistingLinkElementByKey(key) || createLinkElementWithKey(key);
}

function getExistingLinkElementByKey(key: string) {
  return document.head.querySelector(`link[rel="stylesheet"].${key}`);
}

function createLinkElementWithKey(key: string) {
  const linkEl = document.createElement('link');
  linkEl.setAttribute('rel', 'stylesheet');
  linkEl.classList.add(key);
  document.head.appendChild(linkEl);
  return linkEl;
}