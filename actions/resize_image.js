module.exports = {
  //---------------------------------------------------------------------
  // Action Name
  //---------------------------------------------------------------------

  name: 'Resize Image',

  //---------------------------------------------------------------------
  // Action Section
  //---------------------------------------------------------------------

  section: 'Image Editing',

  //---------------------------------------------------------------------
  // Action Subtitle
  //---------------------------------------------------------------------

  subtitle(data, presets) {
    const storeTypes = presets.variables;
    return `${storeTypes[parseInt(data.storage, 10)]} (${data.varName}) -> [${data.width}, ${data.height}]`;
  },

  //---------------------------------------------------------------------
  // Action Meta Data
  //---------------------------------------------------------------------

  meta: {
    version: '2.2.0',
    preciseCheck: true,
    author: null,
    authorUrl: null,
    downloadUrl: 'https://github.com/DBM-POLSKA/DBM-14/blob/main/bot-files/actions/resize_image.js',
  },

  //---------------------------------------------------------------------
  // Action Fields
  //---------------------------------------------------------------------

  fields: ['storage', 'varName', 'width', 'height'],

  //---------------------------------------------------------------------
  // Command HTML
  //---------------------------------------------------------------------

  html(isEvent, data) {
    return `
<retrieve-from-variable dropdownLabel="Source Image" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></retrieve-from-variable>

<br><br><br>

<div style="padding-top: 8px;">
	<div style="float: left; width: calc(50% - 12px);">
		<span class="dbminputlabel">New Width (direct size or percent)</span><br>
		<input id="width" class="round" type="text" value="100%"><br>
	</div>
	<div style="float: right; width: calc(50% - 12px);">
		<span class="dbminputlabel">New Height (direct size or percent)</span><br>
		<input id="height" class="round" type="text" value="100%"><br>
	</div>
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
    if (!image) {
      this.callNextAction(cache);
      return;
    }
    let width = this.evalMessage(data.width, cache);
    let height = this.evalMessage(data.height, cache);
    if (width.endsWith('%')) {
      const percent = width.replace('%', '');
      width = image.bitmap.width * (parseInt(percent, 10) / 100);
    } else {
      width = parseInt(width, 10);
    }
    if (height.endsWith('%')) {
      const percent = height.replace('%', '');
      height = image.bitmap.height * (parseInt(percent, 10) / 100);
    } else {
      height = parseInt(height, 10);
    }
    image.resize(width, height);
    this.callNextAction(cache);
  },

  //---------------------------------------------------------------------
  // Action Bot Mod
  //---------------------------------------------------------------------

  mod() {},
};
