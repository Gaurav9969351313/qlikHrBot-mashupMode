import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer,SafeResourceUrl} from '@angular/platform-browser';


@Pipe({
  name: 'safebrowse'
})
export class SafebrowsePipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {}

  transform(url, args?: any): any {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

}
