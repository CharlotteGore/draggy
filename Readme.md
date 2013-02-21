
# draggy

  A module to make elements draggable

## Installation

    $ component install charlottegore/draggy

## API

    var draggy = require('draggy');

    draggy(element);

  The only real gotcha is that you might need to disable text selection on the body element. Left as an exercise to the implementor.

  When elements are dragged, they become `position: absolute` and have a top and left added.

  When they're dropped, if you want them to go back into the page flow, you have to manually set position to '', top to '' and left to ''. Otherwise it stays put, and the element stays where the user dropped it.

### .dragStart( `callback` )

    draggy( element ).dragStart( function( positionLeft, positionTop ){ ... } );

  When dragging begins, this callback fires. It is passed the element's position, x and y.

### .dragMove( `callback` )

    draggy( element ).dragStart( function( clientX, clientY, positionLeft, positionTop ){ ... } );

  When the element is dragged, this fires. 

### .dragStop( `callback` )

    draggy( element ).dragStop( function( positionLeft, positionTop ){ ... } );

  When the element has stopped being dragged, this fires. 

## License

  MIT
