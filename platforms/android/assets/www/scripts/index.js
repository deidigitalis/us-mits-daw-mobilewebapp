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
    $('#latitude').html('' + round(latitude, 4));
    $('#longitude').html('' + round(longitude, 4));

    var date = new Date();
    $('#lastUpdate').html('' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds());
  }

  function round(number, decimals) {
    var power = Math.pow(10, decimals);
    return Math.round(number * power) / power;
  }

  function deserializeCoords(coords) {
    var result = [];

    if (coords) {
      var values = coords.split(",");
      for (var index = 0; index < values.length; index += 3) {
        var la = 0 + values[index];
        var lo = 0 + values[index + 1];
        var date = values[index + 2];
        if (date) {
          result.push({ latitude: la, longitude: lo, date: date });
        }
      }
    }

    return result;
  }

  function getAllCoord() {
    if (!window.localStorage)
      return [];

    var coords = window.localStorage.getItem("coords");

    if (!coords)
      return [];

    var coordList;

    try {
      coordList = JSON.parse(coords);
    } catch (err) {
      coordList = [];
    }

    return coordList;
  }

  function addCoordsToHistory(latitude, longitude) {
    var coordList = getAllCoord();

    coordList.push({ latitude: latitude, longitude: longitude, date: new Date() });
    var coords = JSON.stringify(coordList);

    window.localStorage.setItem("coords", coords);
  }

  function updateCurrentPosition() {
    navigator.geolocation.getCurrentPosition(function (position) {
      if (!navigator.geolocation)
        return;

      var latitude = '' + position.coords.latitude;
      var longitude = '' + position.coords.longitude;

      addCoordsToHistory(position.coords.latitude, position.coords.longitude);
      updateHtmlCurrentPosition(latitude, longitude);
      updateHistory();
    });
  }

  function updateHtmlHistory(coordList) {
    var historyTable = $('#historyTable');

    historyTable.empty();
    coordList.forEach(function (coord) {
      var tr = $('<tr/>');

      var date = new Date(coord.date);
      var td0 = $('<td/>').html('' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds());
      
      var td1 = $('<td/>').html('' + round(coord.latitude, 4));
      var td2 = $('<td/>').html('' + round(coord.longitude, 4));

      tr.append(td0);
      tr.append(td1);
      tr.append(td2);

      historyTable.append(tr);
    });
  }

  function updateHistory() {
    var coordList = getAllCoord();
    updateHtmlHistory(coordList);
  }

  function onTrackingPageClickEvent(event) {
    updateCurrentPosition();
    event.preventDefault();
  }

  function onClickClearHistoryButton() {
    if (!window.localStorage)
      return;

    window.localStorage.removeItem('coords');
    updateHistory();
  }

  function initialCheck() {
    $('#latitude').html('0');
    $('#longitude').html('0');
    $('#mainTrackingPage').on('vclick', onTrackingPageClickEvent);
    $('#clearHistoryButton').click(onClickClearHistoryButton);

    updateCurrentPosition();
  }
})();