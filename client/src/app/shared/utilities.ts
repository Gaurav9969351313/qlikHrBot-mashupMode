export interface IKeyedCollection<T> {
    add(key: string, value: T);
    containsKey(key: string): boolean;
    count(): number;
    getItem(key: string): T;
    keys(): string[];
    remove(key: string): T;
    setItems(obj: Object);
}

export class Dictonary<T> implements IKeyedCollection<T> {

    private length: number = 0;

    public count(): number {
        return this.length;
    }

    public setItems(obj: Object) {
        for (var p in obj) {
            if (obj.hasOwnProperty(p)) {
                this[p] = obj[p];
                this.length++;
            }
        }
    }

    public add(key: string, value: T) {
        var previous = undefined;
        if (this.containsKey(key)) {
            previous = this[key]
        }
        else {
            this.length++;
        }
        this[key] = value;
    }

    public remove(key: string): T {
        var val = this[key];
        delete this[key];
        this.length--;
        return val;
    }

    public containsKey(key: string): boolean {
        return this.hasOwnProperty(key);
    }

    public getItem(key: string): T {
        return this.containsKey(key) ? this[key] : undefined;
    }

    public keys(): string[] {
        var keySet: string[] = [];

        for (var prop in this) {
            if (this.hasOwnProperty(prop)) {
                keySet.push(prop);
            }
        }
        return keySet;
    }

    public each(fn) {
        for (var k in this) {
            if (this.containsKey(k)) {
                fn(k, this[k]);
            }
        }
    }

    public clear() {
        //this = {}
        this.length = 0;
    }
}

export function getAlphaMonth(sMonth) {
    try {
      var sRetval = '';
      switch (sMonth) {
        case 0:
          sRetval = 'JAN';
          break;
        case 1:
          sRetval = 'FEB';
          break;
        case 2:
          sRetval = 'MAR';
          break;
        case 3:
          sRetval = 'APR';
          break;
        case 4:
          sRetval = 'MAY';
          break;
        case 5:
          sRetval = 'JUN';
          break;
        case 6:
          sRetval = 'JUL';
          break;
        case 7:
          sRetval = 'AUG';
          break;
        case 8:
          sRetval = 'SEP';
          break;
        case 9:
          sRetval = 'OCT';
          break;
        case 10:
          sRetval = 'NOV';
          break;
        case 11:
          sRetval = 'DEC';
          break;
      }
      return sRetval;
    }
    catch (e) {
    }
  }