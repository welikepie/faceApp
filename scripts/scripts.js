/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:true, undef:true, unused:true, curly:true, browser:true, indent:4, maxerr:50 */
/*global $:true, _:true, gapi:true, signals:true */

gapi.hangout.onApiReady.add(function () {
    "use strict";

    var base_url = $('head > base').prop('href') || '',
    
        faces = {
        
            'path': base_url + 'images/textures/{type}-{texture}.png',
            'current': null,
            'cache': {},
            
            'change': null,
            'changed': new signals.Signal(),
            
            'definitions': {
                'long': {
                    'textures': [
                        'silver',
                        'gold',
                        'polka',
                        'badfx'
                    ],
                    'trackingFeature' : gapi.hangout.av.effects.FaceTrackingFeature.NOSE_ROOT,
                    'offset' : {
                        'x' : 0,
                        'y' : 0
                    },
                    'scale' : 0.95,
                    'rotation' : 0,
                    'scaleWithFace' : true,
                    'rotateWithFace' : true
                },
                'oval': {
                    'textures': [
                        'silver',
                        'gold',
                        'polka',
                        'badfx'
                    ],
                    'trackingFeature' : gapi.hangout.av.effects.FaceTrackingFeature.NOSE_ROOT,
                    'offset' : {
                        'x' : 0,
                        'y' : 0
                    },
                    'scale' : 0.95,
                    'rotation' : 0,
                    'scaleWithFace' : true,
                    'rotateWithFace' : true
                },
                'round': {
                    'textures': [
                        'silver',
                        'gold',
                        'polka',
                        'badfx'
                    ],
                    'trackingFeature' : gapi.hangout.av.effects.FaceTrackingFeature.NOSE_ROOT,
                    'offset' : {
                        'x' : 0,
                        'y' : 0
                    },
                    'scale' : 0.95,
                    'rotation' : 0,
                    'scaleWithFace' : true,
                    'rotateWithFace' : true
                },
                'square': {
                    'textures': [
                        'silver',
                        'gold',
                        'polka',
                        'badfx'
                    ],
                    'trackingFeature' : gapi.hangout.av.effects.FaceTrackingFeature.NOSE_ROOT,
                    'offset' : {
                        'x' : 0,
                        'y' : 0
                    },
                    'scale' : 0.95,
                    'rotation' : 0,
                    'scaleWithFace' : true,
                    'rotateWithFace' : true
                },
                'triangle': {
                    'textures': [
                        'silver',
                        'gold',
                        'polka',
                        'badfx'
                    ],
                    'trackingFeature' : gapi.hangout.av.effects.FaceTrackingFeature.NOSE_ROOT,
                    'offset' : {
                        'x' : 0,
                        'y' : 0
                    },
                    'scale' : 0.95,
                    'rotation' : 0,
                    'scaleWithFace' : true,
                    'rotateWithFace' : true
                }
            }
        
        },
        
        hair = {
        
            'path': base_url + 'images/hair/{type}-{direction}.png',
            'pan_ranges': {
                'left': [-180, -15],
                'right': [15, 180]
            },
            'current': null,
            'cache': {},
            
            'change': null,
            'changed': new signals.Signal(),
			'refreshed': new signals.Signal(),
            
            'definitions': {
                'badfx': {
                    'left': {
                        'trackingFeature' : gapi.hangout.av.effects.FaceTrackingFeature.NOSE_ROOT,
                        'offset' : {
                            'x' : 0,
                            'y' : 0
                        },
                        'scale' : 0.95,
                        'rotation' : 0,
                        'scaleWithFace' : true,
                        'rotateWithFace' : true
                    },
                    'right': {
                        'trackingFeature' : gapi.hangout.av.effects.FaceTrackingFeature.NOSE_ROOT,
                        'offset' : {
                            'x' : 0,
                            'y' : 0
                        },
                        'scale' : 0.95,
                        'rotation' : 0,
                        'scaleWithFace' : true,
                        'rotateWithFace' : true
                    }
                },
                'gold': {
                    'left': {
                        'trackingFeature' : gapi.hangout.av.effects.FaceTrackingFeature.NOSE_ROOT,
                        'offset' : {
                            'x' : 0,
                            'y' : 0
                        },
                        'scale' : 0.95,
                        'rotation' : 0,
                        'scaleWithFace' : true,
                        'rotateWithFace' : true
                    },
                    'right': {
                        'trackingFeature' : gapi.hangout.av.effects.FaceTrackingFeature.NOSE_ROOT,
                        'offset' : {
                            'x' : 0,
                            'y' : 0
                        },
                        'scale' : 0.95,
                        'rotation' : 0,
                        'scaleWithFace' : true,
                        'rotateWithFace' : true
                    }
                },
                'polka': {
                    'left': {
                        'trackingFeature' : gapi.hangout.av.effects.FaceTrackingFeature.NOSE_ROOT,
                        'offset' : {
                            'x' : 0,
                            'y' : 0
                        },
                        'scale' : 0.95,
                        'rotation' : 0,
                        'scaleWithFace' : true,
                        'rotateWithFace' : true
                    },
                    'right': {
                        'trackingFeature' : gapi.hangout.av.effects.FaceTrackingFeature.NOSE_ROOT,
                        'offset' : {
                            'x' : 0,
                            'y' : 0
                        },
                        'scale' : 0.95,
                        'rotation' : 0,
                        'scaleWithFace' : true,
                        'rotateWithFace' : true
                    }
                },
                'turf': {
                    'left': {
                        'trackingFeature' : gapi.hangout.av.effects.FaceTrackingFeature.NOSE_ROOT,
                        'offset' : {
                            'x' : 0,
                            'y' : 0
                        },
                        'scale' : 0.95,
                        'rotation' : 0,
                        'scaleWithFace' : true,
                        'rotateWithFace' : true
                    },
                    'right': {
                        'trackingFeature' : gapi.hangout.av.effects.FaceTrackingFeature.NOSE_ROOT,
                        'offset' : {
                            'x' : 0,
                            'y' : 0
                        },
                        'scale' : 0.95,
                        'rotation' : 0,
                        'scaleWithFace' : true,
                        'rotateWithFace' : true
                    }
                }
            }
        
        };
    
    (function () {
    
        var current_direction = 'right',
            direction_calc = _.chain(hair.pan_ranges)
                .pairs()
                .map(function (item) {
                    return [
                        item[0],
                        _.map(item[1], function (x) { return x * Math.PI / 180; })
                    ];
                }),
        
            load_overlay = function (url, specs) {
            
                var resource,
                    overlay;
                
                resource = gapi.hangout.av.effects.createImageResource(url);
                overlay = resource.createFaceTrackingOverlay({
                    'scale' : specs.scale,
                    'rotation' : specs.rotation,
                    'offset' : specs.offset,
                    'scaleWithFace' : specs.scaleWithFace,
                    'rotateWithFace' : specs.rotateWithFace,
                    'trackingFeature' : specs.trackingFeature
                });
                overlay.setVisible(false);
                
                return {
                    'resource': resource,
                    'overlay': overlay
                };
            
            };
        
        faces.change = function (type, texture) {
        
            var new_overlay,
                old_overlay = faces.current ? faces.cache[faces.current[0]][faces.current[1]].overlay : null,
                hair_overlay = hair.current && hair.current[1] ? hair.cache[hair.current[0]][hair.current[1]].overlay : null,
				
				hair_cache,
				refresh_specs;
        
            // Verify that both the type and the texture are of valid values
            if ((type !== null) && !_.has(faces.definitions, type)) { throw new Error('Type invalid: ' + type); }
            if (!_.contains(faces.definitions[type].textures, texture)) { throw new Error('Texture invalid: ' + texture + ' of type ' + type); }
            
            // FACE REMOVAL
            // Only proceed with it if type is null and there is face visible
            if ((type === null) && faces.current) {
            
                old_overlay.setVisible(false);
                faces.current = null;
                faces.changed.dispatch(null);
            
            // FACE DISPLAY / SWITCH
            // Only proceed with it if etiher there is no face shown or
            // a face shown is different from the one requested
            } else if ((type !== null) && (!faces.current || _.difference(faces.current, [type, texture]).length)) {
            
                // Ensure the selected type/texture combination has
                // been loaded - if it has not, load it
                if (!_.has(faces.cache, type)) {
                    faces.cache[type] = {};
                    faces.cache[type][texture] = load_overlay(
                        faces.path
                            .replace('{type}', type)
                            .replace('{texture}', texture),
                        faces.definitions[type]
                    );
                } else if (!_.has(faces.cache[type], texture)) {
                    faces.cache[type][texture] = load_overlay(
                        faces.path
                            .replace('{type}', type)
                            .replace('{texture}', texture),
                        faces.definitions[type]
                    );
                }
                
                old_overlay = faces.current ? faces.cache[faces.current[0]][faces.current[1]].overlay : null;
                new_overlay = faces.cache[type][texture].overlay;
                hair_overlay = hair.current && hair.current[1] ? hair.cache[hair.current[0]][hair.current[1]].overlay : null;
                
                if (old_overlay) { old_overlay.setVisible(false); }
				if (hair_overlay) {
					refresh_specs = {
						'scale': hair_overlay.getScale(),
						'rotation': hair_overlay.getRotation(),
						'offset': hair_overlay.getOffset()
					};
					hair_overlay.setVisible(false);
					hair_overlay.dispose();
					hair_overlay = true;
					hair_cache = hair.cache[hair.current[0]][hair.current[1]];
				}
                //if (hair_overlay) { hair_overlay.setVisible(false); }
                new_overlay.setVisible(true);
				if (hair_overlay) {
					hair_cache.overlay = hair_cache.resource.createFaceTrackingOverlay({
						'scale' : refresh_specs.scale,
						'rotation' : refresh_specs.rotation,
						'offset' : refresh_specs.offset,
						'scaleWithFace' : hair.definitions[hair.current[0]][hair.current[1]].scaleWithFace,
						'rotateWithFace' : hair.definitions[hair.current[0]][hair.current[1]].rotateWithFace,
						'trackingFeature' : hair.definitions[hair.current[0]][hair.current[1]].trackingFeature
					});
					hair_cache.overlay.setVisible(true);
					hair.refreshed.dispatch();
				}
                //if (hair_overlay) { hair_overlay.setVisible(true); }
                
                faces.current = [type, texture];
                faces.changed.dispatch(faces.current);
            
            }
        
        };
        
        hair.change = function (type, direction) {
        
            var new_overlay,
                old_overlay = hair.current && hair.current[1] ? hair.cache[hair.current[0]][hair.current[1]].overlay : null;
            
            direction = direction || current_direction;
            
            // Verify that the parameters are of appropriate values
            if ((type !== null) && !_.has(hair.definitions, type)) { throw new Error('Type invalid: ' + type); }
            if ((direction !== null) && !_.has(hair.pan_ranges, direction)) { throw new Error('Direction invalid: ' + direction + ' of type ' + type); }
            
            // HAIR REMOVAL
            // Only proceed if hair is already visible and
            // type has been given as null.
            if ((type === null) && hair.current) {
            
                if (old_overlay) { old_overlay.setVisible(false); }
                hair.current = null;
                hair.changed.dispatch(null);
            
            // HAIR ADDITION / SWITCH
            // Only proceed with it if etiher there is no hair shown or
            // hair shown is different from the one requested.
            } else if ((type !== null) && (!hair.current || _.difference(hair.current, [type, direction]).length)) {
            
                if (direction !== null) {
            
                    // Ensure the selected type/direction combination has
                    // been loaded - if it has not, load it
                    if (!_.has(hair.cache, type)) {
                        hair.cache[type] = {};
                        hair.cache[type][direction] = load_overlay(
                            hair.path
                                .replace('{type}', type)
                                .replace('{direction}', direction),
                            hair.definitions[type][direction]
                        );
                    } else if (!_.has(hair.cache[type], direction)) {
                        hair.cache[type][direction] = load_overlay(
                            hair.path
                                .replace('{type}', type)
                                .replace('{direction}', direction),
                            hair.definitions[type][direction]
                        );
                    }
                    
                    new_overlay = hair.cache[type][direction].overlay;
					console.log('New overlay: ', new_overlay);
                
                }
                
                if (old_overlay) { old_overlay.setVisible(false); console.log('Disabling old overlay.'); }
                if (new_overlay) { new_overlay.setVisible(true); console.log('Enabling new overlay.'); }
                
                hair.current = [type, direction];
                hair.changed.dispatch(hair.current);
            
            }
        
        };
        
        gapi.hangout.av.effects.onFaceTrackingDataChanged.add(function (ev) {
            var new_direction;
            if (ev.hasFace) {
            
                new_direction = _.chain(direction_calc)
                    .filter(function (item) { return (ev.pan >= item[1][0]) && (ev.pan <= item[1][1]); })
                    .pluck(0)
                    .first()
                    .value() || null;
                
                if (new_direction !== current_direction) {
                    current_direction = new_direction;
                    if (hair.current) {
                        hair.change(hair.current[0], new_direction);
                    }
                }
            
            }
        });
    
    }());
    
    (function () {
    
        var tweak_face = {
                'current_overlay': null,
                'controls': {
                    'scale': null,
                    'rotation': null,
                    'offset_x': null,
                    'offset_y': null
                }
            },
            tweak_hair = {
                'current_overlay': null,
                'controls': {
                    'scale': null,
                    'rotation': null,
                    'offset_x': null,
                    'offset_y': null
                }
            };
        
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
        
        _.each(['face', 'hair'], function (type) {
        
            var block = (type === 'face' ? tweak_face : tweak_hair);
            $('.' + type + ' div.range').each(function () {
            
                var name = this.getAttribute('data-name'),
					/* DEBUG */ span = $('> span', this.parentNode),
                    temp = $(this).slider({
                        'value': parseFloat(this.getAttribute('data-value')),
                        'min': parseFloat(this.getAttribute('data-min')),
                        'max': parseFloat(this.getAttribute('data-max')),
                        'step': parseFloat(this.getAttribute('data-step')),
                        'slide': (function () {
                            var result;
                            switch (name) {
                            
                            case 'scale':
                                result = function (ev, data) {
                                    if (block.current_overlay) {
                                        block.current_overlay.setScale(parseFloat(data.value));
										/* DEBUG */ span.text(parseFloat(data.value));
                                    }
                                };
                                break;
                            case 'rotation':
                                result = function (ev, data) {
                                    if (block.current_overlay) {
                                        block.current_overlay.setRotation(parseFloat(data.value) * Math.PI / 180);
										/* DEBUG */ span.text(parseFloat(data.value));
                                    }
                                };
                                break;
                            case 'offset_x':
                                result = function (ev, data) {
                                    if (block.current_overlay) {
                                        block.current_overlay.setOffset(
                                            parseFloat(data.value),
                                            block.current_overlay.getOffset().y
                                        );
										/* DEBUG */ span.text(parseFloat(data.value));
                                    }
                                };
                                break;
                            case 'offset_y':
                                result = function (ev, data) {
                                    if (block.current_overlay) {
                                        block.current_overlay.setOffset(
                                            block.current_overlay.getOffset().x,
                                            parseFloat(data.value)
                                        );
										/* DEBUG */ span.text(parseFloat(data.value));
                                    }
                                };
                                break;
                            
                            }
                            return result;
                        }())
                    });
                block.controls[name] = temp;
            
            });
        
        });
        
        faces.changed.add(function (current) {
        
            var overlay;
        
            if (!current) {
                tweak_face.current_overlay = null;
                _.each(tweak_face.controls, function (item) {
                    item.slider('value', item.attr('data-value'));
                });
            } else {
                overlay = tweak_face.current_overlay = faces.cache[current[0]][current[1]].overlay;
                tweak_face.controls.scale.slider('value', overlay.getScale());
                tweak_face.controls.rotation.slider('value', overlay.getRotation() * 180 / Math.PI);
                tweak_face.controls.offset_x.slider('value', overlay.getOffset().x);
                tweak_face.controls.offset_y.slider('value', overlay.getOffset().y);
            }
        
        });
        
        hair.changed.add(function (current) {
        
            var overlay;
        
            if (!current) {
                tweak_hair.current_overlay = null;
                _.each(tweak_hair.controls, function (item) {
                    item.slider('value', item.attr('data-value'));
                });
            } else if (current[1]) {
                overlay = tweak_hair.current_overlay = hair.cache[current[0]][current[1]].overlay;
                tweak_hair.controls.scale.slider('value', overlay.getScale());
                tweak_hair.controls.rotation.slider('value', overlay.getRotation() * 180 / Math.PI);
                tweak_hair.controls.offset_x.slider('value', overlay.getOffset().x);
                tweak_hair.controls.offset_y.slider('value', overlay.getOffset().y);
            }
        
        });
		
		hair.refreshed.add(function () {
			tweak_hair.current_overlay = hair.cache[hair.current[0]][hair.current[1]].overlay;
		});
    
    }());
	
	$('#faces button')
		.filter('[name="face"]').on('click', function (ev) {
		
			ev.preventDefault();
			if (faces.current && (faces.current[0] === this.value)) {
				faces.change(null);
			} else if (faces.current) {
				faces.change(this.value, faces.current[1]);
			} else {
				faces.change(this.value, 'polka');
			}
		
		}).end()
		.filter('[name="texture"]').on('click', function (ev) {
		
			ev.preventDefault();
			if (faces.current && faces.current[1] !== this.value) {
				faces.change(faces.current[0], this.value);
			}
		
		}).end()
		.filter('[name="hair"]').on('click', function (ev) {
		
			ev.preventDefault();
			if (hair.current && (hair.current[0] === this.value)) {
				hair.change(null);
			} else {
				hair.change(this.value);
			}
		
		}).end();
	
	$('.tabs').tabs();

}/*()*/);