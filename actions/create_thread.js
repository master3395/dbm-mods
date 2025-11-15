module.exports = {
  // ---------------------------------------------------------------------
  // Action Name
  // ---------------------------------------------------------------------

  name: 'Create Thread',

  // ---------------------------------------------------------------------
  // Action Section
  // ---------------------------------------------------------------------

  section: 'Channel Control',

  // ---------------------------------------------------------------------
  // Action Subtitle
  // ---------------------------------------------------------------------

  subtitle(data, presets) {
    return `Create Thread Named "${data.threadName}" from ${
      data.fromTarget._index === 0
        ? presets.getChannelText(data.fromTarget?.channel ?? 0, data.fromTarget?.channelVarName)
        : presets.getMessageText(data.fromTarget?.message ?? 0, data.fromTarget?.messageVarName)
    }`;
  },

  // ---------------------------------------------------------------------
  // Action Storage Function
  // ---------------------------------------------------------------------

  variableStorage(data, varType) {
    const type = parseInt(data.storage, 10);
    if (type !== varType) return;
    return [data.storageVarName, 'Thread Channel'];
  },

  // ---------------------------------------------------------------------
  // Action Meta Data
  // ---------------------------------------------------------------------

  meta: {
    version: '2.2.0',
    preciseCheck: true,
    author: null,
    authorUrl: null,
    downloadUrl: 'https://github.com/DBM-POLSKA/DBM-14/blob/main/bot-files/actions/create_thread.js',
  },

  // ---------------------------------------------------------------------
  // Action Fields
  // ---------------------------------------------------------------------

  fields: ['fromTarget', 'threadName', 'autoArchiveDuration', 'reason', 'storage', 'storageVarName'],

  // ---------------------------------------------------------------------
  // Command HTML
  // ---------------------------------------------------------------------

  html(isEvent, data) {
    return `
<tab-system exclusiveTabData retainElementIds spreadOut id="fromTarget">
  <tab label="Create on Channel" icon="plus" fields='["channel", "channelVarName"]'>
    <div style="padding: 8px; margin-bottom: 25px;">
      <channel-input dropdownLabel="Source Channel" selectId="channel" variableContainerId="varNameContainerChannel" variableInputId="channelVarName"></channel-input>
    </div>
    <br>
  </tab>
  <tab label="Create from Message" icon="plus" fields='["message", "messageVarName"]'>
    <div style="padding: 8px; margin-bottom: 25px;">
      <message-input dropdownLabel="Source Message" selectId="message" variableContainerId="varNameContainerMessage" variableInputId="messageVarName"></message-input>
    </div>
    <br>
  </tab>
</tab-system>

<br><br><br><br><br><br><br>

<div style="float: left; width: calc(50% - 12px);">

  <span class="dbminputlabel">Thread Name</span><br>
  <input id="threadName" class="round" type="text"><br>

</div>
<div style="float: right; width: calc(50% - 12px);">

  <span class="dbminputlabel">Auto-Archive Duration</span><br>
  <select id="autoArchiveDuration" class="round">
    <option value="60" selected>1 hour</option>
    <option value="1440">24 hours</option>
    <option value="4320">3 days (requires boost LVL 1)</option>
    <option value="10080">1 week (requires boost LVL 2)</option>
    <option value="max">Maximum</option>
  </select><br>

</div>

<br><br><br><br>

<hr class="subtlebar" style="margin-top: 0px;">

<br>

<div>
  <span class="dbminputlabel">Reason</span>
  <input id="reason" placeholder="Optional" class="round" type="text">
</div>

<br>

<store-in-variable allowNone selectId="storage" variableInputId="storageVarName" variableContainerId="varNameContainer2"></store-in-variable>`;
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

    let messageOrChannel = null;

    if (data.fromTarget._index === 0) {
      messageOrChannel = await this.getChannelFromData(data.fromTarget.channel, data.fromTarget.channelVarName, cache);
    } else {
      messageOrChannel = await this.getMessageFromData(data.fromTarget.message, data.fromTarget.messageVarName, cache);
    }

    const threadOptions = {
      name: this.evalMessage(data.threadName, cache),
      autoArchiveDuration: data.autoArchiveDuration === 'max' ? 'MAX' : parseInt(data.autoArchiveDuration, 10),
    };

    if (data.reason) {
      const reason = this.evalMessage(data.reason, cache);
      threadOptions.reason = reason;
    }

    if (messageOrChannel !== null) {
      if (Array.isArray(messageOrChannel)) {
        this.callListFunc(messageOrChannel, 'startThread', [threadOptions]).then(() => this.callNextAction(cache));
      } else if (messageOrChannel?.startThread) {
        messageOrChannel
          .startThread(threadOptions)
          .then((threadChannel) => {
            const storage = parseInt(data.storage, 10);
            const storageVarName = this.evalMessage(data.storageVarName, cache);
            this.storeValue(threadChannel, storage, storageVarName, cache);
            this.callNextAction(cache);
          })
          .catch((err) => this.displayError(data, cache, err));
      }
    } else {
      this.callNextAction(cache);
    }
  },

  // ---------------------------------------------------------------------
  // Action Bot Mod
  // ---------------------------------------------------------------------

  mod() {},
};
