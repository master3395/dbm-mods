module.exports = {
  // ---------------------------------------------------------------------
  // Action Name
  // ---------------------------------------------------------------------

  name: 'Add Embed Field',

  // ---------------------------------------------------------------------
  // Action Section
  // ---------------------------------------------------------------------

  section: 'Embed Message',

  // ---------------------------------------------------------------------
  // Action Subtitle
  // ---------------------------------------------------------------------

  subtitle(data, presets) {
    return `${data.message}`;
  },

  // ---------------------------------------------------------------------
  // Action Meta Data
  // ---------------------------------------------------------------------

  meta: {
    version: '2.2.0',
    preciseCheck: true,
    author: null,
    authorUrl: null,
    downloadUrl: 'https://github.com/DBM-POLSKA/DBM-14/blob/main/bot-files/actions/add_embed_field.js',
  },

  // ---------------------------------------------------------------------
  // Action Fields
  // ---------------------------------------------------------------------

  fields: ['storage', 'varName', 'fieldName', 'message', 'inline'],

  // ---------------------------------------------------------------------
  // Command HTML
  // ---------------------------------------------------------------------

  html(isEvent, data) {
    return `
<retrieve-from-variable dropdownLabel="Source Embed Object" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></retrieve-from-variable>

<br><br><br>

<div style="padding-top: 8px;">
	<div style="float: left; width: calc(50% - 12px);">
		<span class="dbminputlabel">Field Name</span><br>
		<input id="fieldName" class="round" type="text">
	</div>
	<div style="float: right; width: calc(50% - 12px);">
		<span class="dbminputlabel">Display Inline</span><br>
		<select id="inline" class="round">
			<option value="0">Yes</option>
			<option value="1" selected>No</option>
		</select>
	</div>
</div>

<br><br><br><br>

<hr class="subtlebar">

<br>

<div style="padding-top: 8px;">
	<span class="dbminputlabel">Field Description</span><br>
	<textarea id="message" class="dbm_monospace"  rows="8" placeholder="Insert message here..." style="white-space: nowrap; resize: none;"></textarea>
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
    const embed = this.getVariable(storage, varName, cache);
    const name = this.evalMessage(data.fieldName, cache);
    const message = this.evalMessage(data.message, cache);
    const inline = data.inline === '0';
    if (embed?.addFields) {
      embed.addFields({ name, value: message, inline });
    }

    this.callNextAction(cache);
  },

  // ---------------------------------------------------------------------
  // Action Bot Mod
  // ---------------------------------------------------------------------

  mod() {},
};
