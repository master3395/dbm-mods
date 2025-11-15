module.exports = {
  //---------------------------------------------------------------------
  // Action Name
  //---------------------------------------------------------------------

  name: 'Check Variable',

  //---------------------------------------------------------------------
  // Action Section
  //---------------------------------------------------------------------

  section: 'Conditions',

  //---------------------------------------------------------------------
  // Action Subtitle
  //---------------------------------------------------------------------

  subtitle(data, presets) {
    return `${presets.getConditionsText(data)}`;
  },

  //---------------------------------------------------------------------
  // Action Meta Data
  //---------------------------------------------------------------------

  meta: {
    version: '2.2.0',
    preciseCheck: true,
    author: null,
    authorUrl: null,
    downloadUrl: 'https://github.com/DBM-POLSKA/DBM-14/blob/main/bot-files/actions/check_variable.js',
  },

  //---------------------------------------------------------------------
  // Action Fields
  //---------------------------------------------------------------------

  fields: ['storage', 'varName', 'comparison', 'value', 'branch'],

  //---------------------------------------------------------------------
  // Command HTML
  //---------------------------------------------------------------------

  html(isEvent, data) {
    return `
<retrieve-from-variable allowSlashParams dropdownLabel="Variable" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></retrieve-from-variable>

<br><br><br>

<div style="padding-top: 8px;">
	<div style="float: left; width: 35%;">
		<span class="dbminputlabel">Comparison Type</span><br>
		<select id="comparison" class="round" onchange="glob.onComparisonChanged(this)">
			<option value="0">Exists</option>
			<option value="1" selected>Equals</option>
			<option value="2">Equals Exactly</option>
			<option value="3">Less Than</option>
			<option value="4">Greater Than</option>
			<option value="5">Includes</option>
			<option value="6">Matches Regex</option>
			<option value="7">Starts With</option>
			<option value="8">Ends With</option>
			<option value="9">Length Equals</option>
			<option value="10">Length is Greater Than</option>
			<option value="11">Length is Less Than</option>
		</select>
	</div>
	<div style="float: right; width: 60%;" id="directValue">
		<span class="dbminputlabel">Value to Compare to</span><br>
		<input id="value" class="round" type="text" name="is-eval">
	</div>
</div>

<br><br><br><br>

<hr class="subtlebar">

<br>

<conditional-input id="branch" style="padding-top: 8px;"></conditional-input>`;
  },

  //---------------------------------------------------------------------
  // Action Editor Pre-Init Code
  //---------------------------------------------------------------------

  preInit(data, formatters) {
    return formatters.compatibility_2_0_0_iftruefalse_to_branch(data);
  },

  //---------------------------------------------------------------------
  // Action Editor Init Code
  //---------------------------------------------------------------------

  init() {
    const { glob, document } = this;

    glob.onComparisonChanged = function (event) {
      if (event.value === '0') {
        document.getElementById('directValue').style.display = 'none';
      } else {
        document.getElementById('directValue').style.display = null;
      }
    };

    glob.onComparisonChanged(document.getElementById('comparison'));
  },

  //---------------------------------------------------------------------
  // Action Bot Function
  //---------------------------------------------------------------------

  action(cache) {
    const data = cache.actions[cache.index];
    const type = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);
    const variable = this.getVariable(type, varName, cache);
    let result = false;

    const val1 = variable;
    const compare = parseInt(data.comparison, 10);
    let val2 = data.value;

    if (compare !== 6) val2 = this.evalIfPossible(val2, cache);

    if (val2 === 'true') val2 = true;
    if (val2 === 'false') val2 = false;

    switch (compare) {
      case 0:
        result = val1 !== undefined;
        break;
      case 1:
        result = val1 == val2;
        break;
      case 2:
        result = val1 === val2;
        break;
      case 3:
        result = val1 < val2;
        break;
      case 4:
        result = val1 > val2;
        break;
      case 5:
        let includesVal1 = val1;
        if (typeof includesVal1 !== 'string' && !Array.isArray(includesVal1)) {
          includesVal1 = String(includesVal1);
        }
        if (typeof includesVal1?.includes === 'function') {
          result = includesVal1.includes(val2);
        }
        break;
      case 6:
        if (typeof val1?.match === 'function') {
          result = Boolean(val1.match(new RegExp('^' + val2 + '$', 'i')));
        }
        break;
      case 7:
        if (typeof val1?.startsWith === 'function') {
          result = Boolean(val1.startsWith(val2));
        }
        break;
      case 8:
        if (typeof val1?.endsWith === 'function') {
          result = Boolean(val1.endsWith(val2));
        }
        break;
      case 9:
        if (typeof val1?.length === 'number') {
          result = Boolean(val1.length === val2);
        }
        break;
      case 10:
        if (typeof val1?.length === 'number') {
          result = Boolean(val1.length > val2);
        }
        break;
      case 11:
        if (typeof val1?.length === 'number') {
          result = Boolean(val1.length < val2);
        }
        break;
    }
    this.executeResults(result, data?.branch ?? data, cache);
  },

  //---------------------------------------------------------------------
  // Action Bot Mod Init
  //---------------------------------------------------------------------

  modInit(data) {
    this.prepareActions(data.branch?.iftrueActions);
    this.prepareActions(data.branch?.iffalseActions);
  },

  //---------------------------------------------------------------------
  // Action Bot Mod
  //---------------------------------------------------------------------

  mod() {},
};
