module.exports = {
  // ---------------------------------------------------------------------
  // Action Name
  // ---------------------------------------------------------------------

  name: 'Rotate Image',

  // ---------------------------------------------------------------------
  // Action Section
  // ---------------------------------------------------------------------

  section: 'Image Editing',

  // ---------------------------------------------------------------------
  // Action Subtitle
  // ---------------------------------------------------------------------

  subtitle(data, presets) {
    const storeTypes = presets.variables;
    const mirror = ['No Mirror', 'Horizontal Mirror', 'Vertical Mirror', 'Diagonal Mirror'];
    return `${storeTypes[parseInt(data.storage, 10)]} (${data.varName}) -> [${mirror[parseInt(data.mirror, 10)]} ~ ${
      data.rotation
    }°]`;
  },

  // ---------------------------------------------------------------------
  // Action Meta Data
  // ---------------------------------------------------------------------

  meta: {
    version: '2.2.0',
    preciseCheck: true,
    author: null,
    authorUrl: null,
    downloadUrl: 'https://github.com/DBM-POLSKA/DBM-14/blob/main/bot-files/actions/rotate_image.js',
  },

  // ---------------------------------------------------------------------
  // Action Fields
  // ---------------------------------------------------------------------

  fields: ['storage', 'varName', 'rotation', 'mirror'],

  // ---------------------------------------------------------------------
  // Command HTML
  // ---------------------------------------------------------------------

  html(isEvent, data) {
    return `
<retrieve-from-variable dropdownLabel="Source Image" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></retrieve-from-variable>

<br><br><br>

<div style="padding-top: 8px;">
	<div style="float: left; width: calc(50% - 12px);">
		<span class="dbminputlabel">Mirror</span><br>
		<select id="mirror" class="round">
			<option value="0" selected>None</option>
			<option value="1">Horizontal Mirror</option>
			<option value="2">Vertical Mirror</option>
			<option value="3">Diagonal Mirror</option>
		</select><br>
	</div>
	<div style="float: right; width: calc(50% - 12px);">
		<span class="dbminputlabel">Rotation (degrees)</span><br>
		<input id="rotation" class="round" type="text" value="0"><br>
	</div>
</div>`;
  },

  // ---------------------------------------------------------------------
  // Action Editor Init Code
  // ---------------------------------------------------------------------

  init() {},

  // ---------------------------------------------------------------------
  // Action Bot Function
  // ---------------------------------------------------------------------

  action(cache) {
    const data = cache.actions[cache.index];
    const storage = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);
    const image = this.getVariable(storage, varName, cache);
    if (!image) {
      this.callNextAction(cache);
      return;
    }
    const mirror = parseInt(data.mirror, 10);
    switch (mirror) {
      case 0:
        image.mirror(false, false);
        break;
      case 1:
        image.mirror(true, false);
        break;
      case 2:
        image.mirror(false, true);
        break;
      case 3:
        image.mirror(true, true);
        break;
    }
    const rotation = parseInt(data.rotation, 10);
    image.rotate(rotation);
    this.callNextAction(cache);
  },

  // ---------------------------------------------------------------------
  // Action Bot Mod
  // ---------------------------------------------------------------------

  mod() {},
};
