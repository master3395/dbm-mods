module.exports = {
  // ---------------------------------------------------------------------
  // Action Name
  // ---------------------------------------------------------------------

  name: 'Run Script',

  // ---------------------------------------------------------------------
  // Action Section
  // ---------------------------------------------------------------------

  section: 'Other Stuff',

  // ---------------------------------------------------------------------
  // Action Subtitle
  // ---------------------------------------------------------------------

  subtitle(data, presets) {
    return `${data.code}`;
  },

  // ---------------------------------------------------------------------
  // Action Storage Function
  // ---------------------------------------------------------------------

  variableStorage(data, varType) {
    const type = parseInt(data.storage, 10);
    if (type !== varType) return;
    return [data.varName, 'Unknown Type'];
  },

  // ---------------------------------------------------------------------
  // Action Meta Data
  // ---------------------------------------------------------------------

  meta: {
    version: '2.2.0',
    preciseCheck: true,
    author: null,
    authorUrl: null,
    downloadUrl: 'https://github.com/DBM-POLSKA/DBM-14/blob/main/bot-files/actions/run_script.js',
  },

  // ---------------------------------------------------------------------
  // Action Fields
  // ---------------------------------------------------------------------

  fields: ['behavior', 'interpretation', 'code', 'storage', 'varName'],

  // ---------------------------------------------------------------------
  // Command HTML
  // ---------------------------------------------------------------------

  html(isEvent, data) {
    return `
<div>
	<div style="float: left; width: 45%;">
		<span class="dbminputlabel">End Behavior</span><br>
		<select id="behavior" class="round">
			<option value="0" selected>Call Next Action Automatically</option>
			<option value="1">Do Not Call Next Action</option>
		</select>
	</div>
	<div style="padding-left: 5%; float: left; width: 55%;">
		<span class="dbminputlabel">Interpretation Style</span><br>
		<select id="interpretation" class="round">
			<option value="0" selected>Evaluate Text First</option>
			<option value="1">Evaluate Text Directly</option>
		</select>
	</div>
</div>

<br><br><br>

<div style="padding-top: 8px;">
	<span class="dbminputlabel">Custom Code</span><br>
	<textarea id="code" rows="9" name="is-eval" style="white-space: nowrap; resize: none;"></textarea>
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
    let code;
    if (data.interpretation === '0') {
      code = this.evalMessage(data.code, cache);
    } else {
      code = data.code;
    }
    const result = this.eval(code, cache);
    const varName = this.evalMessage(data.varName, cache);
    const storage = parseInt(data.storage, 10);
    this.storeValue(result, storage, varName, cache);
    if (data.behavior === '0') {
      this.callNextAction(cache);
    }
  },

  // ---------------------------------------------------------------------
  // Action Bot Mod
  // ---------------------------------------------------------------------

  mod() {},
};
