/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:true, undef:true, unused:true, curly:true, browser:true, devel:true, indent:4, maxerr:50 */
/*global $:true, gapi:true */

( function() {"use strict";
		var whatWeBeUsing = "";
		var displaying = false;
		var base_url = $('head > base').prop('href') || '', overlays = {
			'turf' : {
				'url' : base_url + 'images/overlays/turf.png',
				'trackingFeature' : gapi.hangout.av.effects.FaceTrackingFeature.NOSE_ROOT,
				'offset' : {
					'x' : 0,
					'y' : -1
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
					'x' : 0,
					'y' : -1
				},
				'scale' : 0.95,
				'rotation' : 0,
				'scaleWithFace' : true,
				'rotateWithFace' : true
			},
			'turfRight' : {
				'url' : base_url + 'images/overlays/turfRight.png',
				'trackingFeature' : gapi.hangout.av.effects.FaceTrackingFeature.NOSE_ROOT,
				'offset' : {
					'x' : 0,
					'y' : -1
				},
				'scale' : 0.95,
				'rotation' : 0,
				'scaleWithFace' : true,
				'rotateWithFace' : true
			},
			
			'antlers' : {
				'url' : base_url + 'images/overlays/antlers.png',
				'trackingFeature' : gapi.hangout.av.effects.FaceTrackingFeature.NOSE_ROOT,
				'offset' : {
					'x' : 0,
					'y' : -1
				},
				'scale' : 0.95,
				'rotation' : 0,
				'scaleWithFace' : true,
				'rotateWithFace' : true
			},
			'fox' : {
				'url' : base_url + 'images/overlays/fox.png',
				'trackingFeature' : gapi.hangout.av.effects.FaceTrackingFeature.NOSE_ROOT,
				'offset' : {
					'x' : -0.15,
					'y' : -0.55
				},
				'scale' : 1.3,
				'rotation' : 0,
				'scaleWithFace' : true,
				'rotateWithFace' : true
			},
			'moose' : {
				'url' : base_url + 'images/overlays/moose.png',
				'trackingFeature' : gapi.hangout.av.effects.FaceTrackingFeature.NOSE_ROOT,
				'offset' : {
					'x' : 0,
					'y' : -0.4
				},
				'scale' : 1.7,
				'rotation' : 0,
				'scaleWithFace' : true,
				'rotateWithFace' : true
			},
			'rabbit' : {
				'url' : base_url + 'images/overlays/rabbit.png',
				'trackingFeature' : gapi.hangout.av.effects.FaceTrackingFeature.NOSE_ROOT,
				'offset' : {
					'x' : 0.05,
					'y' : -0.85
				},
				'scale' : 0.95,
				'rotation' : (-5 * Math.PI / 180),
				'scaleWithFace' : true,
				'rotateWithFace' : true
			}
		}, internals = {}, selected = null, load_position_values, apply_position_values, toggle_display, showDefaultFeed;

		function displayPan(faceTrack) {
			try {
				//		toggle_display(this.id); //this will change shit. We have ID's, etc.
				//	console.log(displaying); //prints whether overlays have been used yet.
				if (displaying == true) {
					var panModded = Math.floor(faceTrack.pan * 180 / Math.PI);
					if(panModded % 2 != 0){
						panModded -=1;
					}
					console.log(panModded);
					if(panModded >= 30){
						console.log("OVAR, BEOTCHES");
						toggle_display("turfRight");
					}
					if(panModded <= -30){
						console.log("UNDAR, BEOTCHES");
						toggle_display("turfLeft");
					}
					if(panModded > -30 && panModded < 30 && whatWeBeUsing != selected){
						toggle_display(whatWeBeUsing);
					}
					//console.log(selected);
				}
			} catch(e) {
				console.log(e);
			}
		}

		toggle_display = function(type) {
			displaying = true;
			var item;
			//console.log(displaying);
			// Validate existence of overlay type

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

		apply_position_values = function() {
			var temp, form, overlay;

			if (selected) {
				form = $('#position');
				overlay = internals[selected].overlay;

				temp = Math.round(parseFloat(form.find('[data-name="scale"]').slider('value')) * 100) / 100;
				//form.find('output[for="scale"]').val(temp);
				overlay.setScale(temp);

				temp = parseInt(form.find('[data-name="rotation"]').slider('value'), 10);
				//form.find('output[for="rotation"]').val(temp);
				temp = temp * Math.PI / 180;
				overlay.setRotation(temp);

				temp = {
					'x' : Math.round(parseFloat(form.find('[data-name="offset_x"]').slider('value')) * 100) / 100,
					'y' : Math.round(parseFloat(form.find('[data-name="offset_y"]').slider('value')) * 100) / 100
				};
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