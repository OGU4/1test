// ==UserScript==
// @id             iitc-plugin-portal-candidate-viewer
// @name           IITC-ja plugin: Portal Candidate Viewer
// @author         nmmr
// @category       Layer
// @version        0.0.15
// @namespace      https://github.com/OGU4/1test
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
