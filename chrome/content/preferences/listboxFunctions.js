// Firesomething extension for Mozilla Firefox
// Copyright (C) 2004-2007  Michael O'Rourke / Cosmic Cat Creations (http://www.cosmicat.com/)
// Palesomething update for Pale Moon
// Written 2018  Andrew Sachen / RealityRipple Software (https://realityripple.com/)
// For licensing terms, please refer to readme.txt in this extension's XPInstall 
// package or its installation directory on your computer.

var paleSomething_Listbox =
{
 caseInsensitiveSort: function(a, b)
 {
  a = a.toUpperCase();
  b = b.toUpperCase();
  switch (true)
  {
   case (a > b): return 1;
   case (a < b): return -1;
   default: return 0;
  }
 },
 addListitem: function(strListID, strTextboxID)
 {
  let hTextbox = document.getElementById(strTextboxID);
  let hListbox = document.getElementById(strListID);
  if (hTextbox.value != '')
  {
   hListbox.clearSelection();
   let index = paleSomething_Listbox._findAlphaInsertionPoint(hListbox, hTextbox.value);
   let oItem;
   if (index >= 0)
    oItem = hListbox.insertItemAt(index, hTextbox.value, hTextbox.value);
   else
    oItem = hListbox.appendItem(hTextbox.value, hTextbox.value);
   paleSomething_Listbox._centerListitem(hListbox, oItem);
   hListbox.selectItem(oItem);
   hListbox.doCommand();
  }
  hTextbox.value = '';
  hTextbox.focus();
 },
 _centerListitem: function(hListbox, oItem)
 {
  let oTemp = oItem;
  for (let i = 0; i < 3; i++)
  {
   if (hListbox.getPreviousItem(oTemp, 1))
    oTemp = hListbox.getPreviousItem(oTemp, 1);
  }
  hListbox.ensureElementIsVisible(oTemp);
  oTemp = oItem;
  for (let i = 0; i < 3; i++)
  {
   if (hListbox.getNextItem(oTemp, 1))
    oTemp = hListbox.getNextItem(oTemp, 1);
  }
  hListbox.ensureElementIsVisible(oTemp);
 },
 _findAlphaInsertionPoint: function(hListbox, strValue)
 {
  if (!hListbox.lastChild)
   return -1;
  strValue = strValue.toUpperCase();
  let oTemp, i = 0, dir = 1;
  let nLast = hListbox.getIndexOfItem(hListbox.lastChild);
  if (nLast > 6)
  {
   let interval = (nLast / 2);
   while (interval > 4)
   {
    i += (interval * dir);
    dir = (strValue > hListbox.getItemAtIndex(Math.round(i)).getAttribute('value').toUpperCase()) ? 1 : -1;
    interval /= 2;
   }
   i = Math.round(i);
  }
  oTemp = hListbox.getItemAtIndex(i);
  if (dir == 1)
  {
   while (oTemp)
   {
    if (strValue <= oTemp.getAttribute('value').toUpperCase())
     return i;
    else
     i++;
    oTemp = hListbox.getNextItem(oTemp, 1);
   }
   return -1;
  }
  else 
  {
   while (oTemp)
   {
    if (strValue > oTemp.getAttribute('value').toUpperCase()) 
     return (i + 1);
    else
     i--;
    oTemp = hListbox.getPreviousItem(oTemp, 1);
   }
   return 0;
  }
 },
 deleteListitems: function(event)
 {
  let hListbox = paleSomething_Listbox._getListbox(event);
  if (!hListbox)
   return;
  while (hListbox.selectedCount)
  {
   hListbox.removeItemAt(hListbox.getIndexOfItem(hListbox.getSelectedItem(0)));
  }
  hListbox.doCommand();
 },
 selectAllListitems: function(event)
 {
  let hListbox = paleSomething_Listbox._getListbox(event);
  if (!hListbox)
   return;
  hListbox.selectAll();
 },
 _getListbox: function(event)
 {
  let hListbox;
  switch (event.target.nodeName)
  {
   case 'listbox':
    hListbox = event.target;
    break;
   case 'menuitem':
    hListbox = (document.popupNode.nodeName == 'listitem') ? document.popupNode.parentNode : document.popupNode;
    break;
   default: 
    return null;
  }
  return hListbox;
 },
 joinList: function(strID)
 {
  let cList = document.getElementById(strID).getElementsByTagName('listitem');
  let arrOut = [];
  for (let i = 0; i < cList.length; i++)
  {
   try
   {
    arrOut[i] = cList[i].value;
   } catch(ex) {}
  }
  return arrOut.join('|');
 }
};
