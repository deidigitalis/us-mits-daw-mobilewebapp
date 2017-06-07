// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in cordova-simulate or on Android devices/emulators: launch your app, set breakpoints, 
// and then run 'window.location.reload()' in the JavaScript Console.
(function () {
  'use strict';

  document.addEventListener('deviceready', onDeviceReady.bind(this), false);

  function onDeviceReady() {
    // Handle the Cordova pause and resume events
    document.addEventListener('pause', onPause.bind(this), false);
    document.addEventListener('resume', onResume.bind(this), false);
    initialCheck();


    // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
    //var parentElement = document.getElementById('deviceready');
    //var listeningElement = parentElement.querySelector('.listening');
    //var receivedElement = parentElement.querySelector('.received');
    //listeningElement.setAttribute('style', 'display:none;');
    //receivedElement.setAttribute('style', 'display:block;');
  }

  /**
   * This application has been suspended. Save application state here.
   */
  function onPause() {
    $('#mainTrackingPage').on('vclick', function () { });
  }

  /**
   * This application has been reactivated. Restore application state here.
   */
  function onResume() {
    $('#mainTrackingPage').on('vclick', onTrackingPageClickEvent);
  }

  function updateHtmlCurrentPosition(latitude, longitude) {
    $('#latitude').html(latitude);
    $('#longitude').html(longitude);
  }

  function updateCurrentPosition() {
    navigator.geolocation.getCurrentPosition(function (position) {
      if (!navigator.geolocation)
        return;

      var latitude = '' + position.coords.latitude;
      var longitude = '' + position.coords.longitude;

      updateHtmlCurrentPosition(latitude, longitude);
    });
  }

  function onTrackingPageClickEvent(event) {
    updateCurrentPosition();
    event.preventDefault();
  }

  function initialCheck() {
    $('#latitude').html('0');
    $('#longitude').html('0');
    $('#mainTrackingPage').on('vclick', onTrackingPageClickEvent);

    updateCurrentPosition();
  }
})();