'use strict';

angular.module('core').directive('videoShuffle', [ '$window',
  function($window) {
    return {
      template: '<video class="background-video" id="backgroundVideo" autoplay preload type="" src=""></video>' +
                '<video class="background-video" id="stagingVideo" autoplay preload type="" style="opacity:0;" src=""></video>',
      restrict: 'A',
      link: function postLink(scope, element, attrs) {

        var videoTimer = null;
        
        //Clips for the videos
        var clips = [
          ['bike', 9900],
          ['bikefar', 4900],
          ['house1', 2900],
          ['jonnyskateboard', 5900],
          ['kidshouse', 1900],
          ['leahdog', 4900],
          ['majesticdog', 4900],
          ['trackingdriveway', 4900],
          ['trackingstreet', 3900]
        ];

        var settings = {
          videoContainer: element.find('#backgroundVideo'),
          stagingContainer: element.find('#stagingVideo')
        };

        var currentClip = 2;

        function resize() {
          // get native video size
          var videoHeight = settings.videoContainer[0].videoHeight,
              videoWidth = settings.videoContainer[0].videoWidth;

          // get wrapper size
          var wrapperWidth = element.width();

          var calculatedVideoHeight = wrapperWidth / (videoWidth / videoHeight);

          settings.videoContainer.css({
              'width': wrapperWidth,
              'height': calculatedVideoHeight
          });
          settings.stagingContainer.css({
              'width': wrapperWidth,
              'height': calculatedVideoHeight
          });

          settings.videoContainer.animate({opacity:1}, 2000);
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

          clips = $window._.shuffle(clips);

          settings.videoContainer.attr('src', '/modules/core/img/video/' + clips[0][0] + settings.supportedType);
          settings.videoContainer[0].load();

          settings.stagingContainer.attr('src', '/modules/core/img/video/' + clips[1][0] + settings.supportedType);
          settings.stagingContainer[0].load();
          settings.stagingContainer[0].pause();

          videoTimer = window.setTimeout(function() {
            loop();
          }, clips[0][1]);
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

          if(settings.videoContainer.css('opacity') === '0') {
            
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
        resize();

      }
    };
  }
]);