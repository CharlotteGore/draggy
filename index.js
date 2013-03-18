var event = require('event');
var measure = require('measure');
var css = require('css');

var Draggy = function( el ){

	el.jquery ? this.el = el[0] : this.el = el;

	this.callbacks = {
		dragStart : function(){},
		dragMove : function(){},
		dragStop : function(){}			
	}

	this.configureDesktop();

	return this;

}

Draggy.prototype = {

	dragStart : function( callback ){

		this.callbacks.dragStart = callback;

		return this;
	},

	dragMove : function( callback ){

		this.callbacks.dragMove = callback;

		return this;

	},

	dragStop : function( callback ){

		this.callbacks.dragStop = callback;

		return this;

	},

	configureDesktop : function(){

		var self = this,
			startX, startY, lastX, lastY, position,
			mouseup, mouseMove, mouseDown,
			body = document; //document.getElementsByTagName('body')[0];

		var initialiseMove = function( e ){

			var t = measure

	        position = measure( self.el ).pagePosition();

	        css(self.el, {
	       		position: 'absolute',
	       		top : position.y,
	       		left : position.x
	        });

	        startY = e.clientY;
	        startX = e.clientX;

	        lastY = 0;
	        lastX = 0;

	        self.callbacks.dragStart(position.x, position.y);

	        mouseUp = function(e){

	        	self.callbacks.dragStop(position.x, position.y);

	            event.unbind( body , 'mousemove', mouseMove);
	            event.unbind( body, 'mouseup', mouseUp)

	        }

	        event.bind( body, "mouseup", mouseUp);


		};

		var mouseMove = function(e) {

	            //e.preventDefault();
	            // where we move, taking into account the values from the last tick..
	            var newY = (lastY - (e.clientY - startY)) * -1;
	            var newX = (lastX - (e.clientX - startX)) * -1;

	            if ((newX - startX !== lastX) || (newY - startY !== lastY)) {

	            	position.x += newX;
	            	position.y += newY;

	            	self.el.style.left = position.x + "px";
	            	self.el.style.top = position.y + "px";

	            	/*
	            	self.el.css({
	            		top : position.y,
	            		left : position.x
	            	});
	*/

	            	self.callbacks.dragMove(e.clientX, e.clientY, position.x, position.y, newX, newY);

	            }

	            // then save for next time...
	            lastY = e.clientY - startY;
	            lastX = e.clientX - startX;

        }


        var mouseDown = function (e) {

        	var target = (e.target) ? e.target : e.srcElement;

			if(target.tagName.toLowerCase() !== "input"){

				var abort = function(){

					event.unbind( body, 'mouseup', abort);
					event.unbind( body, 'mousemove', go);

				}

				var go = function(){

					event.unbind( body, 'mouseup', abort);
					event.unbind( body, 'mousemove', go);

					initialiseMove(e);

					event.bind( body, 'mousemove', mouseMove);

				}

				event.bind( body, "mouseup", abort);
				event.bind( body, "mousemove", go);

			}
		}

		event.bind( this.el, 'mousedown', mouseDown );

	}

};


module.exports = function( el ){

	return new Draggy( el );
};