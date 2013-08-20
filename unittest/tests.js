/*jslint devel: true, bitwise: true, regexp: true, browser: true, confusion: true, unparam: true, eqeq: true, white: true, nomen: true, plusplus: true, maxerr: 50, indent: 4 */
/*globals $, qunit, module, test, ok, equal, expect, start */

qunit.jqui.module("Limitslider");

qunit.jqui.tests({
	"Create": function() {
		'use strict';

		var s = $('<div/>').appendTo('body');
		s.limitslider({
			values:		[10,50]
		});
		var h0 = s.find('.ui-slider-handle').eq(0);

		equal(s.is(':visible'),			true,	"It's visible");

		deepEqual(s.limitslider('values'),	[10,50],		"Initial values");

		h0.simulate("drag", { x: 10 } );
		deepEqual(s.limitslider('values'),	[0,50],		"Drag to start");

		h0.simulate("drag", { x: 1000 } );
		deepEqual(s.limitslider('values'),	[100,50],	"Crossing drag to end");
	},

	"Gap 0": function() {
		'use strict';

		var s = $('<div/>').appendTo('body');
		s.limitslider({
			values:		[10,50],
			gap:		0
		});
		var h0 = s.find('.ui-slider-handle').eq(0);

		deepEqual(s.limitslider('values'),	[10, 50],	"Initial values");

		h0.simulate("drag", { x: 1000, moves: 100 } );
		deepEqual(s.limitslider('values'),	[50, 50],	"Stop drag at gap 0");
	},

	"Gap 10": function() {
		'use strict';

		var s = $('<div/>').appendTo('body');
		s.limitslider({
			values:		[10,50],
			gap:		10
		});
		var h0 = s.find('.ui-slider-handle').eq(0);

		deepEqual(s.limitslider('values'),	[10, 50],	"Initial values");

		h0.simulate("drag", { x: 1000, moves: 100 } );
		deepEqual(s.limitslider('values'),	[40, 50],	"Stop drag at gap 0");
	}
});