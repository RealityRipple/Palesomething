// Firesomething extension for Mozilla Firefox
// Copyright (C) 2004-2007  Michael O'Rourke / Cosmic Cat Creations (http://www.cosmicat.com/)
// Palesomething update for Pale Moon
// Written 2018, 2019  Andrew Sachen / RealityRipple Software (https://realityripple.com/)
// For licensing terms, please refer to readme.txt in this extension's XPInstall 
// package or its installation directory on your computer.

var paleSomething =
{
 DefaultAbout: null,
 init: function()
 {
  if (document.getElementById('main-window') !== null)
  {
   paleSomething.DefaultName = document.getElementById('main-window').getAttribute('title_normal');
   paleSomething.PrivateName = document.getElementById('main-window').getAttribute('title_privatebrowsing');
  }
  else
  {
   paleSomething.DefaultName = 'Unknown';
   paleSomething.PrivateName = paleSomething.DefaultName;
  }
  let bSameName = paleSomething._getPref('extensions.palesomething.samename');
  if (bSameName)
  {
   let arrWin = paleSomething._getOtherWindows();
   if (arrWin.length > 0)
   {
    let oFS = null;
    for (let i = 0; i < arrWin.length; i++)
    {
     if (typeof arrWin[i].paleSomething !== 'undefined')
     {
      oFS = arrWin[i].paleSomething;
      break;
     }
    }
    if (oFS === null || !oFS.hasOwnProperty('Vendor') || !oFS.hasOwnProperty('ShortName') || !oFS.hasOwnProperty('TitleComment'))
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
  paleSomething_PrefManager.addPrefObserver('paleSomething.prefObserver');
 },
 init2: function()
 {
  if (document.getElementById('content') !== null)
  {
   document.getElementById('content').addEventListener('DOMTitleChanged', paleSomething.updateTitlebar, false);  // footnote 'DOMTitle'
   paleSomething.updateTitlebar();
  }
  if (document.getElementById('aboutName') !== null)
  {
   paleSomething.DefaultAbout = document.getElementById('aboutName').getAttribute('label');
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
  let bSameName = paleSomething._getPref('extensions.palesomething.samename');
  let bTopWin = (window === paleSomething._getWM().getMostRecentWindow(null));
  if (bSameName && !bTopWin)
   return;
  let vendor  = paleSomething._getRandomName('extensions.palesomething.lists.vendors');
  let spacer  = paleSomething._getRandomName('extensions.palesomething.lists.spacers');
  let prefix  = paleSomething._getRandomName('extensions.palesomething.lists.prefixes');
  let suffix  = paleSomething._getRandomName('extensions.palesomething.lists.names');
  let comment = paleSomething._getRandomName('extensions.palesomething.lists.comments');
  paleSomething.setNewBrowserName(vendor + spacer, prefix + suffix, comment);
  if (bSameName)
   paleSomething._updateOtherWindows();
 },
 setNewBrowserName: function(strVendor, strShortName, strTitleComment)
 {
  paleSomething.Vendor = strVendor;
  paleSomething.ShortName = strShortName;
  paleSomething.TitleComment = strTitleComment;
  let myRegExp = new RegExp(paleSomething.DefaultName, '');
  let myWnd    = document.getElementById('main-window');
  if (myWnd === null)
   return;
  if (myWnd.hasAttribute('titlemodifier_normal'))
   myWnd.setAttribute('titlemodifier_normal', paleSomething.DefaultName.replace(myRegExp, strVendor + strShortName + strTitleComment));
  if (myWnd.hasAttribute('titlemodifier_privatebrowsing'))
   myWnd.setAttribute('titlemodifier_privatebrowsing', paleSomething.PrivateName.replace(myRegExp, strVendor + strShortName + strTitleComment));
  if (myWnd.hasAttribute('titlemodifier'))
  {
   if ((myWnd.hasAttribute('privatebrowsingmode') && (myWnd.getAttribute('privatebrowsingmode') === 'temporary' || myWnd.getAttribute('privatebrowsingmode') === 'permanent')) || (myWnd.hasAttribute('browsingmode') && myWnd.getAttribute('browsingmode') === 'private'))
    myWnd.setAttribute('titlemodifier', paleSomething.PrivateName.replace(myRegExp, strVendor + strShortName + strTitleComment));
   else
    myWnd.setAttribute('titlemodifier', paleSomething.DefaultName.replace(myRegExp, strVendor + strShortName + strTitleComment));
  }
  paleSomething.updateTitlebar();
  setTimeout(paleSomething.setDelayedNames, 100);
 },
 setDelayedNames: function()
 {
  if (paleSomething.DefaultAbout === null)
   return;
  paleSomething.updateTitlebar();
  let myRegExp = new RegExp(paleSomething.DefaultName, '');
  let strAbout = paleSomething.DefaultAbout.replace(myRegExp, paleSomething.Vendor + paleSomething.ShortName);
  document.getElementById('aboutName').setAttribute('label', strAbout);
 },
 updateTitlebar: function()
 {
  try { document.getElementById('content').updateTitlebar(); } catch(ex) {}
 },
 _updateOtherWindows: function()
 {
  let arrWin = paleSomething._getOtherWindows();
  for (let i = 0; i < arrWin.length; i++)
  {
   if (typeof arrWin[i].paleSomething === 'undefined')
    continue;
   try { arrWin[i].paleSomething.setNewBrowserName(paleSomething.Vendor, paleSomething.ShortName, paleSomething.TitleComment); } catch(ex) { console.log(ex + '\n'); }
  }
 },
 _getOtherWindows: function()
 {
  let hWin, arrWin = [];
  let e = paleSomething._getWM().getEnumerator(null);
  while (e.hasMoreElements())
  {
   hWin = e.getNext();
   if (hWin === window)
    continue;
   if (hWin.document.getElementById('main-window'))
    arrWin[arrWin.length] = hWin;
  }
  return arrWin;
 },
 _getWM: function()
 {
  return Components.classes['@mozilla.org/appshell/window-mediator;1'].getService(Components.interfaces.nsIWindowMediator);
 },
 _getRandomName: function(strPref)
 {
  let arrNames = paleSomething._getPref(strPref).split('|');
  return arrNames[paleSomething._getRandom(0, arrNames.length - 1)];
 },
 _getRandom: function(min, max)
 {
  min = parseInt(min); max = parseInt(max);
  return Math.floor((max - min) * Math.random()) + min;
 }
};
paleSomething.init();
window.addEventListener('load', function() { paleSomething.init2(); }, false);
window.addEventListener('unload', function() { paleSomething.destruct(); }, false);

/* *** FOOTNOTES ***

DOMTitle: In some cases, tabbrowser::updateTitlebar() will update the title correctly but then it
 will revert to using the previous 'titlemodifier' upon loading a new page. Forcing an update
 with the 'DOMTitleChanged' event seems to rememdy this behavior with minimal overhead.
 
*/
