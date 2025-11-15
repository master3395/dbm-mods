module.exports = {
  // ---------------------------------------------------------------------
  // Action Name
  // ---------------------------------------------------------------------

  name: 'Find Server',

  // ---------------------------------------------------------------------
  // Action Section
  // ---------------------------------------------------------------------

  section: 'Server Control',

  // ---------------------------------------------------------------------
  // Action Subtitle
  // ---------------------------------------------------------------------

  subtitle(data, presets) {
    void presets;
    const info = [
      'Server ID',
      'Server Name',
      'Server Name Acronym',
      'Server Member Count',
      'Server Region (Removed)',
      'Server Owner ID',
      'Server Verification Level',
      'Server Is Available',
    ];
    return `Find Server by ${info[parseInt(data.info, 10)]}`;
  },

  // ---------------------------------------------------------------------
  // Action Storage Function
  // ---------------------------------------------------------------------

  variableStorage(data, varType) {
    const type = parseInt(data.storage, 10);
    if (type !== varType) return;
    return [data.varName, 'Server'];
  },

  // ---------------------------------------------------------------------
  // Action Meta Data
  // ---------------------------------------------------------------------

  meta: {
    version: '2.2.0',
    preciseCheck: true,
    author: null,
    authorUrl: null,
    downloadUrl: 'https://github.com/DBM-POLSKA/DBM-14/blob/main/bot-files/actions/find_server.js',
  },

  // ---------------------------------------------------------------------
  // Action Fields
  // ---------------------------------------------------------------------

  fields: ['info', 'find', 'storage', 'varName'],

  // ---------------------------------------------------------------------
  // Command HTML
  // ---------------------------------------------------------------------

  html(isEvent, data) {
    void isEvent;
    void data;
    return `
<div>
	<div style="float: left; width: 40%;">
		<span class="dbminputlabel">Source Field</span><br>
		<select id="info" class="round">
			<option value="0" selected>Server ID</option>
			<option value="1">Server Name</option>
			<option value="2">Server Name Acronym</option>
			<option value="3">Server Member Count</option>
			<option value="4">Server Region (Removed)</option>
			<option value="5">Server Owner ID</option>
			<option value="6">Server Verification Level</option>
			<option value="7">Server Is Available</option>
		</select>
	</div>
	<div style="float: right; width: 55%;">
		<span class="dbminputlabel">Search Value</span><br>
		<input id="find" class="round" type="text">
	</div>
</div>

<br><br><br>

<store-in-variable style="padding-top: 8px;" dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName" selectWidth="40%" variableInputWidth="55%"></store-in-variable>`;
  },

  // ---------------------------------------------------------------------
  // Action Editor Init Code
  // ---------------------------------------------------------------------

  init() {},

  // ---------------------------------------------------------------------
  // Action Bot Function
  // ---------------------------------------------------------------------

  action(cache) {
    const bot = this.getDBM().Bot.bot;
    const servers = bot.guilds.cache;
    const data = cache.actions[cache.index];
    const info = parseInt(data.info, 10);
    const find = this.evalMessage(data.find, cache);
    let result;
    switch (info) {
      case 0:
        result = servers.get(find);
        break;
      case 1:
        result = servers.find((s) => s.name === find);
        break;
      case 2:
        result = servers.find((s) => s.nameAcronym === find);
        break;
      case 3: {
        const memberCount = parseInt(find, 10);
        result = servers.find((s) => s.memberCount === memberCount);
        break;
      }
      case 5:
        result = servers.find((s) => s.ownerId === find);
        break;
      case 6:
        result = servers.find((s) => s.verificationLevel === find);
        break;
      case 7: {
        const available = find === 'true';
        result = servers.find((s) => s.available === available);
        break;
      }
      default:
        break;
    }
    if (result !== undefined) {
      const storage = parseInt(data.storage, 10);
      const varName = this.evalMessage(data.varName, cache);
      this.storeValue(result, storage, varName, cache);
    }
    this.callNextAction(cache);
  },

  // ---------------------------------------------------------------------
  // Action Bot Mod
  // ---------------------------------------------------------------------

  mod() {},
};
