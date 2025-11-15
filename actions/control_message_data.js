module.exports = {
  //---------------------------------------------------------------------
  // Action Name
  //---------------------------------------------------------------------

  name: 'Control Message Data',

  //---------------------------------------------------------------------
  // Action Section
  //---------------------------------------------------------------------

  section: 'Data',

  //---------------------------------------------------------------------
  // Action Subtitle
  //---------------------------------------------------------------------

  subtitle(data, presets) {
    return `${presets.getMessageText(data.message, data.varName)} (${data.dataName}) ${
      data.changeType === '1' ? '+=' : '='
    } ${data.value}`;
  },

  //---------------------------------------------------------------------
  // Action Meta Data
  //---------------------------------------------------------------------

  meta: {
    version: '2.2.0',
    preciseCheck: true,
    author: null,
    authorUrl: null,
    downloadUrl: 'https://github.com/DBM-POLSKA/DBM-14/blob/main/bot-files/actions/control_message_data.js',
  },

  //---------------------------------------------------------------------
  // Action Fields
  //---------------------------------------------------------------------

  fields: ['message', 'varName', 'dataName', 'changeType', 'value'],

  //---------------------------------------------------------------------
  // Command HTML
  //---------------------------------------------------------------------

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
		<span class="dbminputlabel">Control Type</span><br>
		<select id="changeType" class="round">
			<option value="0" selected>Set Value</option>
			<option value="1">Add Value</option>
		</select>
	</div>
</div>

<br><br><br>

<div style="padding-top: 8px;">
	<span class="dbminputlabel">Value</span><br>
	<input id="value" class="round" type="text" name="is-eval"><br>
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
    const message = await this.getMessageFromData(data.message, data.varName, cache);

    if (message?.setData) {
      const dataName = this.evalMessage(data.dataName, cache);
      const isAdd = data.changeType === '1';
      let val = this.evalMessage(data.value, cache);
      try {
        val = this.eval(val, cache);
      } catch (e) {
        this.displayError(data, cache, e);
      }
      if (val !== undefined) {
        if (isAdd) {
          message.addData(dataName, val);
        } else {
          message.setData(dataName, val);
        }
      }
    }
    this.callNextAction(cache);
  },

  //---------------------------------------------------------------------
  // Action Bot Mod
  //---------------------------------------------------------------------

  mod() {},
};
