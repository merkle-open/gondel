# jQuery Plugin


## Setup

```
import * as $ from 'jQuery';
import {init} from '@gondel/plugin-jquery';
init($);
```

## Usage

```

@Component('Button')
export default class Button extends GondelBaseComponent {
 
  @EventListener('mouseover') 
  _handleMouseOver(event) {
    this.$ctx.css('border', '1px solid orange');
  }

  @EventListener('mouseout') 
  _handleMouseOut(event) {
    this.$ctx.css('border', '');
  }

};

```