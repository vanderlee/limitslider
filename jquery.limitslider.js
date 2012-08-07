/*jslint devel: true, bitwise: true, regexp: true, browser: true, confusion: true, unparam: true, eqeq: true, white: true, nomen: true, plusplus: true, maxerr: 50, indent: 4 */
/*globals jQuery */

/*
 * LimitSlider
 *
 * Copyright (c) 2011-2012 Martijn W. van der Lee
 * Licensed under the MIT.
 *
 * Slider extension with forced limits and gaps.
 * Optional ranges, titles and labels.
 */

//@bug Range may be off by a few points when dragging quickly.
//@todo trigger init?
//@todo Split up into several parts?
//@todo gaps (matches "ranges")?
//@todo vertical support for ranges
//@todo extension mechanism? extra pre/post callback?
//@todo tickers		jquery.sliderTickers -> hook in/out?
//@todo titles		jquery.sliderTitles
//@todo labels		jquery.sliderLabels

(function ($) {
	"use strict";

	$.widget('ui.limitslider', $.ui.slider, {
		options: $.extend({
			'gap':        0,
			'limit':      undefined,
			'limits':     undefined,
			'ranges':     [true,false,false,true],
			'title':      false,
			'label':      false
		}, $.ui.slider.prototype.options),

		_create: function() {
			var options = this.options;

			if (!options.values) {
				options.values = [options.value];
			}

			$.ui.slider.prototype._create.call(this);

			this._renderRanges();
			this._renderLabels();
			this._renderTitles();
		},

		_renderTitle: function(index) {
			if (this.options.title) {
				$(this.handles[index]).attr('title', this.options.values[index]);
			}
		},

		_renderTitles: function(index) {
			var v;
			for (v = 0; v < this.options.values.length; ++v) {
				this._renderTitle(v);
			}
		},

		_renderLabel: function(index) {
			if (this.options.label) {
				var html = $('<div>').css({
						'text-align': 'center'
						,'font-size': '50%'
						,'display': 'table-cell'
						,'vertical-align': 'middle'
					}).text(this.options.values[index]);
				$(this.handles[index]).html(html).css({
						'text-decoration': 'none'
						,'display': 'table'
					});
			}
		},

		_renderLabels: function() {
			var v;
			for (v = 0; v < this.options.values.length; ++v) {
				this._renderLabel(v);
			}
		},

		_renderRange: function(index) {
//@todo
			 var options = this.options,
				values   = options.values,
				scale    = function(value) {
					return (value - options.min) * 100 / (options.max - options.min);
				},
				left,
				right,
				range;

			$('.ui-slider-range', this.element).remove();

			for (index = 0; index <= values.length; ++index) {
				if (options.ranges[index]) {
					left	= scale(index == 0? options.min : values[index - 1]);
					right	= scale(index < values.length? values[index] : options.max);

					range	= $('<div/>').addClass('ui-slider-range ui-widget-header').css('width', (right - left) + '%');

					if (left == 0) {
						range.addClass('ui-slider-range-min');
					} else if (right == 100) {
						range.addClass('ui-slider-range-max');
					} else {
						range.css('left', left+'%');
					}
					range.prependTo(this.element);
				}
			}
		},

		_renderRanges: function() {
			 var options = this.options,
				values   = options.values,
				scale    = function(value) {
					return (value - options.min) * 100 / (options.max - options.min);
				},
				index,
				left,
				right,
				range;

			$('.ui-slider-range', this.element).remove();

			for (index = 0; index <= values.length; ++index) {
				if (options.ranges[index]) {
					left = scale(index == 0? options.min : values[index - 1]);
					right = scale(index < values.length? values[index] : options.max);

					range = $('<div/>').addClass('ui-slider-range ui-widget-header').css('width', (right - left) + '%');

					if (left == 0) {
						range.addClass('ui-slider-range-min');
					} else if (right == 100) {
						range.addClass('ui-slider-range-max');
					} else {
						range.css('left', left+'%');
					}
					range.prependTo(this.element);
				}
			}
		},

		_slide: function(event, index, newVal) {
			var options = this.options,
				values   = options.values,
				gap      = options.gap,
				limit    = options.limit,
				limits   = options.limits;

			// generic limit check
			if (limit) {
				//@todo if only [0] or no array, apply as left only
				newVal = Math.max(newVal, limit[0]);
				newVal = Math.min(newVal, limit[1]);
			}

			// specific limit check
			if (limits && options.limits[index]) {
				newVal = Math.max(newVal, limits[index][0]);
				newVal = Math.min(newVal, limits[index][1]);
			}

			if (index > 0) {
				 newVal = Math.max(newVal, values[index- 1] + gap);
			}

			if (index < values.length - 1) {
				 newVal = Math.min(newVal, values[index + 1] - gap);
			}

		   this._renderRanges();
		   this._renderLabel(index);
		   this._renderTitle(index);

			$.ui.slider.prototype._slide.call(this, event, index, newVal);
		}
	});
}(jQuery));