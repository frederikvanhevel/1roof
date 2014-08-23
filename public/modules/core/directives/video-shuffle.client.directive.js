'use strict';

angular.module('core').directive('backgroundVideo', [ '$window',
  function($window) {
    return {
      template: '<video id="backgroundVideo" autoplay preload type="" src=""></video>' +
                '<video id="stagingVideo" autoplay preload type="" src=""></video>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {

        var videoTimer = null;
        
        //Clips for the videos
        var clips = [
          // ['bike', 9900],
          ['bikefar', 4900],
          ['house1', 2900],
          ['jonnyskateboard', 5900],
          ['kidshouse', 1900],
          ['leahdog', 4900],
          ['majesticdog', 4900],
          ['trackingdriveway', 4900]
          // ['trackingstreet', 3900]
        ];

        var settings = {
          'videoContainer': element.find('#backgroundVideo'),
          'stagingContainer': element.find('#stagingVideo'),
          // 'videoWebM': $('#backgroundVideoWebM'),
          // 'videoMp4': $('#backgroundVideoMp4'),
          // 'stagingWebM': $('#stagingVideoWebM'),
          // 'stagingMp4': $('#stagingVideoMp4'),
          // 'supportedTypeExt': 'webm'
        };

        var currentClip = 2;

        function shuffle() {
          for (var i = clips.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = clips[i];
            clips[i] = clips[j];
            clips[j] = temp;
          }
        }


        function throwFullScreen() {
          var browserHeight = $window.$(window).height(),
            browserWidth = $window.$(window).width(),
            videoHeight = 1280,
            videoWidth = 1920,
            videoRatio = videoWidth / videoHeight,
            scaleWidth = browserWidth / videoWidth,
            scaleHeight = browserHeight / videoHeight,
            scale = scaleHeight > scaleWidth ? scaleHeight : scaleWidth,
            fullScreenWidth = scale * videoWidth,
            fullScreenHeight = scale * videoHeight;

          if(scaleWidth > scaleHeight) {
            settings.videoContainer.css('width', '100%');
            settings.videoContainer.css('height', 'auto');
            settings.stagingContainer.css('width', '100%');
            settings.stagingContainer.css('height', 'auto');  
          }
          else {
            settings.videoContainer.css('height', '100%');
            settings.videoContainer.css('width', 'auto');
            settings.stagingContainer.css('height', '100%');
            settings.stagingContainer.css('width', 'auto'); 
          }
          
          // $('#videoContainer').animate({opacity:1}, 2000);
        }


        function stopVideo() {
          clearTimeout(videoTimer);
          settings.stagingContainer[0].pause();
          settings.videoContainer[0].pause();
        }

        function buildInitialVideo() {
          if(settings.videoContainer[0].canPlayType('video/webm')) {
            settings.supportedType = '.webm';
            settings.videoContainer.attr('type', 'video/webm;codecs=\'vp8\'');
          }
          else {
            settings.supportedType = '.mp4';
            settings.videoContainer.attr('type', 'video/mp4;codecs=\'avc1.42E01E, mp4a.40.2\'');
          }

          shuffle();

          settings.videoContainer.attr('src', '/modules/core/img/video/' + clips[0][0] + settings.supportedType);
          settings.videoContainer[0].load();

          settings.stagingContainer.attr('src', '/modules/core/img/video/' + clips[1][0] + settings.supportedType);
          settings.stagingContainer[0].load();
          settings.stagingContainer[0].pause();

          videoTimer = window.setTimeout(function() {
            console.log('looping');
            loop();
          }, clips[0][1]);

          return true;
        }

        function loop() {
          videoTimer = null;

          var nextClip = clips[1][0],
            currentTime = clips[1][1];

          if(!clips[currentClip + 1]) {
            currentClip = 1;
            nextClip = clips[1][0];
            currentTime = clips[clips.length - 1][1];
          }
          else {
            nextClip = clips[currentClip + 1][0];
            currentTime = clips[currentClip][1];
          }

          if(settings.videoContainer.css('opacity') === 0) {
            settings.videoContainer[0].play();
            settings.videoContainer.animate({'opacity':1}, 150, function() {
              settings.stagingContainer.animate({'opacity': 0}, 0);
              settings.stagingContainer.attr('src', '/modules/core/img/video/' + nextClip + settings.supportedType);
              settings.stagingContainer[0].load();
              settings.stagingContainer[0].pause();
            });
          }
          else {
            settings.stagingContainer[0].play();
            settings.stagingContainer.animate({'opacity':1}, 150, function() {
              settings.videoContainer.animate({'opacity': 0}, 0);
              settings.videoContainer.attr('src', '/modules/core/img/video/' + nextClip + settings.supportedType);
              settings.videoContainer[0].load();
              settings.videoContainer[0].pause();
            });
          }
          currentClip++;

          videoTimer = window.setTimeout(function() {
            loop();
          }, currentTime);
        }

        buildInitialVideo();
        loop();

      }
    };
  }
]);