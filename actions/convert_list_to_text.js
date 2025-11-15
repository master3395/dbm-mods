module.exports = {
  // ---------------------------------------------------------------------
  // Action Name
  // ---------------------------------------------------------------------

  name: 'Convert List to Text',

  // ---------------------------------------------------------------------
  // Action Section
  // ---------------------------------------------------------------------

  section: 'Lists and Loops',

  // ---------------------------------------------------------------------
  // Action Subtitle
  // ---------------------------------------------------------------------

  subtitle(data, presets) {
    const list = presets.lists;
    return `Convert ${list[parseInt(data.list, 10)]} to Text`;
  },

  // ---------------------------------------------------------------------
  // Action Storage Function
  // ---------------------------------------------------------------------

  variableStorage(data, varType) {
    const type = parseInt(data.storage, 10);
    if (type !== varType) return;
    return [data.varName2, 'Text'];
  },

  // ---------------------------------------------------------------------
  // Action Meta Data
  // ---------------------------------------------------------------------

  meta: {
    version: '2.2.0',
    preciseCheck: true,
    author: null,
    authorUrl: null,
    downloadUrl: 'https://github.com/DBM-POLSKA/DBM-14/blob/main/bot-files/actions/convert_list_to_text.js',
  },

  // ---------------------------------------------------------------------
  // Action Fields
  // ---------------------------------------------------------------------

  fields: ['list', 'varName', 'start', 'middle', 'end', 'storage', 'varName2'],

  // ---------------------------------------------------------------------
  // Command HTML
  // ---------------------------------------------------------------------

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
		<input id="varName" class="round" type="text" list="variableList"><br>
	</div>
</div>

<br><br><br>

<div style="width: 100%; padding-top: 8px;">
	<div style="float: left; width: calc(35% - 12px);">
		<span class="dbminputlabel">Start Characters</span><br>
		<input id="start" class="round" type="text">
	</div>
	<div style="float: left; width: calc(35% - 12px); padding-left: 25px;">
		<span class="dbminputlabel">Middle Characters</span><br>
		<input id="middle" class="round" type="text">
	</div>
	<div style="float: left; width: calc(36% - 12px); padding-left: 25px;">
		<span class="dbminputlabel">End Characters</span><br>
		<input id="end" class="round" type="text" value="\\n">
	</div>
</div>

<br><br><br>

<store-in-variable style="padding-top: 8px;" dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer2" variableInputId="varName2"></store-in-variable>`;
  },

  // ---------------------------------------------------------------------
  // Action Editor Init Code
  // ---------------------------------------------------------------------

  init() {
    const { glob, document } = this;

    glob.listChange(document.getElementById('list'), 'varNameContainer');
  },

  // ---------------------------------------------------------------------
  // Action Bot Function
  // ---------------------------------------------------------------------

  async action(cache) {
    const data = cache.actions[cache.index];
    const list = await this.getListFromData(data.list, data.varName, cache);

    const start = this.evalMessage(data.start, cache).replace('\\n', '\n');
    const middle = this.evalMessage(data.middle, cache).replace('\\n', '\n');
    const end = this.evalMessage(data.end, cache).replace('\\n', '\n');
    let result = '';

    for (let i = 0; i < list.length; i++) {
      if (i === 0) {
        result += start + String(list[i]) + end;
      } else {
        result += start + middle + String(list[i]) + end;
      }
    }

    if (result) {
      const varName2 = this.evalMessage(data.varName2, cache);
      const storage2 = parseInt(data.storage, 10);
      this.storeValue(result, storage2, varName2, cache);
    }

    this.callNextAction(cache);
  },

  // ---------------------------------------------------------------------
  // Action Bot Mod
  // ---------------------------------------------------------------------

  mod() {},
};
