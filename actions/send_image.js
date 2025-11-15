module.exports = {
  // ---------------------------------------------------------------------
  // Action Name
  // ---------------------------------------------------------------------

  name: 'Send Image',

  // ---------------------------------------------------------------------
  // Action Section
  // ---------------------------------------------------------------------

  section: 'Image Editing',

  // ---------------------------------------------------------------------
  // Action Subtitle
  // ---------------------------------------------------------------------

  subtitle(data, presets) {
    return `${presets.getSendTargetText(data.channel, data.varName2)}: ${data.varName}`;
  },

  // ---------------------------------------------------------------------
  // Action Meta Data
  // ---------------------------------------------------------------------

  meta: {
    version: '2.2.0',
    preciseCheck: true,
    author: null,
    authorUrl: null,
    downloadUrl: 'https://github.com/DBM-POLSKA/DBM-14/blob/main/bot-files/actions/send_image.js',
  },

  // ---------------------------------------------------------------------
  // Action Fields
  // ---------------------------------------------------------------------

  fields: ['storage', 'varName', 'channel', 'varName2', 'message', 'storage2', 'varName3'],

  // ---------------------------------------------------------------------
  // Action Storage Function
  // ---------------------------------------------------------------------

  variableStorage(data, varType) {
    const type = parseInt(data.storage2, 10);
    if (type !== varType) return;
    return [data.varName3, 'Message'];
  },

  // ---------------------------------------------------------------------
  // Command HTML
  // ---------------------------------------------------------------------

  html(isEvent, data) {
    return `
<retrieve-from-variable dropdownLabel="Source Image" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></retrieve-from-variable>

<br><br><br>

<send-target-input style="padding-top: 8px;" dropdownLabel="Send To" selectId="channel" variableContainerId="varNameContainer2" variableInputId="varName2"></send-target-input>

<br><br><br>

<div style="padding-top: 8px;">
	<span class="dbminputlabel">Message</span><br>
	<textarea id="message" class="dbm_monospace" rows="7" placeholder="Insert message here..." style="white-space: nowrap; resize: none;"></textarea>
</div>

<br>

<store-in-variable allowNone selectId="storage2" variableInputId="varName3" variableContainerId="varNameContainer3"></store-in-variable>`;
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
    const { DiscordJS, Images } = this.getDBM();

    const storage = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);
    const image = this.getVariable(storage, varName, cache);
    if (!image) {
      this.callNextAction(cache);
      return;
    }

    const target = await this.getSendTargetFromData(data.channel, data.varName2, cache);

    const varName3 = this.evalMessage(data.varName3, cache);
    const storage2 = parseInt(data.storage2, 10);

    if (!Array.isArray(target) && !target?.send) return this.callNextAction(cache);
    Images.createBuffer(image)
      .then((buffer) => {
        if (Array.isArray(target)) {
          this.callListFunc(target, 'send', [
            {
              content: this.evalMessage(data.message, cache),
              files: [new DiscordJS.MessageAttachment(buffer, 'image.png')],
            },
          ])
            .then((msg) => {
              this.storeValue(msg, storage2, varName3, cache);
              this.callNextAction(cache);
            })
            .catch((err) => this.displayError(data, cache, err));
        } else if (target?.send) {
          target
            .send({
              content: this.evalMessage(data.message, cache),
              files: [new DiscordJS.MessageAttachment(buffer, 'image.png')],
            })
            .then((msg) => {
              this.storeValue(msg, storage2, varName3, cache);
              this.callNextAction(cache);
            })
            .catch((err) => this.displayError(data, cache, err));
        }
      })
      .catch((err) => this.displayError(data, cache, err));
  },

  // ---------------------------------------------------------------------
  // Action Bot Mod
  // ---------------------------------------------------------------------

  mod() {},
};
