import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'customDate'
})
export class CustomDatePipe implements PipeTransform {
    // Add your code here
    transform(date: Date): string {
        if(typeof date === "string") {
            date = new Date(date);
        }
        
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();

        return `${day < 10 ? '0' + day : day}.${month < 10 ? '0' + month : month}.${year}`;
    }
}
