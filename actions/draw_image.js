module.exports = {
  //---------------------------------------------------------------------
  // Action Name
  //---------------------------------------------------------------------

  name: 'Draw Image on Image',

  //---------------------------------------------------------------------
  // Action Section
  //---------------------------------------------------------------------

  section: 'Image Editing',

  //---------------------------------------------------------------------
  // Action Subtitle
  //---------------------------------------------------------------------

  subtitle(data, presets) {
    const storeTypes = presets.variables;
    return `${storeTypes[parseInt(data.storage2, 10)]} (${data.varName2}) -> ${
      storeTypes[parseInt(data.storage, 10)]
    } (${data.varName})`;
  },

  //---------------------------------------------------------------------
  // Action Meta Data
  //---------------------------------------------------------------------

  meta: {
    version: '2.2.0',
    preciseCheck: true,
    author: null,
    authorUrl: null,
    downloadUrl: 'https://github.com/DBM-POLSKA/DBM-14/blob/main/bot-files/actions/draw_image.js',
  },

  //---------------------------------------------------------------------
  // Action Fields
  //---------------------------------------------------------------------

  fields: ['storage', 'varName', 'storage2', 'varName2', 'x', 'y', 'mask'],

  //---------------------------------------------------------------------
  // Command HTML
  //---------------------------------------------------------------------

  html(isEvent, data) {
    return `
<retrieve-from-variable dropdownLabel="Source Image" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></retrieve-from-variable>

<br><br><br>

<retrieve-from-variable style="padding-top: 8px;" dropdownLabel="Image that is Drawn" selectId="storage2" variableContainerId="varNameContainer2" variableInputId="varName2"></retrieve-from-variable>

<br><br><br>

<div style="padding-top: 8px;">
	<div style="float: left; width: calc(50% - 12px);">
		<span class="dbminputlabel">X Position</span><br>
		<input id="x" class="round" type="text" value="0"><br>
	</div>
	<div style="float: right; width: calc(50% - 12px);">
		<span class="dbminputlabel">Y Position</span><br>
		<input id="y" class="round" type="text" value="0"><br>
	</div>
</div>

<br><br><br>

<div style="padding-top: 8px; width: calc(50% - 12px)">
	<span class="dbminputlabel">Draw Effect</span><br>
	<select id="mask" class="round">
		<option value="0" selected>Overlay</option>
		<option value="1">Replace</option>
		<option value="2">Mask</option>
	</select>
</div>`;
  },

  //---------------------------------------------------------------------
  // Action Editor Init Code
  //---------------------------------------------------------------------

  init() {},

  //---------------------------------------------------------------------
  // Action Bot Function
  //---------------------------------------------------------------------

  action(cache) {
    const data = cache.actions[cache.index];
    const storage = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);
    const image = this.getVariable(storage, varName, cache);
    if (!image || !image.composite) {
      this.callNextAction(cache);
      return;
    }
    const storage2 = parseInt(data.storage2, 10);
    const varName2 = this.evalMessage(data.varName2, cache);
    const image2 = this.getVariable(storage2, varName2, cache);
    if (!image2) {
      this.callNextAction(cache);
      return;
    }
    const x = parseInt(this.evalMessage(data.x, cache), 10);
    const y = parseInt(this.evalMessage(data.y, cache), 10);
    const mask = data.mask;
    if (mask === '2') {
      image.mask(image2, x, y);
    } else if (mask === '1') {
      this.getDBM().Images.drawImageOnImage(image, image2, x, y);
    } else {
      image.composite(image2, x, y);
    }
    this.callNextAction(cache);
  },

  //---------------------------------------------------------------------
  // Action Bot Mod
  //---------------------------------------------------------------------

  mod() {},
};
