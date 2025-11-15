module.exports = {
  // ---------------------------------------------------------------------
  // Action Name
  // ---------------------------------------------------------------------

  name: 'Add Item to List',

  // ---------------------------------------------------------------------
  // Action Section
  // ---------------------------------------------------------------------

  section: 'Lists and Loops',

  // ---------------------------------------------------------------------
  // Action Subtitle
  // ---------------------------------------------------------------------

  subtitle(data, presets) {
    const storage = presets.variables;
    return `Add "${data.value}" to ${storage[parseInt(data.storage, 10)]} (${data.varName})`;
  },

  // ---------------------------------------------------------------------
  // Action Meta Data
  // ---------------------------------------------------------------------

  meta: {
    version: '2.2.0',
    preciseCheck: true,
    author: null,
    authorUrl: null,
    downloadUrl: 'https://github.com/DBM-POLSKA/DBM-14/blob/main/bot-files/actions/add_item_to_list.js',
  },

  // ---------------------------------------------------------------------
  // Action Fields
  // ---------------------------------------------------------------------

  fields: ['storage', 'varName', 'addType', 'position', 'value'],

  // ---------------------------------------------------------------------
  // Command HTML
  // ---------------------------------------------------------------------

  html(isEvent, data) {
    void isEvent;
    void data;
    return `
<retrieve-from-variable dropdownLabel="Source List" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></retrieve-from-variable>

<br><br><br>

<div style="padding-top: 8px;">
	<div style="float: left; width: 45%;">
		<span class="dbminputlabel">Add Type</span><br>
		<select id="addType" class="round" onchange="glob.onChange1(this)">
			<option value="0" selected>Add to End</option>
			<option value="1">Add to Front</option>
			<option value="2">Add to Specific Position</option>
		</select>
	</div>
	<div id="positionHolder" style="float: right; width: 50%; display: none;">
		<span class="dbminputlabel">Position</span><br>
		<input id="position" class="round" type="text"><br>
	</div>
</div>

<br><br><br>

<div style="padding-top: 8px;">
	<span class="dbminputlabel">Value</span><br>
	<input id="value" class="round" type="text" name="is-eval">
</div>`;
  },

  // ---------------------------------------------------------------------
  // Action Editor Init Code
  // ---------------------------------------------------------------------

  init() {
    const { glob, document } = this;

    glob.onChange1 = function onChangeListPosition(event) {
      const value = parseInt(event.value, 10);
      const dom = document.getElementById('positionHolder');
      if (value < 2) {
        dom.style.display = 'none';
      } else {
        dom.style.display = null;
      }
    };

    glob.onChange1(document.getElementById('addType'));
  },

  // ---------------------------------------------------------------------
  // Action Bot Function
  // ---------------------------------------------------------------------

  action(cache) {
    const data = cache.actions[cache.index];
    const storage = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);
    const list = this.getVariable(storage, varName, cache);

    const type = parseInt(data.addType, 10);
    let val = this.evalMessage(data.value, cache);
    try {
      val = this.eval(val, cache);
    } catch (e) {
      this.displayError(data, cache, e);
    }

    switch (type) {
      case 0:
        list.push(val);
        break;
      case 1:
        list.unshift(val);
        break;
      case 2: {
        const position = parseInt(this.evalMessage(data.position, cache), 10);
        if (position < 0) {
          list.unshift(val);
        } else if (position >= list.length) {
          list.push(val);
        } else {
          list.splice(position, 0, val);
        }
        break;
      }
    }

    this.callNextAction(cache);
  },

  // ---------------------------------------------------------------------
  // Action Bot Mod
  // ---------------------------------------------------------------------

  mod() {},
};
