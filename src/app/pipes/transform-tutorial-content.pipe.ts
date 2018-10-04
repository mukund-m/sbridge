import { Pipe, PipeTransform } from '@angular/core';
import {ThemeService} from "../services/theme.service";

@Pipe({
  name: 'transformTutorialContent'
})
export class TransformTutorialContentPipe implements PipeTransform {
  constructor(
    public themeService: ThemeService
  ) {

  }

  transform(value: any, args?: any): any {

    const newValue = value
      .replace(/\[paragraph]/g, '<div class="tutorial-tip">')
      .replace(/\[\/paragraph]/g, '</div>')
      .replace(/\[highlight]/g, '')
      .replace(/\[\/highlight]/g, '')
    ;
    return `${newValue}`;
  }

}
