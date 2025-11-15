module.exports = {
  //---------------------------------------------------------------------
  // Action Name
  //---------------------------------------------------------------------

  name: 'Send TTS Message',

  //---------------------------------------------------------------------
  // Action Section
  //---------------------------------------------------------------------

  section: 'Messaging',

  //---------------------------------------------------------------------
  // Action Subtitle
  //---------------------------------------------------------------------

  subtitle(data, presets) {
    return `${presets.getSendTargetText(data.channel, data.varName)}: "${data.message.replace(/[\n\r]+/, '')}"`;
  },

  //---------------------------------------------------------------------
  // Action Storage Function
  //---------------------------------------------------------------------

  variableStorage(data, varType) {
    const type = parseInt(data.storage, 10);
    if (type !== varType) return;
    return [data.varName2, 'Message'];
  },

  //---------------------------------------------------------------------
  // Action Meta Data
  //---------------------------------------------------------------------

  meta: {
    version: '2.2.0',
    preciseCheck: true,
    author: null,
    authorUrl: null,
    downloadUrl: 'https://github.com/DBM-POLSKA/DBM-14/blob/main/bot-files/actions/send_tts_message.js',
  },

  //---------------------------------------------------------------------
  // Action Fields
  //---------------------------------------------------------------------

  fields: ['channel', 'varName', 'message', 'storage', 'varName2'],

  //---------------------------------------------------------------------
  // Command HTML
  //---------------------------------------------------------------------

  html(isEvent, data) {
    return `
<send-target-input dropdownLabel="Send To" selectId="channel" variableContainerId="varNameContainer" variableInputId="varName"></send-target-input>

<br><br><br>

<div style="padding-top: 8px;">
	<span class="dbminputlabel">Message</span><br>
	<textarea id="message" class="dbm_monospace" rows="9" placeholder="Insert message here..." style="white-space: nowrap; resize: none;"></textarea>
</div>

<br>

<store-in-variable allowNone selectId="storage" variableInputId="varName2" variableContainerId="varNameContainer2"></store-in-variable>`;
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
    const message = data.message;
    if (!data.channel || !message) {
      return this.callNextAction(cache);
    }

    const target = await this.getSendTargetFromData(data.channel, data.varName, cache);

    if (Array.isArray(target)) {
      this.callListFunc(target, 'send', [{ content: this.evalMessage(message, cache), tts: true }]).then(
        (resultMsg) => {
          const varName2 = this.evalMessage(data.varName2, cache);
          const storage = parseInt(data.storage, 10);
          this.storeValue(resultMsg, storage, varName2, cache);
          this.callNextAction(cache);
        },
      );
    } else if (target?.send) {
      target
        .send({ content: this.evalMessage(message, cache), tts: true })
        .then((resultMsg) => {
          const varName2 = this.evalMessage(data.varName2, cache);
          const storage = parseInt(data.storage, 10);
          this.storeValue(resultMsg, storage, varName2, cache);
          this.callNextAction(cache);
        })
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
