module.exports = {
  //---------------------------------------------------------------------
  // Action Name
  //---------------------------------------------------------------------

  name: 'Delete Sticker',

  //---------------------------------------------------------------------
  // Action Section
  //---------------------------------------------------------------------

  section: 'Emoji/Sticker Control',

  //---------------------------------------------------------------------
  // Action Subtitle
  //---------------------------------------------------------------------

  subtitle(data, presets) {
    const inputTypes = ['Specific Sticker', 'Temp Variable', 'Server Variable', 'Global Variable'];
    return `${inputTypes[parseInt(data.sticker, 10)]} (${data.varName})`;
  },

  //---------------------------------------------------------------------
  // Action Meta Data
  //---------------------------------------------------------------------

  meta: {
    version: '2.2.0',
    preciseCheck: true,
    author: null,
    authorUrl: null,
    downloadUrl: 'https://github.com/DBM-POLSKA/DBM-14/blob/main/bot-files/actions/delete_sticker.js',
  },

  //---------------------------------------------------------------------
  // Action Fields
  //---------------------------------------------------------------------

  fields: ['sticker', 'varName', 'reason'],

  //---------------------------------------------------------------------
  // Command HTML
  //---------------------------------------------------------------------

  html(isEvent, data) {
    return `
<div>
	<div style="float: left; width: 35%;">
		<span class="dbminputlabel">Source Emoji</span><br>
		<select id="sticker" class="round" onchange="glob.onChange1(this)">
			<option value="0" selected>Specific Sticker</option>
			<option value="1">Temp Variable</option>
			<option value="2">Server Variable</option>
			<option value="3">Global Variable</option>
		</select>
	</div>
	<div id="varNameContainer" style="float: right; width: 60%;">
		<span class="dbminputlabel" id="extName">Sticker Name</span><br>
		<input id="varName" class="round" type="text" list="variableList"><br>
	</div>
</div>

<br><br><br>

<div style="padding-top: 12px;">
  <span class="dbminputlabel">Reason</span>
  <input id="reason" placeholder="Optional" class="round" type="text">
</div>`;
  },

  //---------------------------------------------------------------------
  // Action Editor Init Code
  //---------------------------------------------------------------------

  init() {
    const { glob, document } = this;

    glob.onChange1 = function (event) {
      const value = parseInt(event.value, 10);
      const varNameInput = document.getElementById('extName');
      if (value === 0) {
        varNameInput.innerHTML = 'Sticker Name';
      } else {
        varNameInput.innerHTML = 'Variable Name';
      }
    };

    glob.onChange1(document.getElementById('sticker'));
  },

  //---------------------------------------------------------------------
  // Action Bot Function
  //---------------------------------------------------------------------

  action(cache) {
    const data = cache.actions[cache.index];
    const server = cache.server;
    const type = parseInt(data.sticker, 10);
    const reason = this.evalMessage(data.reason, cache);
    const varName = this.evalMessage(data.varName, cache);
    let sticker;
    if (type === 0) {
      sticker = server.stickers.cache.find((e) => e.name === varName);
    } else {
      sticker = this.getVariable(type, varName, cache);
    }
    if (!sticker) return this.callNextAction(cache);
    if (sticker?.delete) {
      sticker
        .delete(reason)
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
