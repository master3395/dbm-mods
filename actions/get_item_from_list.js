module.exports = {
  // ---------------------------------------------------------------------
  // Action Name
  // ---------------------------------------------------------------------

  name: 'Get Item from List',

  // ---------------------------------------------------------------------
  // Action Section
  // ---------------------------------------------------------------------

  section: 'Lists and Loops',

  // ---------------------------------------------------------------------
  // Action Subtitle
  // ---------------------------------------------------------------------

  subtitle(data, presets) {
    const list = presets.lists;
    return `Get Item from ${list[parseInt(data.list, 10)]}`;
  },

  // ---------------------------------------------------------------------
  // Action Storage Function
  // ---------------------------------------------------------------------

  variableStorage(data, varType) {
    const type = parseInt(data.storage, 10);
    if (type !== varType) return;
    const list = parseInt(data.list, 10);
    let dataType = 'Unknown Type';
    switch (list) {
      case 0:
        dataType = 'Server Member';
        break;
      case 1:
        dataType = 'Channel';
        break;
      case 2:
      case 5:
      case 6:
        dataType = 'Role';
        break;
      case 3:
        dataType = 'Emoji';
        break;
      case 4:
        dataType = 'Server';
        break;
    }
    return [data.varName2, dataType];
  },

  // ---------------------------------------------------------------------
  // Action Meta Data
  // ---------------------------------------------------------------------

  meta: {
    version: '2.2.0',
    preciseCheck: true,
    author: null,
    authorUrl: null,
    downloadUrl: 'https://github.com/DBM-POLSKA/DBM-14/blob/main/bot-files/actions/get_item_from_list.js',
  },

  // ---------------------------------------------------------------------
  // Action Fields
  // ---------------------------------------------------------------------

  fields: ['list', 'varName', 'getType', 'position', 'storage', 'varName2'],

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

<div style="padding-top: 8px;">
	<div style="float: left; width: 45%;">
		<span class="dbminputlabel">Item to Store</span><br>
		<select id="getType" class="round" onchange="glob.onChange1(this)">
			<option value="0" selected>First Item</option>
			<option value="1">Last Item</option>
			<option value="2">Random Item</option>
			<option value="3">Item at Position</option>
		</select>
	</div>
	<div id="positionHolder" style="float: right; width: 50%; display: none;">
		<span class="dbminputlabel">Position</span><br>
		<input id="position" class="round" type="text"><br>
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

    glob.onChange1 = function (event) {
      const value = parseInt(event.value, 10);
      const dom = document.getElementById('positionHolder');
      if (value < 3) {
        dom.style.display = 'none';
      } else {
        dom.style.display = null;
      }
    };

    glob.listChange(document.getElementById('list'), 'varNameContainer');
    glob.onChange1(document.getElementById('getType'));
  },

  // ---------------------------------------------------------------------
  // Action Bot Function
  // ---------------------------------------------------------------------

  async action(cache) {
    const data = cache.actions[cache.index];
    const list = await this.getListFromData(data.list, data.varName, cache);

    const type = parseInt(data.getType, 10);
    let result;
    switch (type) {
      case 0:
        result = list[0];
        break;
      case 1:
        result = list[list.length - 1];
        break;
      case 2:
        result = list[Math.floor(Math.random() * list.length)];
        break;
      case 3: {
        const position = parseInt(this.evalMessage(data.position, cache), 10);
        if (position < 0) {
          result = list[0];
        } else if (position >= list.length) {
          result = list[list.length - 1];
        } else {
          result = list[position];
        }
        break;
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
