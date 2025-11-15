module.exports = {
  //---------------------------------------------------------------------
  // Action Name
  //---------------------------------------------------------------------

  name: 'Transform List',

  //---------------------------------------------------------------------
  // Action Section
  //---------------------------------------------------------------------

  section: 'Lists and Loops',

  //---------------------------------------------------------------------
  // Action Subtitle
  //---------------------------------------------------------------------

  subtitle(data, presets) {
    const list = presets.lists;
    return `Transform ${list[parseInt(data.list, 10)]}`;
  },

  //---------------------------------------------------------------------
  // Action Storage Function
  //---------------------------------------------------------------------

  variableStorage(data, varType) {
    const type = parseInt(data.storage, 10);
    if (type !== varType) return;
    return [data.varName2, 'List'];
  },

  //---------------------------------------------------------------------
  // Action Meta Data
  //---------------------------------------------------------------------

  meta: {
    version: '2.2.0',
    preciseCheck: true,
    author: null,
    authorUrl: null,
    downloadUrl: 'https://github.com/DBM-POLSKA/DBM-14/blob/main/bot-files/actions/transform_list.js',
  },

  //---------------------------------------------------------------------
  // Action Fields
  //---------------------------------------------------------------------

  fields: ['list', 'varName', 'transform', 'null', 'storage', 'varName2'],

  //---------------------------------------------------------------------
  // Command HTML
  //---------------------------------------------------------------------

  html(isEvent, data) {
    return `
<div>
	<div style="float: left; width: 35%;">
		Source List:<br>
		<select id="list" class="round" onchange="glob.listChange(this, 'varNameContainer')">
			${data.lists[isEvent ? 1 : 0]}
		</select>
	</div>
	<div id="varNameContainer" style="display: none; float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName" class="round" type="text" list="variableList">
	</div>
</div>

<br><br><br><br>

<div style="display: table; width: 100%;">
	<div style="display: table-cell;">
		<span class="dbminputlabel">Transform Eval</span>
		<input id="transform" class="round" type="text" name="is-eval" value="item">
	</div>
	<div style="display: table-cell;">
		<span class="dbminputlabel">Null Value</span>
		<input id="null" class="round" type="text" name="is-eval">
	</div>
</div>

<br>

<store-in-variable style="padding-top: 8px;" dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer2" variableInputId="varName2"></store-in-variable>`;
  },

  //---------------------------------------------------------------------
  // Action Editor Init Code
  //---------------------------------------------------------------------

  init() {
    const { glob, document } = this;

    glob.listChange(document.getElementById('list'), 'varNameContainer');
  },

  //---------------------------------------------------------------------
  // Action Bot Function
  //---------------------------------------------------------------------

  async action(cache) {
    const data = cache.actions[cache.index];
    const list = await this.getListFromData(data.list, data.varName, cache);

    let result = [];
    const code = this.evalMessage(data.transform, cache);
    const nullVal = this.evalMessage(data.null, cache);
    let defaultVal;

    try {
      defaultVal = eval(nullVal);
    } catch (e) {
      this.displayError(data, cache, e);
      defaultVal = '';
    }

    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      try {
        const val = eval(code);
        if (val) {
          result.push(val);
        } else if (defaultVal) {
          result.push(defaultVal);
        }
      } catch (e) {
        this.displayError(data, cache, e);
        if (defaultVal) {
          result.push(defaultVal);
        }
      }
    }

    if (result) {
      const varName2 = this.evalMessage(data.varName2, cache);
      const storage2 = parseInt(data.storage, 10);
      this.storeValue(result, storage2, varName2, cache);
    }

    this.callNextAction(cache);
  },

  //---------------------------------------------------------------------
  // Action Bot Mod
  //---------------------------------------------------------------------

  mod() {},
};
