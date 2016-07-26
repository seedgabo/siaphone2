import {Injectable, Pipe} from '@angular/core';


@Pipe({
    name: 'filterArr'
})
@Injectable()
export class FilterArrayPipe{
    transform(value:Array<any>, args:string) {
        if (!args) {
            return value;
        } else if (value) {
            let i = false;
            let filtrado = value.filter(item => {
                for (let key in item) {
                    if ((item[key] != null) && (item[key]!= undefined) &&(item[key].toString().toLowerCase().indexOf(args.toLowerCase()) != -1)) {
                            i=true;
                            return true;
                        }
                    }
                });
                if(i)
                    return filtrado;
                else
                    return [{}];
            }
        }
    }
