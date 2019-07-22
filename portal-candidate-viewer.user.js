// ==UserScript==
// @id             iitc-plugin-portal-candidate-viewer
// @name           IITC-ja plugin: Portal Candidate Viewer
// @author         nmmr
// @category       Layer
// @version        0.0.8
// @namespace      https://sites.google.com/site/stocksite123456/
// @updateURL      https://raw.githubusercontent.com/OGU4/1test/master/portal-candidate-viewer.user.js
// @downloadURL    https://raw.githubusercontent.com/OGU4/1test/master/portal-candidate-viewer.user.js
// @description    Show portal candidate on the map.
// @include        https://intel.ingress.com/intel*
// @include        http://intel.ingress.com/intel*
// @match          https://intel.ingress.com/intel*
// @match          http://intel.ingress.com/intel*
// @include        https://intel.ingress.com/mission/*
// @include        http://intel.ingress.com/mission/*
// @match          https://intel.ingress.com/mission/*
// @match          http://intel.ingress.com/mission/*
// @require        
// @grant          GM_xmlhttpRequest
// ==/UserScript==

function wrapper(plugin_info) {
// ensure plugin framework is there, even if iitc is not yet loaded
if(typeof window.plugin !== 'function') window.plugin = function() {};

//PLUGIN AUTHORS: writing a plugin outside of the IITC build environment? if so, delete these lines!!
//(leaving them in place might break the 'About IITC' page or break update checks)
plugin_info.buildName = 'portal-candidate-viewer';
plugin_info.dateTimeVersion = '20190722';
plugin_info.pluginId = 'portal-candidate-viewer';
//END PLUGIN AUTHORS NOTE



// PLUGIN START ////////////////////////////////////////////////////////
// use own namespace for plugin
window.plugin.portalCandidate = function() {};
window.plugin.portalCandidate.candidate = plugin_info.script.candidate;
window.plugin.portalCandidate.portalLayer = null;
window.plugin.portalCandidate.setupCSS = function() {
  $("<style>").prop("type", "text/css").html('' +
   '.portal-candidate-icon{' +
     'color:#FFFFBB;' +
     'font-size:11px;line-height:12px;' +
     'text-align:center;padding: 2px;' + // padding needed so shadow doesn't clip
     'overflow:hidden;' +
// could try this if one-line names are used
//    +'white-space: nowrap;text-overflow:ellipsis;'
     'text-shadow:1px 1px #000,1px -1px #000,-1px 1px #000,-1px -1px #000, 0 0 5px #000;' +
     'pointer-events:none;' +
   '}'
  ).appendTo("head");
};
window.plugin.portalCandidate.updatePortalLocations = function() {
  window.plugin.portalCandidate.portalLayer.clearLayers();

  var bounds = map.getBounds();
  var candidateOptions = {color: 'red', weight: 7, opacity: 0.5, clickable: false , fill:true};
  for (let key in window.plugin.portalCandidate.candidate) {
    var latlng = new L.LatLng(key.split(',')[1], key.split(',')[0]);
    if (bounds.contains(latlng)) {
      var c = L.circle (latlng, 5, candidateOptions);
      window.plugin.portalCandidate.portalLayer.addLayer(c);
      if (map.getZoom() > 15) {
        var label = L.marker(latlng, {
          icon: L.divIcon({
            clickable: true,
            className: 'portal-candidate-icon',
            iconSize: [50,50],
            html: window.plugin.portalCandidate.candidate[key]
          })
        });
        label.addTo(window.plugin.portalCandidate.portalLayer);
      }
    }
  }
};

var setup = function() {
  window.plugin.portalCandidate.setupCSS();

  window.plugin.portalCandidate.portalLayer = L.layerGroup();

  addLayerGroup('PortalCandidate', window.plugin.portalCandidate.portalLayer, true);

  window.addHook('mapDataRefreshEnd', function() { window.plugin.portalCandidate.updatePortalLocations(); });
};

function addCandidate(c) {
  alert(c);
};
// PLUGIN END //////////////////////////////////////////////////////////


setup.info = plugin_info; //add the script info data to the function as a property
if(!window.bootPlugins) window.bootPlugins = [];
window.bootPlugins.push(setup);
// if IITC has already booted, immediately run the 'setup' function
if(window.iitcLoaded && typeof setup === 'function') setup();
} // wrapper end

// 申請候補地の取得
GM_xmlhttpRequest({
    method:     'GET',
    url:        'https://www.google.com/maps/d/u/0/kml?forcekml=1&mid=1THKbg1aUGMW4jiuVRE9MKLlx1sMAXmUj&ll',
    headers: {
        "User-Agent": "Mozilla/5.0",    // If not specified, navigator.userAgent will be used.
        "Accept": "text/xml"            // If not specified, browser defaults will be used.
    },
    onload:     function (responseDetails) {
        var candidate = {}
        var dom = new DOMParser().parseFromString(responseDetails.responseText, 'text/xml');
        var place = dom.getElementsByTagName('Placemark');
        for (let key in place) {
            if (typeof place[key].getElementsByTagName == "function") {
              candidate[place[key].getElementsByTagName('coordinates')[0].innerHTML] = place[key].getElementsByTagName('name')[0].innerHTML;
            }
        }
// inject code into site context
var script = document.createElement('script');
var info = {};
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) info.script = { version: GM_info.script.version, name: GM_info.script.name, description: GM_info.script.description ,candidate:candidate};
script.appendChild(document.createTextNode('('+ wrapper +')('+JSON.stringify(info)+');'));
(document.body || document.head || document.documentElement).appendChild(script);
    }
} );
