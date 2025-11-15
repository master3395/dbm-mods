module.exports = {
  // ---------------------------------------------------------------------
  // Action Name
  // ---------------------------------------------------------------------

  name: 'Edit Role',

  // ---------------------------------------------------------------------
  // Action Section
  // ---------------------------------------------------------------------

  section: 'Role Control',

  // ---------------------------------------------------------------------
  // Action Subtitle
  // ---------------------------------------------------------------------

  subtitle(data, presets) {
    return `${presets.getRoleText(data.storage, data.varName)}`;
  },

  // ---------------------------------------------------------------------
  // Action Meta Data
  // ---------------------------------------------------------------------

  meta: {
    version: '2.2.0',
    preciseCheck: true,
    author: null,
    authorUrl: null,
    downloadUrl: 'https://github.com/DBM-POLSKA/DBM-14/blob/main/bot-files/actions/edit_role.js',
  },

  // ---------------------------------------------------------------------
  // Action Fields
  // ---------------------------------------------------------------------

  fields: ['roleName', 'hoist', 'mentionable', 'color', 'position', 'storage', 'varName', 'reason'],

  // ---------------------------------------------------------------------
  // Command HTML
  // ---------------------------------------------------------------------

  html(isEvent, data) {
    return `
<role-input dropdownLabel="Source Role" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></role-input>

<br><br><br>

<div style="padding-top: 8px;">
	<span class="dbminputlabel">Name</span><br>
	<input id="roleName" placeholder="Leave blank to not edit!" class="round" type="text">
</div>

<br>

<div style="float: left; width: calc(50% - 12px);">
	<span class="dbminputlabel">Display Separately</span><br>
	<select id="hoist" class="round">
		<option value="none" selected>Don't Edit</option>
		<option value="true">Yes</option>
		<option value="false">No</option>
	</select><br>
	<span class="dbminputlabel">Mentionable</span><br>
	<select id="mentionable" class="round">
		<option value="none" selected>Don't Edit</option>
		<option value="true">Yes</option>
		<option value="false">No</option>
	</select><br>
</div>

<div style="float: right; width: calc(50% - 12px);">
	<span class="dbminputlabel">Color</span><br>
	<input id="color" class="round" type="text" placeholder="Leave blank to not edit!"><br>
	<span class="dbminputlabel">Position</span><br>
	<input id="position" class="round" type="text" placeholder="Leave blank to not edit!"><br>
</div>

<br><br><br><br><br><br><br>

<hr class="subtlebar">

<br>

<div>
  <span class="dbminputlabel">Reason</span>
  <input id="reason" placeholder="Optional" class="round" type="text">
</div>`;
  },

  // ---------------------------------------------------------------------
  // Action Editor Init Code
  // ---------------------------------------------------------------------

  init() {},

  // ---------------------------------------------------------------------
  // Action Bot Function
  // ---------------------------------------------------------------------

  async action(cache) {
    const data = cache.actions[cache.index];
    const reason = this.evalMessage(data.reason, cache);

    const roleData = {};
    if (data.roleName) {
      roleData.name = this.evalMessage(data.roleName, cache);
    }
    if (data.color) {
      roleData.color = this.evalMessage(data.color, cache);
    }
    if (data.position) {
      roleData.position = parseInt(this.evalMessage(data.position, cache), 10);
    }
    if (data.hoist !== 'none') {
      roleData.hoist = data.hoist === 'true';
    }
    if (data.mentionable !== 'none') {
      roleData.mentionable = data.mentionable === 'true';
    }

    const role = await this.getRoleFromData(data.storage, data.varName, cache);

    if (Array.isArray(role)) {
      this.callListFunc(role, 'edit', [roleData, reason]).then(() => this.callNextAction(cache));
    } else if (role?.edit) {
      role
        .edit(roleData, reason)
        .then(() => this.callNextAction(cache))
        .catch((err) => this.displayError(data, cache, err));
    } else {
      this.callNextAction(cache);
    }
  },

  // ---------------------------------------------------------------------
  // Action Bot Mod
  // ---------------------------------------------------------------------

  mod() {},
};
