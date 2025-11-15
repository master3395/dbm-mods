module.exports = {
  // ---------------------------------------------------------------------
  // Action Name
  // ---------------------------------------------------------------------

  name: 'Store Message Data',

  // ---------------------------------------------------------------------
  // Action Section
  // ---------------------------------------------------------------------

  section: 'Data',

  // ---------------------------------------------------------------------
  // Action Subtitle
  // ---------------------------------------------------------------------

  subtitle(data, presets) {
    return `${presets.getMessageText(data.message, data.varName)} -> ${presets.getVariableText(
      data.storage,
      data.varName2,
    )}`;
  },

  // ---------------------------------------------------------------------
  // Action Storage Function
  // ---------------------------------------------------------------------

  variableStorage(data, varType) {
    const type = parseInt(data.storage, 10);
    if (type !== varType) return;
    return [data.varName2, 'Unknown Type'];
  },

  // ---------------------------------------------------------------------
  // Action Meta Data
  // ---------------------------------------------------------------------

  meta: {
    version: '2.2.0',
    preciseCheck: true,
    author: null,
    authorUrl: null,
    downloadUrl: 'https://github.com/DBM-POLSKA/DBM-14/blob/main/bot-files/actions/store_message_data.js',
  },

  // ---------------------------------------------------------------------
  // Action Fields
  // ---------------------------------------------------------------------

  fields: ['message', 'varName', 'dataName', 'defaultVal', 'storage', 'varName2'],

  // ---------------------------------------------------------------------
  // Command HTML
  // ---------------------------------------------------------------------

  html(isEvent, data) {
    return `
<message-input dropdownLabel="Message" selectId="message" variableContainerId="varNameContainer" variableInputId="varName"></message-input>

<br><br><br>

<div style="padding-top: 8px;">
	<div style="float: left; width: calc(50% - 12px);">
		<span class="dbminputlabel">Data Name</span><br>
		<input id="dataName" class="round" type="text">
	</div>
	<div style="float: right; width: calc(50% - 12px);">
		<span class="dbminputlabel">Default Value (if data doesn't exist)</span><br>
		<input id="defaultVal" class="round" type="text" value="0">
	</div>
</div>

<br><br><br>

<store-in-variable style="padding-top: 8px;" dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer2" variableInputId="varName2"></store-in-variable>`;
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
    const message = await this.getMessageFromData(data.message, data.varName, cache);

    if (message?.data) {
      const dataName = this.evalMessage(data.dataName, cache);
      const defVal = this.eval(this.evalMessage(data.defaultVal, cache), cache);
      let result;
      if (defVal === undefined) {
        result = message.data(dataName);
      } else {
        result = message.data(dataName, defVal);
      }
      this.storeValue(result, parseInt(data.storage, 10), this.evalMessage(data.varName2, cache), cache);
    }
    this.callNextAction(cache);
  },

  // ---------------------------------------------------------------------
  // Action Bot Mod
  // ---------------------------------------------------------------------

  mod() {},
};
