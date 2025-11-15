module.exports = {
  //---------------------------------------------------------------------
  // Action Name
  //---------------------------------------------------------------------

  name: 'Find Voice Channel',

  //---------------------------------------------------------------------
  // Action Section
  //---------------------------------------------------------------------

  section: 'Channel Control',

  //---------------------------------------------------------------------
  // Action Subtitle
  //---------------------------------------------------------------------

  subtitle(data, presets) {
    const info = [
      'Voice Channel ID',
      'Voice Channel Name',
      'Voice Channel Position',
      'Voice Channel User Limit',
      'Voice Channel Bitrate',
      'Voice Channel Category ID',
    ];
    return `Find Voice Channel by ${info[parseInt(data.info, 10)]}`;
  },

  //---------------------------------------------------------------------
  // Action Storage Function
  //---------------------------------------------------------------------

  variableStorage(data, varType) {
    const type = parseInt(data.storage, 10);
    if (type !== varType) return;
    return [data.varName, 'Voice Channel'];
  },

  //---------------------------------------------------------------------
  // Action Meta Data
  //---------------------------------------------------------------------

  meta: {
    version: '2.2.0',
    preciseCheck: true,
    author: null,
    authorUrl: null,
    downloadUrl: 'https://github.com/DBM-POLSKA/DBM-14/blob/main/bot-files/actions/find_voice_channel.js',
  },

  //---------------------------------------------------------------------
  // Action Fields
  //---------------------------------------------------------------------

  fields: ['info', 'find', 'storage', 'varName'],

  //---------------------------------------------------------------------
  // Command HTML
  //---------------------------------------------------------------------

  html(isEvent, data) {
    return `
<div>
	<div style="float: left; width: 40%;">
		<span class="dbminputlabel">Source Field</span><br>
		<select id="info" class="round">
			<option value="0" selected>Voice Channel ID</option>
			<option value="1">Voice Channel Name</option>
			<option value="2">Voice Channel Position</option>
			<option value="3">Voice Channel User Limit</option>
      <option value="4">Voice Channel Bitrate (kbps)</option>
      <option value="5">Voice Channel Category ID</option>
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

  //---------------------------------------------------------------------
  // Action Editor Init Code
  //---------------------------------------------------------------------

  init() {},

  //---------------------------------------------------------------------
  // Action Bot Function
  //---------------------------------------------------------------------

  action(cache) {
    const server = cache.server;
    if (!server?.channels) {
      this.callNextAction(cache);
      return;
    }
    const data = cache.actions[cache.index];
    const info = parseInt(data.info, 10);
    const find = this.evalMessage(data.find, cache);
    const channels = server.channels.cache.filter((c) => c.type === 'GUILD_VOICE');
    let result;
    switch (info) {
      case 0:
        result = channels.get(find);
        break;
      case 1:
        result = channels.find((c) => c.name === find);
        break;
      case 2:
        const position = parseInt(find, 10);
        result = channels.find((c) => c.position === position);
        break;
      case 3:
        const userLimit = parseInt(find, 10);
        result = channels.find((c) => c.userLimit === userLimit);
        break;
      case 4:
        const bitrate = parseInt(find, 10) / 1000;
        result = channels.find((c) => c.bitrate === bitrate);
        break;
      case 5:
        result = channels.find((c) => c.parentId === find);
        break;
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

  //---------------------------------------------------------------------
  // Action Bot Mod
  //---------------------------------------------------------------------

  mod() {},
};
