module.exports = {
  // ---------------------------------------------------------------------
  // Action Name
  // ---------------------------------------------------------------------

  name: 'Create Voice Channel',

  // ---------------------------------------------------------------------
  // Action Section
  // ---------------------------------------------------------------------

  section: 'Channel Control',

  // ---------------------------------------------------------------------
  // Action Subtitle
  // ---------------------------------------------------------------------

  subtitle(data, presets) {
    return `${data.channelName}`;
  },

  // ---------------------------------------------------------------------
  // Action Storage Function
  // ---------------------------------------------------------------------

  variableStorage(data, varType) {
    const type = parseInt(data.storage, 10);
    if (type !== varType) return;
    return [data.varName, 'Voice Channel'];
  },

  // ---------------------------------------------------------------------
  // Action Meta Data
  // ---------------------------------------------------------------------

  meta: {
    version: '2.2.0',
    preciseCheck: true,
    author: null,
    authorUrl: null,
    downloadUrl: 'https://github.com/DBM-POLSKA/DBM-14/blob/main/bot-files/actions/create_voice_channel.js',
  },

  // ---------------------------------------------------------------------
  // Action Fields
  // ---------------------------------------------------------------------

  fields: ['channelName', 'bitrate', 'userLimit', 'storage', 'varName', 'categoryID', 'reason'],

  // ---------------------------------------------------------------------
  // Command HTML
  // ---------------------------------------------------------------------

  html(isEvent, data) {
    return `
<span class="dbminputlabel">Name</span><br>
<input id="channelName" class="round" type="text">

<br>

<span class="dbminputlabel">Category ID</span><br>
<input id= "categoryID" class="round" type="text" placeholder="Leave blank for default!">

<br>

<div style="float: left; width: calc(50% - 12px);">
	<span class="dbminputlabel">Bitrate</span><br>
	<input id="bitrate" class="round" type="text" placeholder="Leave blank for default!"><br>
</div>
<div style="float: right; width: calc(50% - 12px);">
	<span class="dbminputlabel">User Limit</span><br>
	<input id="userLimit" class="round" type="text" placeholder="Leave blank for default!"><br>
</div>

<br><br><br><br>

<hr class="subtlebar" style="margin-top: 0px;">

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
    if (!server?.channels) return this.callNextAction(cache);
    const name = this.evalMessage(data.channelName, cache);
    const storage = parseInt(data.storage, 10);
    const reason = this.evalMessage(data.reason, cache);
    /** @type {import('discord.js').GuildChannelCreateOptions} */
    const channelData = { reason };
    if (data.bitrate) {
      channelData.bitrate = parseInt(this.evalMessage(data.bitrate, cache), 10) * 1000;
    }
    if (data.userLimit) {
      channelData.userLimit = parseInt(this.evalMessage(data.userLimit, cache), 10);
    }
    if (data.categoryID) {
      channelData.parent = this.evalMessage(data.categoryID, cache);
    }
    server.channels
      .create(name, {
        ...channelData,
        type: 'GUILD_VOICE',
      })
      .then((channel) => {
        const varName = this.evalMessage(data.varName, cache);
        this.storeValue(channel, storage, varName, cache);
        this.callNextAction(cache);
      })
      .catch((err) => this.displayError(data, cache, err));
  },

  // ---------------------------------------------------------------------
  // Action Bot Mod
  // ---------------------------------------------------------------------

  mod() {},
};
