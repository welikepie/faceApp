/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:true, undef:true, unused:true, curly:true, browser:true, devel:true, indent:4, maxerr:50 */
/*global $:true, gapi:true */

( function() {"use strict";
		var whatWeBeUsing = "";
		var displaying = false;
		var facetexture = "silver";
		var facetype = "faceType1";
		var base_url = $('head > base').prop('href') || '';
		var faceSkins = {
			'faceType1silver':{
				'url' : base_url + 'images/overlays/faceTextures/faceType1silver.png',
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
		};
		var overlays = {
			'turf' : {
				'url' : base_url + 'images/overlays/turf.png',
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
			'turfLeft' : {
				'url' : base_url + 'images/overlays/turfLeft.png',
				'trackingFeature' : gapi.hangout.av.effects.FaceTrackingFeature.NOSE_ROOT,
				'offset' : {
					'x' : 0.3,
					'y' : -0.15
				},
				'scale' : 0.81,
				'rotation' : -0.21,
				'scaleWithFace' : true,
				'rotateWithFace' : true
			},
			'turfRight' : {
				'url' : base_url + 'images/overlays/turfRight.png',
				'trackingFeature' : gapi.hangout.av.effects.FaceTrackingFeature.NOSE_ROOT,
				'offset' : {
					'x' : -0.3,
					'y' : -0.15
				},
				'scale' : 0.81,
				'rotation' : 0.21,
				'scaleWithFace' : true,
				'rotateWithFace' : true
			},
			'fx' : {
				'url' : base_url + 'images/overlays/fx.png',
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
			'fxLeft' : {
				'url' : base_url + 'images/overlays/fxLeft.png',
				'trackingFeature' : gapi.hangout.av.effects.FaceTrackingFeature.NOSE_ROOT,
				'offset' : {
					'x' : 0.33,
					'y' : -0.53
				},
				'scale' : 0.79,
				'rotation' : -0.20,
				'scaleWithFace' : true,
				'rotateWithFace' : true
			},
			'fxRight' : {
				'url' : base_url + 'images/overlays/fxRight.png',
				'trackingFeature' : gapi.hangout.av.effects.FaceTrackingFeature.NOSE_ROOT,
				'offset' : {
					'x' : -0.33,
					'y' : -0.53
				},
				'scale' : 0.79,
				'rotation' : 0.20,
				'scaleWithFace' : true,
				'rotateWithFace' : true
			},
			'gold' : {
				'url' : base_url + 'images/overlays/gold.png',
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
			'goldLeft' : {
				'url' : base_url + 'images/overlays/goldLeft.png',
				'trackingFeature' : gapi.hangout.av.effects.FaceTrackingFeature.NOSE_ROOT,
				'offset' : {
					'x' : 0.32,
					'y' : -0.45
				},
				'scale' : 0.88,
				'rotation' : -0.83,
				'scaleWithFace' : true,
				'rotateWithFace' : true
			},
			'goldRight' : {
				'url' : base_url + 'images/overlays/goldRight.png',
				'trackingFeature' : gapi.hangout.av.effects.FaceTrackingFeature.NOSE_ROOT,
				'offset' : {
					'x' : -0.32,
					'y' : -0.45
				},
				'scale' : 0.88,
				'rotation' : 0.83,
				'scaleWithFace' : true,
				'rotateWithFace' : true
			},
			'polka' : {
				'url' : base_url + 'images/overlays/polka.png',
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
			'polkaLeft' : {
				'url' : base_url + 'images/overlays/polkaLeft.png',
				'trackingFeature' : gapi.hangout.av.effects.FaceTrackingFeature.NOSE_ROOT,
				'offset' : {
					'x' : 0.31,
					'y' : -0.36
				},
				'scale' : 0.68,
				'rotation' : -0.40,
				'scaleWithFace' : true,
				'rotateWithFace' : true
			},
			'polkaRight' : {
				'url' : base_url + 'images/overlays/polkaRight.png',
				'trackingFeature' : gapi.hangout.av.effects.FaceTrackingFeature.NOSE_ROOT,
				'offset' : {
					'x' : -0.31,
					'y' : -0.36
				},
				'scale' : 0.68,
				'rotation' : 0.40,
				'scaleWithFace' : true,
				'rotateWithFace' : true
			}
		},
		internals = {},
		internalTexture = {},
		selected = null,
		genommen = null,
		load_position_values,
		apply_position_values,
		toggle_display,
		toggle_texture,
		load_position_values_textures,
		showDefaultFeed,

		ui = {
			'face': {
				'currentFaceType': null,
				'currentFaceTexture': 'polka',

				'changeFaceType': function (face) {
					if (this.currentFaceType === face) {
						this.currentFaceType = null;
					} else {
						this.currentFaceType = face;
					}
					this.changeOverlay();
				},
				'changeFaceTexture': function (texture) {
					if (this.currentFaceTexture !== texture) {
						this.currentFaceTexture = texture;
						this.changeOverlay();
					}
				},
				'changeOverlay': function () {
					if (!this.currentFaceType) {
						console.log('Disabling face overlay.');
						/* MAGIC GOES HERE */
					} else {
						console.log('Changing overlay to type [' + this.currentFaceType + '] and texture [' + this.currentFaceTexture + '].');
						/* MAGIC GOES HERE */
					}
				}
			},
			'hair': {
				'currentHair': null,
				'changeHair': function (hair) {
					if (this.currentHair === hair) {
						this.currentHair = null;
						console.log('Disabling hair overlay.');
						/* MAGIC GOES HERE */
					} else {
						this.currentHair = hair;
						console.log('Changing hair overlay to [' + this.currentHair + '].');
						/* MAGIC GOES HERE */
					}
				}
			},
			'tweaking': {

				'FACE': 0, // Constant to mark that transformation applies to face overlay
				'HAIR': 1, // Constant to mark that transformation applies to hair overlay

				'changeScale': function (type, x, y) {
					// Type as one of constants
					// X and Y between 0 and 2
					console.log('Changing ' + (type === this.HAIR ? 'hair' : 'face') + ' overlay scale to [' + x + ', ' + y + '].');
					/* MAGIC GOES HERE */
				},
				'changeRotation': function (type, degree) {
					// Degree returned as regular degrees, between -90 and 90
					console.log('Changing ' + (type === this.HAIR ? 'hair' : 'face') + ' overlay rotation to ' + degree + '.');
					/* MAGIC GOES HERE */
				},
				'changeOffsetX': function (type, x) {
					// Type as one of constants
					// X and Y between -1 and 1
					console.log('Changing ' + (type === this.HAIR ? 'hair' : 'face') + ' overlay X offset to [' + x + '].');
					/* MAGIC GOES HERE */
				},
				'changeOffsetY': function (type, y) {
					// Type as one of constants
					// X and Y between -1 and 1
					console.log('Changing ' + (type === this.HAIR ? 'hair' : 'face') + ' overlay Y offset to [' + y + '].');
					/* MAGIC GOES HERE */
				}
				
			}
		};
		
		// Initialise the UI
		$('.tabs').tabs();
		
		$('#faces button')
			.filter('[name="face"]').on('click', function (ev) {
				ev.preventDefault();
				ui.face.changeFaceType(this.value);
			}).end()
			.filter('[name="texture"]').on('click', function (ev) {
				ev.preventDefault();
				ui.face.changeFaceTexture(this.value);
			}).end()
			.filter('[name="hair"]').on('click', function (ev) {
				ev.preventDefault();
				ui.hair.changeHair(this.value);
			}).end();
		
		$('input[type="range"]')
		.replaceWith(function () {
		
			var el = document.createElement('div');
			el.className = 'range';
			el.setAttribute('data-min', this.getAttribute('min'));
			el.setAttribute('data-max', this.getAttribute('max'));
			el.setAttribute('data-step', this.getAttribute('step'));
			el.setAttribute('data-name', this.getAttribute('name'));
			el.setAttribute('data-value', this.getAttribute('value'));
			
			return el;
		
		});
		$('#tweaking')
			.find('.texture div.range').each(function () {
			
				var type = this.getAttribute('data-name');
			
				$(this).slider({
					'value': parseFloat(this.getAttribute('data-value')),
					'min': parseFloat(this.getAttribute('data-min')),
					'max': parseFloat(this.getAttribute('data-max')),
					'step': parseFloat(this.getAttribute('data-step')),
					'change': function (ev, data) {
						switch (type) {
							case 'scale':
								ui.tweaking.changeScale(ui.tweaking.FACE, data.value, data.value);
								break;
							case 'rotation':
								ui.tweaking.changeRotation(ui.tweaking.FACE, data.value);
								break;
							case 'offset_x':
								ui.tweaking.changeOffsetX(ui.tweaking.FACE, data.value);
								break;
							case 'offset_y':
								ui.tweaking.changeOffsetY(ui.tweaking.FACE, data.value);
								break;
						}
					}
				});
			
			}).end()
			.find('.hair div.range').each(function () {
			
				var type = this.getAttribute('data-name');
			
				$(this).slider({
					'value': parseFloat(this.getAttribute('data-value')),
					'min': parseFloat(this.getAttribute('data-min')),
					'max': parseFloat(this.getAttribute('data-max')),
					'step': parseFloat(this.getAttribute('data-step')),
					'change': function (ev, data) {
						switch (type) {
							case 'scale':
								ui.tweaking.changeScale(ui.tweaking.HAIR, data.value, data.value);
								break;
							case 'rotation':
								ui.tweaking.changeRotation(ui.tweaking.HAIR, data.value);
								break;
							case 'offset_x':
								ui.tweaking.changeOffsetX(ui.tweaking.HAIR, data.value);
								break;
							case 'offset_y':
								ui.tweaking.changeOffsetY(ui.tweaking.HAIR, data.value);
								break;
						}
					}
				});
			
			}).end();

		function displayPan(faceTrack) {
			try {
				//		toggle_display(this.id); //this will change shit. We have ID's, etc.
				//	console.log(displaying); //prints whether overlays have been used yet.
				if (displaying == true) {
					var panModded = Math.floor(faceTrack.pan * 180 / Math.PI);
					if(panModded % 2 != 0){
						panModded -=1;
					}
					//console.log(panModded);
					if(panModded >= 30){
						toggle_display(whatWeBeUsing+"Right");
					}
					if(panModded <= -30){
						toggle_display(whatWeBeUsing+"Left");
					}
					if(panModded > -30 && panModded < 30 && whatWeBeUsing != selected){
						toggle_display(whatWeBeUsing);
					}
					//console.log(selected);
				}
			} catch(e) {
				console.log(e);
			}
		};

		toggle_texture = function(){
			var typ = facetype + facetexture;
			var gegenstand;
			if(!(typ in faceSkins)){
				throw new Error('`' + typ + '` is not a valid overlay type.');
			}
			
			
			// If first call to toggle, assume the image has not been loaded
			if (!( typ in internalTexture)) {

				internalTexture[typ] = {
					'resource' : gapi.hangout.av.effects.createImageResource(faceSkins[typ].url),
					'overlay' : null
				};

				internalTexture[typ].overlay = internalTexture[typ].resource.createFaceTrackingOverlay({
					'scale' : faceSkins[typ].scale,
					'rotation' : faceSkins[typ].rotation,
					'offset' : faceSkins[typ].offset,
					'scaleWithFace' : faceSkins[typ].scaleWithFace,
					'rotateWithFace' : faceSkins[typ].rotateWithFace,
					'trackingFeature' : faceSkins[typ].trackingFeature
				});
				genommen = typ; // mach 'nen neuen variable fuer selected.

				for (gegenstand in internalTexture) {
					if (internalTexture.hasOwnProperty(gegenstand)) {
						internalTexture[gegenstand].overlay.setVisible(gegenstand === typ);
					}
				}
				load_position_values_textures(); //re-write for faceSkins
			} else {
				genommen = typ;
				for (gegenstand in internalTexture) {
					if (internalTexture.hasOwnProperty(gegenstand)) {
						internalTexture[gegenstand].overlay.setVisible(gegenstand === typ);
					}
				}
				load_position_values_textures(); //re-write this for faceSkins
			}			
		}
		
		
		toggle_display = function(type) {
			displaying = true;
			var item;
			//console.log(displaying);
			//Validate existence of overlay type

			if (!( type in overlays)) {
				throw new Error('`' + type + '` is not a valid overlay type.');
			}

			// If first call to toggle, assume the image has not been loaded
			if (!( type in internals)) {

				internals[type] = {
					'resource' : gapi.hangout.av.effects.createImageResource(overlays[type].url),
					'overlay' : null
				};

				internals[type].overlay = internals[type].resource.createFaceTrackingOverlay({
					'scale' : overlays[type].scale,
					'rotation' : overlays[type].rotation,
					'offset' : overlays[type].offset,
					'scaleWithFace' : overlays[type].scaleWithFace,
					'rotateWithFace' : overlays[type].rotateWithFace,
					'trackingFeature' : overlays[type].trackingFeature
				});
				selected = type;

				for (item in internals) {
					if (internals.hasOwnProperty(item)) {
						internals[item].overlay.setVisible(item === type);
					}
				}
				load_position_values();

			} else {
				selected = type;
				for (item in internals) {
					if (internals.hasOwnProperty(item)) {
						internals[item].overlay.setVisible(item === type);
					}
				}
				load_position_values();
			}

		};
		load_position_values = function() {
			var temp, form, overlay;

			if (selected) {

				form = $('#position');
				overlay = internals[selected].overlay;

				temp = Math.round(overlay.getScale() * 100) / 100;
				form.find('[data-name="scale"]').slider('value', temp);

				temp = Math.round(overlay.getRotation() * 180 / Math.PI);
				form.find('[data-name="rotation"]').slider('value', temp);

				temp = Math.round(overlay.getOffset().x * 100) / 100;
				form.find('[data-name="offset_x"]').slider('value', temp);

				temp = Math.round(overlay.getOffset().y * 100) / 100;
				form.find('[data-name="offset_y"]').slider('value', temp);

			}

		};
		
		load_position_values_textures = function() {
			var temp2, form2, overlay2;
			if (genommen) {
				form2 = $('#position');
				overlay2 = internalTexture[genommen].overlay;

				temp2 = Math.round(overlay2.getScale() * 100) / 100;
				form2.find('[data-name="scale"]').slider('value', temp2);

				temp2 = Math.round(overlay2.getRotation() * 180 / Math.PI);
				form2.find('[data-name="rotation"]').slider('value', temp2);

				temp2 = Math.round(overlay2.getOffset().x * 100) / 100;
				form2.find('[data-name="offset_x"]').slider('value', temp2);

				temp2 = Math.round(overlay2.getOffset().y * 100) / 100;
				form2.find('[data-name="offset_y"]').slider('value', temp2);

			}

		};

		apply_position_values = function() {
			var temp, form, overlay;

			if (selected) {
				form = $('#position');
				overlay = internals[selected].overlay;
				temp = Math.round(parseFloat(form.find('[data-name="scale"]').slider('value')) * 100) / 100;
				//form.find('output[for="scale"]').val(temp);
				overlay.setScale(temp);
				console.log("Image scale:"+temp);

				temp = parseInt(form.find('[data-name="rotation"]').slider('value'), 10);
				//form.find('output[for="rotation"]').val(temp);
				temp = temp * Math.PI / 180;
				console.log("rotation:"+temp);
				overlay.setRotation(temp);

				temp = {
					'x' : Math.round(parseFloat(form.find('[data-name="offset_x"]').slider('value')) * 100) / 100,
					'y' : Math.round(parseFloat(form.find('[data-name="offset_y"]').slider('value')) * 100) / 100
				};
				console.log("offset = X:"+temp.x+",Y:"+temp.y);
				//form.find('output[for="offset_x"]').val(temp.x);
				//form.find('output[for="offset_y"]').val(temp.y);
				overlay.setOffset(temp);
			}

		};

		function showDefaultFeed() {
			var currentHighlightedParticipantId = null;

			// Remove the highlighting.
			if (currentHighlightedParticipantId) {
				gapi.hangout.av.clearAvatar(currentHighlightedParticipantId);
			}

			var feed = gapi.hangout.layout.getDefaultVideoFeed();
			var canvas = gapi.hangout.layout.getVideoCanvas();

			canvas.setVideoFeed(feed);
			canvas.setWidth(600);
			canvas.setPosition(300, 50);
			canvas.setVisible(true);

			// Update the text
		}

		//
		$('#faceTypes button').on('click',function(){
			facetype = this.id;
			toggle_texture();
		});
		$('#textures button').on('click',function(){
			facetexture = this.id;
			toggle_texture();
		});
		$('#overlays button').on('click', function() {
			toggle_display(this.id);
			whatWeBeUsing = this.id;
		});
		//ask arran about changing the app format to a full app instead of side app. Add video etc. Makes shit easy.

		/* $('button').button().draggable(
		{
		cancel:false,
		revert:true,
		containment:"document",
		zIndex:99999,
		helper:"clone"
		}
		); */

		//$('#sdf').live("click", showDefaultFeed());
		$('#position span[data-name]').each(function() {
			console.log(this);
			var el = $(this);
			el.slider({
				'value' : parseFloat(el.attr('data-value')),
				'min' : parseFloat(el.attr('data-min')),
				'max' : parseFloat(el.attr('data-max')),
				'step' : parseFloat(el.attr('data-step')),
				'slide' : apply_position_values
			});
		});

		gapi.hangout.av.effects.onFaceTrackingDataChanged.add(displayPan);

	}());