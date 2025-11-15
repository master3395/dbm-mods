module.exports = {
  //---------------------------------------------------------------------
  // Action Name
  //---------------------------------------------------------------------

  name: 'Find Thread',

  //---------------------------------------------------------------------
  // Action Section
  //---------------------------------------------------------------------

  section: 'Channel Control',

  //---------------------------------------------------------------------
  // Action Subtitle
  //---------------------------------------------------------------------

  subtitle(data, presets) {
    const info = ['Thread ID', 'Thread Name'];
    return `Find Thread by ${info[parseInt(data.info, 10)]}`;
  },

  //---------------------------------------------------------------------
  // Action Storage Function
  //---------------------------------------------------------------------

  variableStorage(data, varType) {
    const type = parseInt(data.storage, 10);
    if (type !== varType) return;
    return [data.varName, 'Thread Channel'];
  },

  //---------------------------------------------------------------------
  // Action Meta Data
  //---------------------------------------------------------------------

  meta: {
    version: '2.2.0',
    preciseCheck: true,
    author: null,
    authorUrl: null,
    downloadUrl: 'https://github.com/DBM-POLSKA/DBM-14/blob/main/bot-files/actions/find_thread.js',
  },

  //---------------------------------------------------------------------
  // Action Fields
  //---------------------------------------------------------------------

  fields: ['channel', 'channelVarName', 'info', 'find', 'storage', 'varName'],

  //---------------------------------------------------------------------
  // Command HTML
  //---------------------------------------------------------------------

  html(isEvent, data) {
    return `
<channel-input dropdownLabel="Source Channel" selectId="channel" variableContainerId="channelVarNameContainer" variableInputId="channelVarName"></channel-input>

<br><br><br>

<div style="padding-top: 8px;">
	<div style="float: left; width: 40%;">
		<span class="dbminputlabel">Source Field</span><br>
		<select id="info" class="round">
			<option value="0" selected>Thread ID</option>
			<option value="1">Thread Name</option>
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

  async action(cache) {
    const server = cache.server;
    if (!server?.channels) {
      this.callNextAction(cache);
      return;
    }

    const data = cache.actions[cache.index];
    const info = parseInt(data.info, 10);
    const find = this.evalMessage(data.find, cache);

    const channel = await this.getChannelFromData(data.channel, data.channelVarName, cache);

    const threads = channel.threads.cache;
    let result;
    switch (info) {
      case 0:
        result = threads.get(find);
        break;
      case 1:
        result = threads.find((c) => c.name === find);
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
