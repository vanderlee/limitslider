/*jslint devel: true, bitwise: true, regexp: true, browser: true, confusion: true, unparam: true, eqeq: true, white: true, nomen: true, plusplus: true, maxerr: 50, indent: 4 */
/*globals jQuery */

/*!
 * LimitSlider
 *
 * Copyright (c) 2011-2015 Martijn W. van der Lee
 * Licensed under the MIT.
 */
/* Slider extension with forced limits and gaps.
 * Optional ranges, titles and labels.
 */

;(function ($) {
	"use strict";

	$.widget('vanderlee.limitslider', $.ui.slider, {
		options: $.extend({
			'classEven':	'ui-slider-handle-even',
			'classOdd':		'ui-slider-handle-odd',
			'gap':			undefined,
			'left':			undefined,
			'right':		undefined,
			'limit':		undefined,
			'limits':		undefined,
			'ranges':		[],
			'title':		false,
			'label':		false
		}, $.ui.slider.prototype.options),

		_create: function() {
			if (!this.options.values) {
				this.options.values = [this.options.value];
			}

			$.ui.slider.prototype._create.call(this);

			$(this.element).addClass('ui-limitslider');

			this._renderRanges();
			this._renderLabels();
			this._renderTitles();
		},

		_renderTitle: function(index) {
			if (this.options.title) {
				var value = this.options.values[index];
				$(this.handles[index])
						.attr('title', $.isFunction(this.options.title) ? this.options.title(value) : value)
						.addClass(this.options[index % 2 ? 'classEven' : 'classOdd']);
			}
		},

		_renderTitles: function(index) {
			if (this.options.title) {
				var that = this;
				$.each(this.options.values, function(v) {
					that._renderTitle(v);
				});
			}
		},

		_renderLabel: function(index) {
			if (this.options.label) {
				var value = this.options.values[index],
					html = $('<div>').css({
					'text-align':		'center'
				,	'font-size':		'75%'
				,	'display':			'table-cell'
				,	'vertical-align':	'middle'
				}).html($.isFunction(this.options.label) ? this.options.label(value) : value);

				$(this.handles[index]).html(html).css({
					'text-decoration':	'none'
				,	'display':			'table'
				});
			}
		},

		_renderLabels: function() {
			if (this.options.label) {
				var that = this;
				$.each(this.options.values, function(v) {
					that._renderLabel(v);
				});
			}
		},

		_renderRanges: function() {
			var options	= this.options,
				values  = options.values,
				scale   = function(value) {
							return (value - options.min) * 100 / (options.max - options.min);
						},
				index,
				left,
				right,
				range;

			$('.ui-slider-range', this.element).remove();

			for (index = 0; index <= values.length; ++index) {
				var range = options.ranges[index],
					sliderRange;
				if (range) {
					left = scale(index == 0? options.min : values[index - 1]);
					right = scale(index < values.length? values[index] : options.max);

					sliderRange = $('<div/>')
						.addClass('ui-slider-range ui-widget-header')
						.css('width', (right - left) + '%');

					if (range.class) {
						sliderRange.addClass(range.class);
					}

					if (left == 0) {
						sliderRange.addClass('ui-slider-range-min');
					} else if (right == 100) {
						sliderRange.addClass('ui-slider-range-max');
					} else {
						sliderRange.css('left', left+'%');
					}
					
					$(this.element).prepend(sliderRange);
//					sliderRange.prependTo(this.element);
				}
			}
		},

		_slide: function(event, index, newVal) {
			// Left limit
			if (this.options.left) {
				newVal = Math.max(newVal, this.options.left);
			}

			// Right limit
			if (this.options.right) {
				newVal = Math.min(newVal, this.options.right);
			}

			// Limit
			if (this.options.limit) {
				newVal = Math.max(newVal, this.options.limit[0]);
				newVal = Math.min(newVal, this.options.limit[1]);
			}

			// Per-slider limit
			if (this.options.limits && this.options.limits[index]) {
				newVal = Math.max(newVal, this.options.limits[index][0]);
				newVal = Math.min(newVal, this.options.limits[index][1]);
			}

			if (this.options.gap || this.options.gap === 0) {
				// Gap to previous
				if (index > 0) {
					 newVal = Math.max(newVal, this.options.values[index - 1] + this.options.gap);
				}

				// Gap to next
				if (index < this.options.values.length - 1) {
					 newVal = Math.min(newVal, this.options.values[index + 1] - this.options.gap);
				}
			}

			// Call parent
			$.ui.slider.prototype._slide.call(this, event, index, newVal);
		},
		
		_change: function(event, index) {
			// Call parent
			$.ui.slider.prototype._change.call(this, event, index);
			
			// Apply visuals
			this._renderRanges();
			this._renderLabel(index);
			this._renderTitle(index);			
		}
	});
}(jQuery));
