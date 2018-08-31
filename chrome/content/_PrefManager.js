// Firesomething extension for Mozilla Firefox
// Copyright (C) 2004-2007  Michael O'Rourke / Cosmic Cat Creations (http://www.cosmicat.com/)
// Palesomething update for Pale Moon
// Written 2018  Andrew Sachen / RealityRipple Software (https://realityripple.com/)
// For licensing terms, please refer to readme.txt in this extension's XPInstall 
// package or its installation directory on your computer.

var paleSomething_PrefManager =
{
 _domain: "extensions.palesomething",
 _rootBranch: null,
 _prefTypes: [],
 _getService: function()
 {
  return Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
 },
 _getInterface: function()
 {
  return paleSomething_PrefManager._getService().QueryInterface(Components.interfaces.nsIPrefBranchInternal);
 },
 getRootBranch: function()
 {
  if (!paleSomething_PrefManager._rootBranch)
   paleSomething_PrefManager._rootBranch = paleSomething_PrefManager._getService().getBranch(null);
  return paleSomething_PrefManager._rootBranch;
 },
 getPrefType: function(strName)
 {
  if (strName in paleSomething_PrefManager._prefTypes)
   return paleSomething_PrefManager._prefTypes[strName];
  var strType = "Char";
  var iPB = Components.interfaces.nsIPrefBranch;
  switch (paleSomething_PrefManager.getRootBranch().getPrefType(strName))
  {
   case iPB.PREF_STRING:
    strType = "Char";
    break;
   case iPB.PREF_INT:
    strType = "Int";
    break;
   case iPB.PREF_BOOL:
    strType = "Bool";
    break;
  }
  paleSomething_PrefManager._prefTypes[strName] = strType;
  return strType;
 },
 getPref: function(strName)
 {
  var strType = paleSomething_PrefManager.getPrefType(strName);
  if (strType == 'Char')
   return paleSomething_PrefManager.getRootBranch().getComplexValue(strName, Components.interfaces.nsISupportsString).toString();
  else if (strType == 'Int')
   return paleSomething_PrefManager.getRootBranch().getIntPref(strName);
  else
   return paleSomething_PrefManager.getRootBranch().getBoolPref(strName);
 },
 setPref: function(strName, varValue)
 {
  var strType = paleSomething_PrefManager.getPrefType(strName);
  if (strType == 'Char')
   paleSomething_PrefManager.getRootBranch().setComplexValue(strName, Components.interfaces.nsISupportsString, varValue);
  else if (strType == 'Int')
   paleSomething_PrefManager.getRootBranch().setIntPref(strName, varValue);
  else
   paleSomething_PrefManager.getRootBranch().setBoolPref(strName, varValue);
 },
 addPrefObserver: function(strObserver, strDomain)
 {
  paleSomething_PrefManager.observer = strObserver;
  paleSomething_PrefManager.obsDomain = (strDomain == "root") ? "" : paleSomething_PrefManager._domain;
  paleSomething_PrefManager._getInterface().addObserver(paleSomething_PrefManager.obsDomain, this, false);
 },
 removePrefObserver: function()
 {
  paleSomething_PrefManager._getInterface().removeObserver(paleSomething_PrefManager.obsDomain, this);
 },
 observe: function(subject, topic, prefName) 
 {
  paleSomething_PrefManager.observer(subject, topic, prefName);
 }
};
