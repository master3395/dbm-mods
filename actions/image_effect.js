module.exports = {
  //---------------------------------------------------------------------
  // Action Name
  //---------------------------------------------------------------------

  name: 'Apply Image Effect',

  //---------------------------------------------------------------------
  // Action Section
  //---------------------------------------------------------------------

  section: 'Image Editing',

  //---------------------------------------------------------------------
  // Action Subtitle
  //---------------------------------------------------------------------

  subtitle(data, presets) {
    const storeTypes = presets.variables;
    const effect = [
      'Greyscale',
      'Invert',
      'Normalize',
      'Remove Transparency',
      'Apply Minor Blur',
      'Apply Major Blur',
      'Apply Sepia',
      'Dither',
    ];
    return `${storeTypes[parseInt(data.storage, 10)]} (${data.varName}) -> ${effect[parseInt(data.effect, 10)]}`;
  },

  //---------------------------------------------------------------------
  // Action Meta Data
  //---------------------------------------------------------------------

  meta: {
    version: '2.2.0',
    preciseCheck: true,
    author: null,
    authorUrl: null,
    downloadUrl: 'https://github.com/DBM-POLSKA/DBM-14/blob/main/bot-files/actions/image_effect.js',
  },

  //---------------------------------------------------------------------
  // Action Fields
  //---------------------------------------------------------------------

  fields: ['storage', 'varName', 'effect'],

  //---------------------------------------------------------------------
  // Command HTML
  //---------------------------------------------------------------------

  html(isEvent, data) {
    return `
<retrieve-from-variable dropdownLabel="Base Image" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></retrieve-from-variable>

<br><br><br>

<div style="padding-top: 8px;">
	<div style="float: left; width: 100%;">
		<span class="dbminputlabel">Effect</span><br>
		<select id="effect" class="round">
			<option value="0" selected>Greyscale</option>
			<option value="1">Invert</option>
			<option value="2">Normalize</option>
			<option value="3">Remove Transparency</option>
			<option value="4">Apply Minor Blur</option>
			<option value="5">Apply Major Blur</option>
			<option value="6">Apply Sepia</option>
			<option value="7">Dither</option>
		</select><br>
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
    const effect = parseInt(data.effect, 10);
    switch (effect) {
      case 0:
        image.greyscale();
        break;
      case 1:
        image.invert();
        break;
      case 2:
        image.normalize();
        break;
      case 3:
        image.opaque();
        break;
      case 4:
        image.blur(2);
        break;
      case 5:
        image.blur(10);
        break;
      case 6:
        image.sepia();
        break;
      case 7:
        image.dither565();
        break;
    }
    this.callNextAction(cache);
  },

  //---------------------------------------------------------------------
  // Action Bot Mod
  //---------------------------------------------------------------------

  mod() {},
};
