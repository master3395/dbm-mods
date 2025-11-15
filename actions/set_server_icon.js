module.exports = {
  //---------------------------------------------------------------------
  // Action Name
  //---------------------------------------------------------------------

  name: 'Set Server Icon',

  //---------------------------------------------------------------------
  // Action Section
  //---------------------------------------------------------------------

  section: 'Server Control',

  //---------------------------------------------------------------------
  // Action Subtitle
  //---------------------------------------------------------------------

  subtitle(data, presets) {
    const storeTypes = presets.variables;
    return `${presets.getServerText(data.server, data.varName)} - ${storeTypes[parseInt(data.storage, 10)]} (${
      data.varName2
    })`;
  },

  //---------------------------------------------------------------------
  // Action Meta Data
  //---------------------------------------------------------------------

  meta: {
    version: '2.2.0',
    preciseCheck: true,
    author: null,
    authorUrl: null,
    downloadUrl: 'https://github.com/DBM-POLSKA/DBM-14/blob/main/bot-files/actions/set_server_icon.js',
  },

  //---------------------------------------------------------------------
  // Action Fields
  //---------------------------------------------------------------------

  fields: ['server', 'varName', 'storage', 'varName2', 'reason'],

  //---------------------------------------------------------------------
  // Command HTML
  //---------------------------------------------------------------------

  html(isEvent, data) {
    return `
<server-input dropdownLabel="Server" selectId="server" variableContainerId="varNameContainer" variableInputId="varName"></server-input>

<br><br><br>

<store-in-variable style="padding-top: 8px;" dropdownLabel="Source Image" selectId="storage" variableContainerId="varNameContainer2" variableInputId="varName2"></store-in-variable>

<br><br><br><br>

<hr class="subtlebar">

<br>

<div style="padding-top: 8px;">
  <span class="dbminputlabel">Reason</span>
  <input id="reason" placeholder="Optional" class="round" type="text">
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
    const { Images } = this.getDBM();
    const server = await this.getServerFromData(data.server, data.varName, cache);
    const reason = this.evalMessage(data.reason, cache);

    if (!Array.isArray(server) && !server?.setIcon) {
      return this.callNextAction(cache);
    }

    const varName2 = this.evalMessage(data.varName2, cache);
    const image = this.getVariable(parseInt(data.storage, 10), varName2, cache);
    Images.createBuffer(image)
      .then((buffer) => {
        if (Array.isArray(server)) {
          this.callListFunc(server, 'setIcon', [buffer, reason]).then(() => this.callNextAction(cache));
        } else {
          server
            .setIcon(buffer, reason)
            .then(() => this.callNextAction(cache))
            .catch((err) => this.displayError(data, cache, err));
        }
      })
      .catch((err) => this.displayError(data, cache, err));
  },

  //---------------------------------------------------------------------
  // Action Bot Mod
  //---------------------------------------------------------------------

  mod() {},
};
