// Firesomething extension for Mozilla Firefox
// Copyright (C) 2004-2007  Michael O'Rourke / Cosmic Cat Creations (http://www.cosmicat.com/)
// Palesomething update for Pale Moon
// Written 2018  Andrew Sachen / RealityRipple Software (https://realityripple.com/)
// For licensing terms, please refer to readme.txt in this extension's XPInstall 
// package or its installation directory on your computer.

var paleSomething =
{
 init: function()
 {
  this.Prefs = new PaleSomething_PrefManager();
  if (document.getElementById("main-window") != null)
  {
   this.DefaultName = document.getElementById("main-window").getAttribute("title_normal");
   this.PrivateName = document.getElementById("main-window").getAttribute("title_privatebrowsing");
  }
  else
  {
   this.DefaultName = "Unknown";
   this.PrivateName = this.DefaultName;
  }
  var bSameName = this.getPref("extensions.palesomething.samename");
  if (bSameName)
  {
   var arrWin = this.getOtherWindows();
   if (arrWin.length > 0)
   {
    var oFS = arrWin[0].paleSomething;
    this.setNewBrowserName(oFS.Vendor, oFS.ShortName, oFS.TitleComment);
   }
   else
   {
    this.setNames();
   }
  }
  else
  {
   this.setNames();
  }
  this.Prefs.addPrefObserver("paleSomething.prefObserver");
 },
 init2: function()
 {
  if (document.getElementById("content") != null)
  {
   document.getElementById("content").addEventListener("DOMTitleChanged", paleSomething.updateTitlebar, false);  // footnote "DOMTitle"
   this.updateTitlebar();
  }
  if (document.getElementById("aboutName") != null)
  {
   this.DefaultAbout = document.getElementById("aboutName").getAttribute("label");
   setTimeout("paleSomething.setDelayedNames();", 100);
  }
 },
 destruct: function()
 {
  try { this.Prefs.removePrefObserver(); } catch(ex) {}
 },
 getPref: function(strName)
 {
  return this.Prefs.getPref(strName);
 },
 prefObserver: function(subject, topic, prefName)
 {
  this.setNames();
 },
 setNames: function()
 {
  var bSameName = this.getPref("extensions.palesomething.samename");
  var bTopWin = (window == this.getWM().getMostRecentWindow(null));
  if (bSameName && !bTopWin)
   return;
  var vendor  = this.getRandomName("extensions.palesomething.lists.vendors");
  var spacer  = this.getRandomName("extensions.palesomething.lists.spacers");
  var prefix  = this.getRandomName("extensions.palesomething.lists.prefixes");
  var suffix  = this.getRandomName("extensions.palesomething.lists.names");
  var comment = this.getRandomName("extensions.palesomething.lists.comments");
  this.setNewBrowserName(vendor + spacer, prefix + suffix, comment);
  if (bSameName)
   this.updateOtherWindows();
 },
 setNewBrowserName: function(strVendor, strShortName, strTitleComment)
 {
  this.Vendor = strVendor;
  this.ShortName = strShortName;
  this.TitleComment = strTitleComment;
  var myRegExp = new RegExp(this.DefaultName, "");
  var myWnd    = document.getElementById("main-window");
  if (myWnd == null)
   return;
  if (myWnd.hasAttribute("titlemodifier_normal"))
   myWnd.setAttribute("titlemodifier_normal", this.DefaultName.replace(myRegExp, strVendor + strShortName + strTitleComment));
  if (myWnd.hasAttribute("titlemodifier_privatebrowsing"))
   myWnd.setAttribute("titlemodifier_privatebrowsing", this.PrivateName.replace(myRegExp, strVendor + strShortName + strTitleComment));
  if (myWnd.hasAttribute("titlemodifier"))
  {
   if ((myWnd.hasAttribute("privatebrowsingmode") && (myWnd.getAttribute("privatebrowsingmode") == "temporary" || myWnd.getAttribute("privatebrowsingmode") == "permanent")) || (myWnd.hasAttribute("browsingmode") && myWnd.getAttribute("browsingmode") == "private"))
   {
    myWnd.setAttribute("titlemodifier", this.PrivateName.replace(myRegExp, strVendor + strShortName + strTitleComment));
   }
   else
   {
    myWnd.setAttribute("titlemodifier", this.DefaultName.replace(myRegExp, strVendor + strShortName + strTitleComment));
   }
  }
  this.updateTitlebar();
  setTimeout("paleSomething.setDelayedNames();", 100);
 },
 setDelayedNames: function()
 {
  try
  {
   this.updateTitlebar();
   var myRegExp = new RegExp(this.DefaultName, "");
   var strAbout = this.DefaultAbout.replace(myRegExp, this.Vendor + this.ShortName);
   document.getElementById("aboutName").setAttribute("label", strAbout);
  } catch(ex) { dump(ex + "\n"); }
 },
 updateTitlebar: function()
 {
  try { document.getElementById("content").updateTitlebar(); } catch(ex) {}
 },
 updateOtherWindows: function()
 {
  var arrWin = this.getOtherWindows();
  for (var i=0; i < arrWin.length; i++) {
   try { arrWin[i].paleSomething.setNewBrowserName(this.Vendor, this.ShortName, this.TitleComment); } catch(ex) { dump(ex + "\n"); }
  }
 },
 getOtherWindows: function()
 {
  var hWin, arrWin = new Array();
  var e = this.getWM().getEnumerator(null);
  while (e.hasMoreElements())
  {
   hWin = e.getNext();
   if (hWin == window)
    continue;
   if (hWin.document.getElementById("main-window"))
    arrWin[arrWin.length] = hWin;
  }
  return arrWin;
 },
 getWM: function()
 {
  return Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator);
 },
 getRandomName: function(strPref)
 {
  var arrNames = this.getPref(strPref).split("|");
  return arrNames[this.getRandom(0, arrNames.length - 1)];
 },
 getRandom: function(min, max)
 {
  min = parseInt(min); max = parseInt(max);
  return Math.floor((max - min) * Math.random()) + min;
 }
}
paleSomething.init();
window.addEventListener("load", function() { paleSomething.init2(); }, false);
window.addEventListener("unload", function() { paleSomething.destruct(); }, false);

/* *** FOOTNOTES ***

DOMTitle: In some cases, tabbrowser::updateTitlebar() will update the title correctly but then it
 will revert to using the previous 'titlemodifier' upon loading a new page. Forcing an update
 with the "DOMTitleChanged" event seems to rememdy this behavior with minimal overhead.
 
*/
