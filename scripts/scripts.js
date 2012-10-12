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

        /* Base URL is extracted from HTML file to limit
         * the number of changes to URLs one has to make while
         * deploying the app to different server (absolute URLs
         * are required).
         */
    var base_url = $('head > base').prop('href') || '',
    
        /* This namespace holds all the details regarding the face overlays,
         * including the definitions for all face types and their corresponing
         * textures.
         */
        faces = {
        
            'path': base_url + 'images/textures/{type}-{texture}.png', // Template for image URLs
            'current': null,  // Null if no face was selected, array of [type, texture] otherwise
            'cache': {},      // Object used to hold loaded resources and initialised overlays
            
            'change': null,   // Function called with (type {string|null}, texture {optional:string}
                              // to change the face overlay (either show one, change it to a different
                              // one or hide it). When called with type string, display or switch.
                              // When called with null, hide.
                              
            'changed': new signals.Signal(),  // signal thrown whenever the face has been changed
            
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
                        'y' : 0.08
                    },
                    'scale' : 1.05,
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
                        'y' : 0.11
                    },
                    'scale' : 1.1,
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
                        'y' : 0.12
                    },
                    'scale' : 1.09,
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
                        'y' : 0.09
                    },
                    'scale' : 1.03,
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
                        'y' : 0.09
                    },
                    'scale' : 1.17,
                    'rotation' : 0,
                    'scaleWithFace' : true,
                    'rotateWithFace' : true
                }
            }
        
        },
        
        /* Namespace used for managing the hair style overlay.
         * Similar to face one, but with some changes to accommodate direction instead of texture.
         */
        hair = {
        
            'path': base_url + 'images/hair/{type}-{direction}.png',
            
            // Pan ranges specify which direction applies for
            // which pan value ranges. Direction becomes null if
            // current pan value does not fit any range.
            'pan_ranges': {
                'left': [-180, -15],
                'right': [15, 180]
            },
            'current': null, // Null if nothing displayed, array of [type, direction] otherwise.
                             // Direction can be null (nothing will display), but it still indicates
                             // an overlay to display.
            'cache': {},
            
            'change': null,
            'changed': new signals.Signal(),    // Thrown when the hair style overlay was changed
            'refreshed': new signals.Signal(),  // Thrown when the hair style overlay was reinitialised;
                                                // This is to accommodate the enforcement of order (hair on top)
            
            'definitions': {
                'badfx': {
                    'left': {
                        'trackingFeature' : gapi.hangout.av.effects.FaceTrackingFeature.NOSE_ROOT,
                        'offset' : {
                            'x' : 0.34,
                            'y' : -0.46
                        },
                        'scale' : 0.71,
                        'rotation' : (-11 * Math.PI / 180),
                        'scaleWithFace' : true,
                        'rotateWithFace' : true
                    },
                    'right': {
                        'trackingFeature' : gapi.hangout.av.effects.FaceTrackingFeature.NOSE_ROOT,
                        'offset' : {
                            'x' : -0.34,
                            'y' : -0.46
                        },
                        'scale' : 0.71,
                        'rotation' : (11 * Math.PI / 180),
                        'scaleWithFace' : true,
                        'rotateWithFace' : true
                    }
                },
                'gold': {
                    'left': {
                        'trackingFeature' : gapi.hangout.av.effects.FaceTrackingFeature.NOSE_ROOT,
                        'offset' : {
                            'x' : 0.47,
                            'y' : -0.58
                        },
                        'scale' : 0.81,
                        'rotation' : (-45 * Math.PI / 180),
                        'scaleWithFace' : true,
                        'rotateWithFace' : true
                    },
                    'right': {
                        'trackingFeature' : gapi.hangout.av.effects.FaceTrackingFeature.NOSE_ROOT,
                        'offset' : {
                            'x' : -0.47,
                            'y' : -0.58
                        },
                        'scale' : 0.81,
                        'rotation' : (45 * Math.PI / 180),
                        'scaleWithFace' : true,
                        'rotateWithFace' : true
                    }
                },
                'polka': {
                    'left': {
                        'trackingFeature' : gapi.hangout.av.effects.FaceTrackingFeature.NOSE_ROOT,
                        'offset' : {
                            'x' : 0.4,
                            'y' : -0.44
                        },
                        'scale' : 0.68,
                        'rotation' : (-18 * Math.PI / 180),
                        'scaleWithFace' : true,
                        'rotateWithFace' : true
                    },
                    'right': {
                        'trackingFeature' : gapi.hangout.av.effects.FaceTrackingFeature.NOSE_ROOT,
                        'offset' : {
                            'x' : -0.4,
                            'y' : -0.44
                        },
                        'scale' : 0.68,
                        'rotation' : (18 * Math.PI / 180),
                        'scaleWithFace' : true,
                        'rotateWithFace' : true
                    }
                },
                'turf': {
                    'left': {
                        'trackingFeature' : gapi.hangout.av.effects.FaceTrackingFeature.NOSE_ROOT,
                        'offset' : {
                            'x' : 0.24,
                            'y' : -0.3
                        },
                        'scale' : 0.73,
                        'rotation' : (-15 * Math.PI / 180),
                        'scaleWithFace' : true,
                        'rotateWithFace' : true
                    },
                    'right': {
                        'trackingFeature' : gapi.hangout.av.effects.FaceTrackingFeature.NOSE_ROOT,
                        'offset' : {
                            'x' : -0.24,
                            'y' : -0.3
                        },
                        'scale' : 0.73,
                        'rotation' : (15 * Math.PI / 180),
                        'scaleWithFace' : true,
                        'rotateWithFace' : true
                    }
                }
            }
        
        };
    
    /* Within this scope, the face and hair change functions are defined,
     * along with the event handler for face tracking data, responsible for
     * adjusting the direction parameter for overlays.
     */
    (function () {
    
        var current_direction = 'right',               // Last detected direction
            direction_calc = _.chain(hair.pan_ranges)  // Pan ranges after doing some pre-processing (easier calculations)
                .pairs()
                .map(function (item) {
                    return [
                        item[0],
                        _.map(item[1], function (x) { return x * Math.PI / 180; })
                    ];
                }),
        
            /* This function takes care of loading the image resources and creating the
             * overlay the first time an  overlay of particular type is requested.
             */
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
                overlay_specs;
        
            // Verify that both the type and the texture are of valid values
            if ((type !== null) && !_.has(faces.definitions, type)) { throw new Error('Type invalid: ' + type); }
            if ((type !== null) && !_.contains(faces.definitions[type].textures, texture)) { throw new Error('Texture invalid: ' + texture + ' of type ' + type); }
            
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
            
                // Ensure the requested face/texture combo has been loaded.
                // Load it if it's missing. Also, as different overlays for same
                // face type, but different textures are to be managed together,
                // make it inherit properties from one alredy established if possible
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
                        (function () {
                        
                            var first_overlay = _.chain(faces.cache[type])
                                .values().first()
                                .value().overlay;
                            
                            return _.chain(faces.definitions[type])
                                .omit('textures')
                                .extend({
                                    'scale': first_overlay.getScale(),
                                    'rotation': first_overlay.getRotation(),
                                    'offset': first_overlay.getOffset()
                                })
                                .value();
                        
                        }())
                    );
                }
                
                old_overlay = faces.current ? faces.cache[faces.current[0]][faces.current[1]].overlay : null;
                new_overlay = faces.cache[type][texture].overlay;
                hair_overlay = hair.current && hair.current[1] ? hair.cache[hair.current[0]][hair.current[1]].overlay : null;
                
                if (old_overlay) { old_overlay.setVisible(false); }
                if (hair_overlay) {
                    overlay_specs = {
                        'scale': hair_overlay.getScale(),
                        'rotation': hair_overlay.getRotation(),
                        'offset': hair_overlay.getOffset()
                    };
                    hair_overlay.setVisible(false);
                    hair_overlay.dispose();
                    hair_overlay = true;
                    hair_cache = hair.cache[hair.current[0]][hair.current[1]];
                }
                new_overlay.setVisible(true);
                if (hair_overlay) {
                    hair_cache.overlay = hair_cache.resource.createFaceTrackingOverlay({
                        'scale' : overlay_specs.scale,
                        'rotation' : overlay_specs.rotation,
                        'offset' : overlay_specs.offset,
                        'scaleWithFace' : hair.definitions[hair.current[0]][hair.current[1]].scaleWithFace,
                        'rotateWithFace' : hair.definitions[hair.current[0]][hair.current[1]].rotateWithFace,
                        'trackingFeature' : hair.definitions[hair.current[0]][hair.current[1]].trackingFeature
                    });
                    hair_cache.overlay.setVisible(true);
                    hair.refreshed.dispatch();
                }
                
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
                
                }
                
                if (old_overlay) { old_overlay.setVisible(false); }
                if (new_overlay) { new_overlay.setVisible(true); }
                
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
                    // DEBUG span = $('> span', this.parentNode),
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
                                        if (type === 'face') {
                                            _.chain(faces.cache[faces.current[0]])
                                            .pluck('overlay')
                                            .invoke('setScale', parseFloat(data.value));
                                        } else {
                                            block.current_overlay.setScale(parseFloat(data.value));
                                        }
                                        // DEBUG span.text(parseFloat(data.value));
                                    }
                                };
                                break;
                            case 'rotation':
                                result = function (ev, data) {
                                    if (block.current_overlay) {
                                        if (type === 'face') { 
                                            _.chain(faces.cache[faces.current[0]])
                                            .pluck('overlay')
                                            .invoke('setRotation', parseFloat(data.value) * Math.PI / 180);
                                        } else {
                                            block.current_overlay.setRotation(parseFloat(data.value) * Math.PI / 180);
                                        }
                                        // DEBUG span.text(parseFloat(data.value));
                                    }
                                };
                                break;
                            case 'offset_x':
                                result = function (ev, data) {
                                    if (block.current_overlay) {
                                        if (type === 'face') { 
                                            _.chain(faces.cache[faces.current[0]])
                                            .pluck('overlay')
                                            .invoke(
                                                'setOffset',
                                                parseFloat(data.value),
                                                block.current_overlay.getOffset().y
                                            );
                                        } else {
                                            block.current_overlay.setOffset(
                                                parseFloat(data.value),
                                                block.current_overlay.getOffset().y
                                            );
                                        }
                                        // DEBUG span.text(parseFloat(data.value));
                                    }
                                };
                                break;
                            case 'offset_y':
                                result = function (ev, data) {
                                    if (block.current_overlay) {
                                        if (type === 'face') { 
                                            _.chain(faces.cache[faces.current[0]])
                                            .pluck('overlay')
                                            .invoke(
                                                'setOffset',
                                                block.current_overlay.getOffset().x,
                                                parseFloat(data.value)
                                            );
                                        } else {
                                            block.current_overlay.setOffset(
                                                block.current_overlay.getOffset().x,
                                                parseFloat(data.value)
                                            );
                                        }
                                        // DEBUG span.text(parseFloat(data.value));
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