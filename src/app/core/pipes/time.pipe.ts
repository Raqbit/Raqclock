import {Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'time'
})
export class TimePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    const time = moment.unix(value);

    if (args) {
      if (args.type === '12h') {
        return time.format("hh:mm");
      } else if (args.type === 'ampm') {
        return time.format("a");
      }
    }
    return undefined;
  }

}
