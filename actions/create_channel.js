module.exports = {
  //---------------------------------------------------------------------
  // Action Name
  //---------------------------------------------------------------------

  name: 'Create Text Channel',

  //---------------------------------------------------------------------
  // Action Section
  //---------------------------------------------------------------------

  section: 'Channel Control',

  //---------------------------------------------------------------------
  // Action Subtitle
  //---------------------------------------------------------------------

  subtitle(data, presets) {
    return `${data.channelName}`;
  },

  //---------------------------------------------------------------------
  // Action Storage Function
  //---------------------------------------------------------------------

  variableStorage(data, varType) {
    const type = parseInt(data.storage, 10);
    if (type !== varType) return;
    return [data.varName, 'Channel'];
  },

  //---------------------------------------------------------------------
  // Action Meta Data
  //---------------------------------------------------------------------

  meta: {
    version: '2.2.0',
    preciseCheck: true,
    author: null,
    authorUrl: null,
    downloadUrl: 'https://github.com/DBM-POLSKA/DBM-14/blob/main/bot-files/actions/create_channel.js',
  },

  //---------------------------------------------------------------------
  // Action Fields
  //---------------------------------------------------------------------

  fields: ['server', 'varName2', 'channelName', 'categoryID', 'topic', 'position', 'reason', 'storage', 'varName'],

  //---------------------------------------------------------------------
  // Command HTML
  //---------------------------------------------------------------------

  html(isEvent, data) {
    return `
<server-input dropdownLabel="Server" selectId="server" variableContainerId="varNameContainer2" variableInputId="varName2"></server-input>
<br><br><br>
<span class="dbminputlabel">Name</span><br>
<input id="channelName" class="round" type="text">
<br>
<span class="dbminputlabel">Category ID</span><br>
<input id= "categoryID" class="round" type="text" placeholder="Leave blank for default!">
<br>
<div style="float: left; width: calc(50% - 12px);">
	<span class="dbminputlabel">Topic</span><br>
	<input id="topic" class="round" type="text"><br>
</div>
<div style="float: right; width: calc(50% - 12px);">
	<span class="dbminputlabel">Position</span><br>
	<input id="position" class="round" type="text" placeholder="Leave blank for default!"><br>
</div>
<br>
<div>
  <span class="dbminputlabel">Reason</span>
  <input id="reason" placeholder="Optional" class="round" type="text">
</div>
<br>
<store-in-variable allowNone selectId="storage" variableInputId="varName" variableContainerId="varNameContainer"></store-in-variable>`;
  },

  //---------------------------------------------------------------------
  // Action Editor Init Code
  //---------------------------------------------------------------------

  init() {},

  //---------------------------------------------------------------------
  // Action Bot Function
  //---------------------------------------------------------------------

  async action(cache) {
    const data = cache.actions[cache.index];
    const server = (await this.getServerFromData(data.server, data.varName2, cache)) ?? cache.server;
    if (!server?.channels?.create) {
      this.callNextAction(cache);
    }

    const name = this.evalMessage(data.channelName, cache);
    const channelData = {
      name: name,
      reason: this.evalMessage(data.reason, cache),
    };
    if (data.topic) {
      channelData.topic = this.evalMessage(data.topic, cache);
    }
    if (data.position) {
      channelData.position = parseInt(this.evalMessage(data.position, cache), 10);
    }
    if (data.categoryID) {
      channelData.parent = this.evalMessage(data.categoryID, cache);
    }

    server.channels
      .create(channelData)
      .then((channel) => {
        const storage = parseInt(data.storage, 10);
        const varName = this.evalMessage(data.varName, cache);
        this.storeValue(channel, storage, varName, cache);
        this.callNextAction(cache);
      })
      .catch((err) => this.displayError(data, cache, err));
  },

  //---------------------------------------------------------------------
  // Action Bot Mod
  //---------------------------------------------------------------------

  mod() {},
};
