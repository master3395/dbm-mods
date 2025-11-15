module.exports = {
  //---------------------------------------------------------------------
  // Action Name
  //---------------------------------------------------------------------

  name: 'Send File',

  //---------------------------------------------------------------------
  // Action Section
  //---------------------------------------------------------------------

  section: 'Messaging',

  //---------------------------------------------------------------------
  // Action Subtitle
  //---------------------------------------------------------------------

  subtitle(data, presets) {
    const channels = presets.sendTargets;
    return `${channels[parseInt(data.channel, 10)]}: "${data.message.replace(/[\n\r]+/, '')}"`;
  },

  //---------------------------------------------------------------------
  // Action Meta Data
  //---------------------------------------------------------------------

  meta: {
    version: '2.2.0',
    preciseCheck: true,
    author: null,
    authorUrl: null,
    downloadUrl: 'https://github.com/DBM-POLSKA/DBM-14/blob/main/bot-files/actions/send_file.js',
  },

  //---------------------------------------------------------------------
  // Action Fields
  //---------------------------------------------------------------------

  fields: ['channel', 'varName', 'file', 'message'],

  //---------------------------------------------------------------------
  // Command HTML
  //---------------------------------------------------------------------

  html(isEvent, data) {
    return `
<send-target-input dropdownLabel="Send To" selectId="channel" variableContainerId="varNameContainer" variableInputId="varName"></send-target-input>

<br><br><br>

<div style="padding-top: 8px;">
	<span class="dbminputlabel">Local File URL</span><br>
	<input id="file" class="round" type="text" value="resources/"><br>
</div>

<div>
	<span class="dbminputlabel">Message</span><br>
	<textarea id="message" class="dbm_monospace" rows="8" placeholder="Insert message here..." style="white-space: nowrap; resize: none;"></textarea>
</div>`;
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
    const { DiscordJS } = this.getDBM();
    const message = data.message;
    if (!data.channel || !message) {
      return this.callNextAction(cache);
    }

    const target = await this.getSendTargetFromData(data.channel, data.varName, cache);

    const file = new DiscordJS.MessageAttachment(this.getLocalFile(this.evalMessage(data.file, cache)));
    const options = {
      content: this.evalMessage(message, cache),
      files: [file],
    };

    if (Array.isArray(target)) {
      this.callListFunc(target, 'send', [options]).then(() => this.callNextAction(cache));
    } else if (target?.send) {
      target
        .send(options)
        .then(() => this.callNextAction(cache))
        .catch((err) => this.displayError(data, cache, err));
    } else {
      this.callNextAction(cache);
    }
  },

  //---------------------------------------------------------------------
  // Action Bot Mod
  //---------------------------------------------------------------------

  mod() {},
};
