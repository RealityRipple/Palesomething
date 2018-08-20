// Firesomething extension for Mozilla Firefox
// Copyright (C) 2004-2007  Michael O'Rourke / Cosmic Cat Creations (http://www.cosmicat.com/)
// Palesomething update for Pale Moon
// Written 2018  Andrew Sachen / RealityRipple Software (https://realityripple.com/)
// For licensing terms, please refer to readme.txt in this extension's XPInstall 
// package or its installation directory on your computer.

var paleSomething_PrefManager =
{
 domain: "extensions.palesomething",
 getService: function()
 {
  try
  {
   return Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
  } catch(ex) { dump(ex + "\n"); return null; }
 },
 getInterface: function()
 {
  try
  {
   return paleSomething_PrefManager.getService().QueryInterface(Components.interfaces.nsIPrefBranchInternal);
  } catch(ex) { dump(ex + "\n"); return null; }
 },
 rootBranch: null,
 getRootBranch: function()
 {
  if (!paleSomething_PrefManager.rootBranch)
   paleSomething_PrefManager.rootBranch = paleSomething_PrefManager.getService().getBranch(null);
  return paleSomething_PrefManager.rootBranch;
 },
 prefTypes: new Array(),
 getPrefType: function(strName)
 {
  if (strName in paleSomething_PrefManager.prefTypes)
   return paleSomething_PrefManager.prefTypes[strName];
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
  paleSomething_PrefManager.prefTypes[strName] = strType;
  return strType;
 },
 getPref: function(strName)
 {
  var strType = paleSomething_PrefManager.getPrefType(strName);
  var strCode = 'paleSomething_PrefManager.getRootBranch().get' + strType + 'Pref("' + strName + '")';
  if (strType == "Char")
   strCode = 'paleSomething_PrefManager.getRootBranch().getComplexValue("' + strName + '", Components.interfaces.nsISupportsString).toString()';
  try { return eval(strCode); } catch(ex) { dump(ex + "\n"); }
  return null;
 },
 setPref: function(strName, varValue)
 {
  var strType = paleSomething_PrefManager.getPrefType(strName);
  var strCode = 'paleSomething_PrefManager.getRootBranch().set' + strType + 'Pref("' + strName + '", ' + varValue + ')';
  if (strType == "Char")
   strCode = 'paleSomething_PrefManager.getRootBranch().setComplexValue("' + strName + '", Components.interfaces.nsISupportsString, "' + varValue + '").toString()';
  try { eval(strCode); } catch(ex) { dump(ex + "\n"); }
 },
 addPrefObserver: function(strObserver, strDomain)
 {
  paleSomething_PrefManager.observer = strObserver;
  paleSomething_PrefManager.obsDomain = (strDomain == "root") ? "" : paleSomething_PrefManager.domain;
  try { paleSomething_PrefManager.getInterface().addObserver(paleSomething_PrefManager.obsDomain, this, false); } catch(ex) { dump(ex + "\n"); }
 },
 removePrefObserver: function()
 {
  try { paleSomething_PrefManager.getInterface().removeObserver(paleSomething_PrefManager.obsDomain, this); } catch(ex) { dump(ex + "\n"); }
 },
 observe: function(subject, topic, prefName) 
 {
  try { eval(paleSomething_PrefManager.observer + "(subject, topic, prefName);"); } catch(ex) { dump(ex + "\n"); }
 }
};
