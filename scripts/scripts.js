/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:true, undef:true, unused:true, curly:true, browser:true, indent:4, maxerr:50 */
/*global $:true, _:true, gapi:true, signals:true */

/* ! NOTE
 * The entire initialisation procedure is wrapped as callback to onApiReady
 * to ensure the all the scripts will run once the entire Google Hangouts API
 * has been successfully loaded. Additionally, Hangouts will automatically keep
 * the app dimmed until the init function resolves.
 */

gapi.hangout.onApiReady.add(function () {
	"use strict";
	
	var base_url = $('head > base').prop('href') || '',
	
		face_sets = {
			'changeSet': null,
			'togglePiece': null,
		
			'pieceToggled': new signals.Signal(),
			'setChanged': new signals.Signal(),
			
			'current': null,
			
			'scale': -0.33,
			'offset_x': -0.06,
			'offset_y': 0.40,
		
			'definitions': {
				'polka': {
					'path': base_url + 'images/polka/layer-{number}.png',
					'range': 8,
					
					'resource_cache': [],
					'overlay_cache': [],
					'visibility': []
				},
				'stone': {
					'path': base_url + 'images/stone/layer-{number}.png',
					'range': 8,
					
					'resource_cache': [],
					'overlay_cache': [],
					'visibility': []
				},
				'gold': {
					'path': base_url + 'images/gold/layer-{number}.png',
					'range': 8,
					
					'resource_cache': [],
					'overlay_cache': [],
					'visibility': []
				}
			}
		},
		
		positioning = {
		
			'getScale': null,
			'getOffsetX': null,
			'getOffsetY': null,
			
			'setScale': null,
			'setOffsetX': null,
			'setOffsetY': null,
			
			'changed': new signals.Signal()
		
		},
		
		sounds = {
			'path': 'http://dev.welikepie.com/candyApp/sounds/{id}.wav',
			'cache': {},
			
			'play': null,
			'played': new signals.Signal()
		};
	
	face_sets.changeSet = function (name) {
	
		var i, callback, change_func, temp;
	
		// Only proceed if the selected face set is different from current one
		if (face_sets.definitions[name] !== face_sets.current) {
			
			change_func = function () {
			
				// Make the currently visible face (if any) disappear
				if (face_sets.current) {
					_.invoke(face_sets.current.overlay_cache, 'setVisible', false);
				}
				
				// Mark loaded set as current
				face_sets.current = face_sets.definitions[name];
				
				// Display parts
				_.each(face_sets.current.overlay_cache, function (item, index) {
					item.setScale(positioning.getScale());
					item.setOffset(positioning.getOffsetX(), positioning.getOffsetY());
					item.setVisible(face_sets.current.visibility[index]);
				});
				
				face_sets.setChanged.dispatch(name, face_sets.definitions[name]);
			
			};
			
			if (!face_sets.definitions[name].overlay_cache.length) {
			
				change_func = _.after(face_sets.definitions[name].range, change_func);
				callback = function (index) {
				
					var resource = gapi.hangout.av.effects.createImageResource(
						face_sets.definitions[name].path.replace('{number}', i + 1)
					);
					face_sets.definitions[name].resource_cache.push(resource);
					face_sets.definitions[name].overlay_cache.push(null);
					face_sets.definitions[name].visibility.push(true);
					
					resource.onLoad.add(function () {
						var overlay = resource.createFaceTrackingOverlay({
							'trackingFeature' : gapi.hangout.av.effects.FaceTrackingFeature.NOSE_ROOT,
							'scaleWithFace' : true,
							'rotateWithFace' : true
						});
						face_sets.definitions[name].overlay_cache[index] = overlay;
						change_func();
					});
				
				};
				for (i = 0; i < face_sets.definitions[name].range; i += 1) { callback(i); }
				temp = [false, true, false, true, true, false, false, false];
				if (face_sets.definitions[name].visibility.length > temp.length) {
					for (i = 0; i < (face_sets.definitions[name].visibility.length - temp.length); i += 1) { temp.push(true); }
				}
				face_sets.definitions[name].visibility = temp;
			
			} else {
				change_func();
			}
			
		}
	};
	
	face_sets.togglePiece = function (index) {
		var visible;
		if (face_sets.current) {
		
			visible = !face_sets.current.visibility[index];
			face_sets.current.overlay_cache[index].setVisible(visible);
			face_sets.current.visibility[index] = visible;
			
			face_sets.pieceToggled.dispatch(index, visible, face_sets.current.visibility);
		
		}
	};
	
	(function () {
	
		var scale_current = 1 + face_sets.scale,
			offset_x_current = 0 + face_sets.offset_x,
			offset_y_current = 0 + face_sets.offset_y;
			
		positioning.getScale = function () { return scale_current; };
		positioning.getOffsetX = function () { return offset_x_current; };
		positioning.getOffsetY = function () { return offset_y_current; };
		
		positioning.setScale = function (num) {
			if (typeof num !== 'number') { throw new Error('Argument of invalid type.'); }
			num = num + face_sets.scale;
			if ((num < 0) || (num > 2)) { throw new Error('Calculated value out of range: ' + num); }
			scale_current = num;
			positioning.changed.dispatch('scale', num);
		};
		
		positioning.setOffsetX = function (num) {
			if (typeof num !== 'number') { throw new Error('Argument of invalid type.'); }
			num = num + face_sets.offset_x;
			if ((num < -1) || (num > 1)) { throw new Error('Calculated value out of range: ' + num); }
			offset_x_current = num;
			positioning.changed.dispatch('offset_x', num);
		};
		
		positioning.setOffsetY = function (num) {
			if (typeof num !== 'number') { throw new Error('Argument of invalid type.'); }
			num = num + face_sets.offset_y;
			if ((num < -1) || (num > 1)) { throw new Error('Calculated value out of range: ' + num); }
			offset_y_current = num;
			positioning.changed.dispatch('offset_y', num);
		};
	
	}());
	
	// Reposition faces after parameters have changed
	positioning.changed.add(function (type, val) {
	
		if (face_sets.current) {
		
			switch (type) {
			case 'scale':
				type = 'setScale';
				break;
			case 'offset_x':
			case 'offset_y':
				type = 'setOffset';
				val = {
					'x': (type === 'offset_x' ? val : positioning.getOffsetX()),
					'y': (type === 'offset_y' ? val : positioning.getOffsetY())
				};
				break;
			}
			_.invoke(face_sets.current.overlay_cache, type, val);
		
		}
	
	});
	
	(function () {
	
		var load_sound = function (url) {
		
			var resource = gapi.hangout.av.effects.createAudioResource(url),
				sound = resource.createSound({
					'localOnly': false,
					'loop': false,
					'volume': 0.6
				});
			
			return {
				'resource': resource,
				'sound': sound
			};
		
		};
		
		sounds.play = function (id) {
		
			// Check if ID is present in cache (loaded before).
			// If not make sure to load the file first.
			if (!_.has(sounds.cache, id)) {
				sounds.cache[id] = load_sound(sounds.path.replace('{id}', id));
			}
			
			if (sounds.cache[id].resource.getState() === gapi.hangout.av.effects.ResourceState.LOADED) {
				sounds.cache[id].sound.play();
				sounds.played.dispatch(id);
			} else {
				sounds.cache[id].resource.onLoad.add(function () {
					sounds.cache[id].sound.play();
					sounds.played.dispatch(id);
				});
			}
		
		};
	
	}());
	
	$('#faces button')
		.filter('[name="sound"]').on('click', function (ev) {
		
			var $el = $(this);
			ev.preventDefault();
			
			$el.addClass('loading');
			sounds.played.addOnce(function () { $el.removeClass('loading'); });
			sounds.play(this.value);
		
		}).end()
		.filter('[name="face"]').on('click', function (ev) {
		
			ev.preventDefault();
			face_sets.changeSet(this.value);
		
		}).end()
		.filter('[name="piece"]').on('click', function (ev) {
		
			ev.preventDefault();
			face_sets.togglePiece(parseInt(this.value, 10) - 1);
		
		}).end();
	
	$('input[type="range"]').replaceWith(function () {
		var el = document.createElement('div');
		el.className = 'range';
		el.setAttribute('data-min', this.getAttribute('min'));
		el.setAttribute('data-max', this.getAttribute('max'));
		el.setAttribute('data-step', this.getAttribute('step'));
		el.setAttribute('data-name', this.getAttribute('name'));
		el.setAttribute('data-value', this.getAttribute('value'));
		return el;
	});
	
	$('div.range').each(function () {
		var name = this.getAttribute('data-name');
		$(this).slider({
			'value': parseFloat(this.getAttribute('data-value')),
			'min': parseFloat(this.getAttribute('data-min')),
			'max': parseFloat(this.getAttribute('data-max')),
			'step': parseFloat(this.getAttribute('data-step')),
			'slide': function (ev, data) {
				try {
					switch (name) {
					case 'scale':
						positioning.setScale(parseFloat(data.value));
						break;
					case 'offset_x':
						positioning.setOffsetX(parseFloat(data.value));
						break;
					case 'offset_y':
						positioning.setOffsetY(parseFloat(data.value));
						break;
					}
				} catch (e) {}
			}
		});
	});
	
	$('.tabs').tabs();
	
});