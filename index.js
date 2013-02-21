var $ = require('jquery');

var Draggy = function( el ){

	el.jquery ? this.el = el : this.el = $(el);

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
			startX, startY, lastX, lastY, position;

		var initialiseMove = function( e ){

			$('body').css('cursor', 'all-scroll');

	        position = {
				x : self.el.position().left,
				y : self.el.position().top		        	
	        };

	       self.el.css({
	       		position: 'absolute',
	       		top : position.y,
	       		left : position.x
	       });

	        startY = e.clientY;
	        startX = e.clientX;

	        lastY = 0;
	        lastX = 0;

	        self.callbacks.dragStart(position.x, position.y);

			$('body').bind('mouseup', function (e) {

	        	self.callbacks.dragStop(position.x, position.y);

	        	//self.el.css({ position : '', top : '', left : ''});
	            // and we unbind.
	            $('body').unbind('mousemove');
	            $('body').unbind('mouseup');

	            $('body').css('cursor', 'default');

	        });


		};

		var mouseMove = function mouseMove (e) {


	            //e.preventDefault();
	            // where we move, taking into account the values from the last tick..
	            var newY = (lastY - (e.clientY - startY)) * -1;
	            var newX = (lastX - (e.clientX - startX)) * -1;

	            if ((newX - startX !== lastX) || (newY - startY !== lastY)) {

	            	position.x += newX;
	            	position.y += newY;

	            	self.el[0].style.left = position.x + "px";
	            	self.el[0].style.top = position.y + "px";

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

		this.el
			.bind('mousedown', function (e) {

				if(!$(e.target).is('input') && !$(e.target).is('a')){

					$('body').bind('mouseup', function(){


						$('body')
							.unbind('mousemove')
							.unbind('mouseup');

					});

					$('body').bind('mousemove', function(e){

						$('body')
							.unbind('mouseup')
							.unbind('mousemove');

						initialiseMove(e);

						
						$('body').bind('mousemove', mouseMove);


					});

				}

			});

	}

};


module.exports = function( el ){

	return new Draggy( el );
};