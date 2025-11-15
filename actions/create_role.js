module.exports = {
  // ---------------------------------------------------------------------
  // Action Name
  // ---------------------------------------------------------------------

  name: 'Create Role',

  // ---------------------------------------------------------------------
  // Action Section
  // ---------------------------------------------------------------------

  section: 'Role Control',

  // ---------------------------------------------------------------------
  // Action Subtitle
  // ---------------------------------------------------------------------

  subtitle(data, presets) {
    return `${data.roleName}`;
  },

  // ---------------------------------------------------------------------
  // Action Storage Function
  // ---------------------------------------------------------------------

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    return [data.varName, 'Role'];
  },

  // ---------------------------------------------------------------------
  // Action Meta Data
  // ---------------------------------------------------------------------

  meta: {
    version: '2.2.0',
    preciseCheck: true,
    author: null,
    authorUrl: null,
    downloadUrl: 'https://github.com/DBM-POLSKA/DBM-14/blob/main/bot-files/actions/create_role.js',
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
<span class="dbminputlabel">Name</span><br>
<input id="roleName" class="round" type="text">

<br>

<div style="float: left; width: 50%;">
	<span class="dbminputlabel">Display Separately</span><br>
	<select id="hoist" class="round" style="width: 90%;">
		<option value="true">Yes</option>
		<option value="false" selected>No</option>
	</select>

  <br>

	<span class="dbminputlabel">Mentionable</span><br>
	<select id="mentionable" class="round" style="width: 90%;">
		<option value="true" selected>Yes</option>
		<option value="false">No</option>
	</select><br>
</div>
<div style="float: right; width: 50%;">
	<span class="dbminputlabel">Color</span><br>
	<input id="color" class="round" type="text" placeholder="Leave blank for default!">

  <br>

	<span class="dbminputlabel">Position</span><br>
	<input id="position" class="round" type="text" placeholder="Leave blank for default!"><br>
</div>

<br><br><br><br><br><br><br>

<hr class="subtlebar">

<br>

<div>
  <span class="dbminputlabel">Reason</span>
  <input id="reason" placeholder="Optional" class="round" type="text">
</div>

<br>

<store-in-variable allowNone selectId="storage" variableInputId="varName" variableContainerId="varNameContainer"></store-in-variable>`;
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
    const server = cache.server;
    if (!server) return this.callNextAction(cache);
    const reason = this.evalMessage(data.reason, cache);
    /** @type {import('discord.js').CreateRoleOptions} */
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
    roleData.hoist = data.hoist === 'true';
    roleData.mentionable = data.mentionable === 'true';
    const storage = parseInt(data.storage, 10);
    server.roles
      .create({ ...roleData, reason })
      .then((role) => {
        const varName = this.evalMessage(data.varName, cache);
        this.storeValue(role, storage, varName, cache);
        this.callNextAction(cache);
      })
      .catch((err) => this.displayError(data, cache, err));
  },

  // ---------------------------------------------------------------------
  // Action Bot Mod
  // ---------------------------------------------------------------------

  mod() {},
};
