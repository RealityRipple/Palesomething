var AboutFireSomethingService = {
 impl: {
  ioService: null,
  newChannel: function(aURI, aLoadInfo) {
   if (!AboutFireSomethingService.ioService)
    AboutFireSomethingService.ioService = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
   var vc = Components.classes["@mozilla.org/xpcom/version-comparator;1"].getService(Components.interfaces.nsIVersionComparator);
   var ai = Components.classes["@mozilla.org/xre/app-info;1"].getService(Components.interfaces.nsIXULAppInfo);
   var chan;
   if (vc.compare(ai.version, "27.*") > 0)
   {
    var uri = AboutFireSomethingService.ioService.newURI("chrome://palesomething/content/book_of_mozilla/firesomething.xhtml", null, null);
    chan = AboutFireSomethingService.ioService.newChannelFromURIWithLoadInfo(uri, aLoadInfo);
    chan.originalURI = aURI;
   }
   else
   {
    chan = AboutFireSomethingService.ioService.newChannel("chrome://palesomething/content/book_of_mozilla/firesomething.xhtml", null, aURI);
   }
   return chan;
  },
  QueryInterface: function(iid) {
   if (!iid.equals(Components.interfaces.nsISupports) &&
    !iid.equals(Components.interfaces.nsIAboutModule))
    throw Components.results.NS_ERROR_NO_INTERFACE;
   return this;
  },
  getURIFlags: function(aURI) {
   return Components.interfaces.nsIAboutModule.ALLOW_SCRIPT;
  }
 },
 factory: {
  createInstance: function(outer, iid) {
   if (outer != null)
    throw Components.results.NS_ERROR_NO_AGGREGATION;
   
   if (!iid.equals(Components.interfaces.nsIAboutModule) &&
    !iid.equals(Components.interfaces.nsISupports))
    throw Components.results.NS_ERROR_INVALID_ARG;
   
   return AboutFireSomethingService.impl.QueryInterface(iid);
  }
 },
 register: function() {
  var compman = Components.manager;
  compman.QueryInterface(Components.interfaces.nsIComponentRegistrar);
  var cid = Components.ID('{1dd0cb48-aea3-4a52-8b29-01429a542863}');
  var contractid = "@mozilla.org/network/protocol/about;1?what=firesomething";
  
  if (!compman.isCIDRegistered(cid)) {
   compman.registerFactory(cid, "AboutFireSomethingService", contractid, AboutFireSomethingService.factory);
  }
 }
}

// register
try { AboutFireSomethingService.register(); } catch(ex) { dump(ex+"\n"); }

var AboutPaleSomethingService = {
 impl: {
  ioService: null,
  newChannel: function(aURI, aLoadInfo) {
   if (!AboutPaleSomethingService.ioService)
    AboutPaleSomethingService.ioService = Components.classes["@mozilla.org/network/io-service;1"]
        .getService(Components.interfaces.nsIIOService);
   var vc = Components.classes["@mozilla.org/xpcom/version-comparator;1"].getService(Components.interfaces.nsIVersionComparator);
   var ai = Components.classes["@mozilla.org/xre/app-info;1"].getService(Components.interfaces.nsIXULAppInfo);
   var chan;
   if (vc.compare(ai.version, "27.*") > 0)
   {
    var uri = AboutPaleSomethingService.ioService.newURI("chrome://palesomething/content/book_of_mozilla/palesomething.xhtml", null, null);
    chan = AboutPaleSomethingService.ioService.newChannelFromURIWithLoadInfo(uri, aLoadInfo);
    chan.originalURI = aURI;
   }
   else
    chan = AboutPaleSomethingService.ioService.newChannel("chrome://palesomething/content/book_of_mozilla/palesomething.xhtml", null, uri);
   return chan;
  },
  QueryInterface: function(iid) {
   if (!iid.equals(Components.interfaces.nsISupports) &&
    !iid.equals(Components.interfaces.nsIAboutModule))
    throw Components.results.NS_ERROR_NO_INTERFACE;
   return this;
  },
  getURIFlags: function(aURI) {
   return Components.interfaces.nsIAboutModule.ALLOW_SCRIPT;
  }
 },
 factory: {
  createInstance: function(outer, iid) {
   if (outer != null)
    throw Components.results.NS_ERROR_NO_AGGREGATION;
   
   if (!iid.equals(Components.interfaces.nsIAboutModule) &&
    !iid.equals(Components.interfaces.nsISupports))
    throw Components.results.NS_ERROR_INVALID_ARG;
   
   return AboutPaleSomethingService.impl.QueryInterface(iid);
  }
 },
 register: function() {
  var compman = Components.manager;
  compman.QueryInterface(Components.interfaces.nsIComponentRegistrar);
  var cid = Components.ID('{A6CE8B1E-3DD1-580B-B098-2E0040934D74}');
  var contractid = "@mozilla.org/network/protocol/about;1?what=palesomething";
  
  if (!compman.isCIDRegistered(cid)) {
   compman.registerFactory(cid, "AboutPaleSomethingService", contractid, AboutPaleSomethingService.factory);
  }
 }
}

// register
try { AboutPaleSomethingService.register(); } catch(ex) { dump(ex+"\n"); }
