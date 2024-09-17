import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'duration'
})
export class DurationPipe implements PipeTransform {
    // Add your code here
    transform(duration: number): string {
        let hours = Math.floor(duration / 60);
        let minutes = duration % 60;
    
        return `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;   
    }
}
