// Firesomething extension for Mozilla Firefox
// Copyright (C) 2004-2007  Michael O'Rourke / Cosmic Cat Creations (http://www.cosmicat.com/)
// Palesomething update for Pale Moon
// Written 2018  Andrew Sachen / RealityRipple Software (https://realityripple.com/)
// For licensing terms, please refer to readme.txt in this extension's XPInstall 
// package or its installation directory on your computer.

var paleSomething =
{
 DefaultAbout: null,
 init: function()
 {
  if (document.getElementById("main-window") != null)
  {
   paleSomething.DefaultName = document.getElementById("main-window").getAttribute("title_normal");
   paleSomething.PrivateName = document.getElementById("main-window").getAttribute("title_privatebrowsing");
  }
  else
  {
   paleSomething.DefaultName = "Unknown";
   paleSomething.PrivateName = paleSomething.DefaultName;
  }
  var bSameName = paleSomething._getPref("extensions.palesomething.samename");
  if (bSameName)
  {
   var arrWin = paleSomething._getOtherWindows();
   if (arrWin.length > 0)
   {
    var oFS = null;
    for (var i=0; i < arrWin.length; i++)
    {
     if (arrWin[i].paleSomething !== undefined)
     {
      oFS = arrWin[i].paleSomething;
      break;
     }
    }
    if (oFS === null)
     paleSomething.setNames();
    else
     paleSomething.setNewBrowserName(oFS.Vendor, oFS.ShortName, oFS.TitleComment);
   }
   else
   {
    paleSomething.setNames();
   }
  }
  else
  {
   paleSomething.setNames();
  }
  paleSomething_PrefManager.addPrefObserver("paleSomething.prefObserver");
 },
 init2: function()
 {
  if (document.getElementById("content") != null)
  {
   document.getElementById("content").addEventListener("DOMTitleChanged", paleSomething.updateTitlebar, false);  // footnote "DOMTitle"
   paleSomething.updateTitlebar();
  }
  if (document.getElementById("aboutName") != null)
  {
   paleSomething.DefaultAbout = document.getElementById("aboutName").getAttribute("label");
   setTimeout(paleSomething.setDelayedNames, 100);
  }
 },
 destruct: function()
 {
  try
  {
   paleSomething_PrefManager.removePrefObserver();
  }
  catch(ex)
  {
  }
 },
 _getPref: function(strName)
 {
  return paleSomething_PrefManager.getPref(strName);
 },
 prefObserver: function(subject, topic, prefName)
 {
  paleSomething.setNames();
 },
 setNames: function()
 {
  var bSameName = paleSomething._getPref("extensions.palesomething.samename");
  var bTopWin = (window == paleSomething._getWM().getMostRecentWindow(null));
  if (bSameName && !bTopWin)
   return;
  var vendor  = paleSomething._getRandomName("extensions.palesomething.lists.vendors");
  var spacer  = paleSomething._getRandomName("extensions.palesomething.lists.spacers");
  var prefix  = paleSomething._getRandomName("extensions.palesomething.lists.prefixes");
  var suffix  = paleSomething._getRandomName("extensions.palesomething.lists.names");
  var comment = paleSomething._getRandomName("extensions.palesomething.lists.comments");
  paleSomething.setNewBrowserName(vendor + spacer, prefix + suffix, comment);
  if (bSameName)
   paleSomething._updateOtherWindows();
 },
 setNewBrowserName: function(strVendor, strShortName, strTitleComment)
 {
  paleSomething.Vendor = strVendor;
  paleSomething.ShortName = strShortName;
  paleSomething.TitleComment = strTitleComment;
  var myRegExp = new RegExp(paleSomething.DefaultName, "");
  var myWnd    = document.getElementById("main-window");
  if (myWnd == null)
   return;
  if (myWnd.hasAttribute("titlemodifier_normal"))
   myWnd.setAttribute("titlemodifier_normal", paleSomething.DefaultName.replace(myRegExp, strVendor + strShortName + strTitleComment));
  if (myWnd.hasAttribute("titlemodifier_privatebrowsing"))
   myWnd.setAttribute("titlemodifier_privatebrowsing", paleSomething.PrivateName.replace(myRegExp, strVendor + strShortName + strTitleComment));
  if (myWnd.hasAttribute("titlemodifier"))
  {
   if ((myWnd.hasAttribute("privatebrowsingmode") && (myWnd.getAttribute("privatebrowsingmode") == "temporary" || myWnd.getAttribute("privatebrowsingmode") == "permanent")) || (myWnd.hasAttribute("browsingmode") && myWnd.getAttribute("browsingmode") == "private"))
   {
    myWnd.setAttribute("titlemodifier", paleSomething.PrivateName.replace(myRegExp, strVendor + strShortName + strTitleComment));
   }
   else
   {
    myWnd.setAttribute("titlemodifier", paleSomething.DefaultName.replace(myRegExp, strVendor + strShortName + strTitleComment));
   }
  }
  paleSomething.updateTitlebar();
  setTimeout(paleSomething.setDelayedNames, 100);
 },
 setDelayedNames: function()
 {
  if (paleSomething.DefaultAbout === null)
   return;
  paleSomething.updateTitlebar();
  var myRegExp = new RegExp(paleSomething.DefaultName, "");
  var strAbout = paleSomething.DefaultAbout.replace(myRegExp, paleSomething.Vendor + paleSomething.ShortName);
  document.getElementById("aboutName").setAttribute("label", strAbout);
 },
 updateTitlebar: function()
 {
  try { document.getElementById("content").updateTitlebar(); } catch(ex) {}
 },
 _updateOtherWindows: function()
 {
  var arrWin = paleSomething._getOtherWindows();
  for (var i=0; i < arrWin.length; i++) {
   if (arrWin[i].paleSomething === undefined)
    continue;
   try { arrWin[i].paleSomething.setNewBrowserName(paleSomething.Vendor, paleSomething.ShortName, paleSomething.TitleComment); } catch(ex) { console.log(ex + "\n"); }
  }
 },
 _getOtherWindows: function()
 {
  var hWin, arrWin = [];
  var e = paleSomething._getWM().getEnumerator(null);
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
 _getWM: function()
 {
  return Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator);
 },
 _getRandomName: function(strPref)
 {
  var arrNames = paleSomething._getPref(strPref).split("|");
  return arrNames[paleSomething._getRandom(0, arrNames.length - 1)];
 },
 _getRandom: function(min, max)
 {
  min = parseInt(min); max = parseInt(max);
  return Math.floor((max - min) * Math.random()) + min;
 }
};
paleSomething.init();
window.addEventListener("load", function() { paleSomething.init2(); }, false);
window.addEventListener("unload", function() { paleSomething.destruct(); }, false);

/* *** FOOTNOTES ***

DOMTitle: In some cases, tabbrowser::updateTitlebar() will update the title correctly but then it
 will revert to using the previous 'titlemodifier' upon loading a new page. Forcing an update
 with the "DOMTitleChanged" event seems to rememdy this behavior with minimal overhead.
 
*/
