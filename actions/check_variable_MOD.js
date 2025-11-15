const isImageUrl = require('is-image-url');
const isUrl = require('is-url');

module.exports = {
  // ---------------------------------------------------------------------
  // Action Name
  // ---------------------------------------------------------------------

  name: 'Check Variable Plus',

  // ---------------------------------------------------------------------
  // Action Section
  // ---------------------------------------------------------------------

  section: 'Conditions',

  // ---------------------------------------------------------------------
  // Action Subtitle
  // ---------------------------------------------------------------------

  subtitle(data, presets) {
    return `${presets.getConditionsText(data)}`;
  },

  // ---------------------------------------------------------------------
  // Action Meta Data
  // ---------------------------------------------------------------------

  meta: {
    version: '2.2.0',
    preciseCheck: true,
    author: 'Shadow',
    authorUrl: 'https://github.com/DBM-POLSKA',
    downloadUrl: 'https://github.com/DBM-POLSKA/DBM-14/blob/main/mods/actions/check_variable_plus_MOD.js',
  },

  // ---------------------------------------------------------------------
  // Action Fields
  // ---------------------------------------------------------------------

  fields: ['storage', 'varName', 'comparison', 'value', 'value2', 'branch'],

  // ---------------------------------------------------------------------
  // Command HTML
  // ---------------------------------------------------------------------

  html(isEvent, data) {
    void isEvent;
    void data;
    return `
<div style="position:fixed;bottom:0;left:0;padding:5px;padding-top:5px;padding-bottom:5px;font:13px sans-serif;border-radius:10px;background:rgba(0,0,0,0.7);color:#999;border:1px solid rgba(50,50,50,.7);z-index:999999;opacity:0.5;transition:all .3s" onmouseover="this.style.opacity='1';this.style.borderColor='gray'" onmouseout="this.style.opacity='0.5';this.style.borderColor='rgba(50,50,50,.7)'">Creator: Shadow<br><br>Help: <a href='https://discord.gg/9HYB4n3Dz4' target='_blank' style='color:#07f;text-decoration:none'>Discord</a></div><div style="position:fixed;bottom:0;right:0;padding:5px;font:20px sans-serif;border-radius:10px;background:rgba(0,0,0,0.7);color:#999;border:1px solid rgba(50,50,50,.7);z-index:999999;opacity:0.5;transition:all .3s" onmouseover="this.style.opacity='1';this.style.borderColor='gray'" onmouseout="this.style.opacity='0.5';this.style.borderColor='rgba(50,50,50,.7)'"><a href='https://dbm-polska.github.io/DBM-14/' target='_blank' style='color:#07f;text-decoration:none'><!--Version-->1.0</a></div>

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
      <option value="4">Less than or equal to</option>
			<option value="5">Greater Than</option>
      <option value="6">Greater than or equal to</option>
			<option value="7">Includes</option>
			<option value="8">Matches Regex</option>
      <option value="9">Matches Full Regex</option>
			<option value="10">Starts With</option>
			<option value="11">Ends With</option>
			<option value="12">Length is Equals</option>
			<option value="13">Length is Greater Than</option>
			<option value="14">Length is Less Than</option>
      <option value="15">Between</option>
      <option value="16">Does it have accents?</option>
      <option value="17">Includes the words ["a" , "b" , "c"]</option>
      <option value="18">Equals the words ["a" , "b" , "c"]</option>
      <option value="19">Is it an even number?</option>
      <option value="20">Is it an odd number?</option>
      <option value="21">Is it a number?</option>
      <option value="24">Is it text?</option>
      <option value="22">Is it a list?</option>
      <option value="23">Is this an image URL?</option>
      <option value="25">Is it a URL?</option>
      <option value="26">Is a number (only digits)</option>
		</select>
	</div>

	<table style="float: right;width: 60%;"><tr><td style="padding:0px 8px"><div style="width: 100%" id="directValue">
		<span class="dbminputlabel">Value to compare</span>
		<input id="value" class="round" type="text">
	</div></td><td style="padding:0px 3px";> <div style="width: 100%;" id="containerxin">
  <span class="dbminputlabel">and</span><br>
  <input id="value2" class="round" type="text"></td></tr></table>
  </div>
 </div>
</div>

<br><br><br><br>
<hr class="subtlebar">
<br>
<conditional-input id="branch" style="padding-top: 8px;"></conditional-input>`;
  },

  // ---------------------------------------------------------------------
  // Action Editor Pre-Init Code
  // ---------------------------------------------------------------------

  preInit(data, formatters) {
    return formatters.compatibility_2_0_0_iftruefalse_to_branch(data);
  },

  // ---------------------------------------------------------------------
  // Action Editor Init Code
  // ---------------------------------------------------------------------

  init() {
    const { glob, document } = this;

    glob.onComparisonChanged = function onComparisonChanged(event) {
      if (event.value === '0') {
        document.getElementById('directValue').style.display = 'none';
        document.getElementById('containerxin').style.display = 'none';
      } else {
        document.getElementById('directValue').style.display = null;
        document.getElementById('containerxin').style.display = 'none';
      }
      if (event.value === '15') {
        document.getElementById('directValue').style.display = null;
        document.getElementById('containerxin').style.display = null;
      }
      if (
        event.value === '16' ||
        event.value === '19' ||
        event.value === '20' ||
        event.value === '21' ||
        event.value === '22' ||
        event.value === '23' ||
        event.value === '24' ||
        event.value === '25'
      ) {
        document.getElementById('directValue').style.display = 'none';
        document.getElementById('containerxin').style.display = 'none';
      }
    };

    glob.onComparisonChanged(document.getElementById('comparison'));
  },

  // ---------------------------------------------------------------------
  // Action Bot Function
  // ---------------------------------------------------------------------

  action(cache) {
    const data = cache.actions[cache.index];
    const type = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);
    const variable = this.getVariable(type, varName, cache);
    let result = false;

    const val1 = variable;
    const compare = parseInt(data.comparison, 10);
    let val2 = this.evalMessage(data.value, cache);
    const val3 = this.evalMessage(data.value2, cache);

    if (compare !== 6) val2 = this.evalIfPossible(val2, cache);

    if (val2 === 'true') val2 = true;
    if (val2 === 'false') val2 = false;

    /* eslint-disable eqeqeq */
    const isLooselyEqual = (a, b) => a == b;
    /* eslint-enable eqeqeq */

    switch (compare) {
      case 0: // Exists
        result = val1 !== undefined;
        break;
      case 1: // Equals
        result = isLooselyEqual(val1, val2);
        break;
      case 2: // Equals Exactly
        result = val1 === val2;
        break;
      case 3: // Less Than
        result = val1 < val2;
        break;
      case 4: // Less than or equal to
        result = Number(val1) <= Number(val2);
        break;
      case 5: // Greater Than
        result = val1 > val2;
        break;
      case 6: // Greater than or equal to
        result = Number(val1) >= Number(val2);
        break;
      case 7: {
        // Includes
        let includesVal1 = val1;
        if (typeof includesVal1 !== 'string' && !Array.isArray(includesVal1)) {
          includesVal1 = String(includesVal1);
        }
        if (typeof includesVal1?.includes === 'function') {
          result = includesVal1.includes(val2);
        }
        break;
      }
      case 8: // Matches Regex
        if (typeof val1?.match === 'function') {
          result = Boolean(val1.match(new RegExp(`^${val2}$`, 'i')));
        }
        break;
      case 9: // Matches Full Regex
        result = Boolean(val1.toString().match(new RegExp(val2)));
        break;
      case 10: // Starts With
        if (typeof val1?.startsWith === 'function') {
          result = Boolean(val1.startsWith(val2));
        }
        break;
      case 11: // Ends With
        if (typeof val1?.endsWith === 'function') {
          result = Boolean(val1.endsWith(val2));
        }
        break;
      case 12: // Length is Equals
        if (typeof val1?.length === 'number') {
          result = Boolean(val1.length === val2);
        }
        break;
      case 13: // Length is Greater Than
        if (typeof val1?.length === 'number') {
          result = Boolean(val1.length > val2);
        }
        break;
      case 14: // Length is Less Than
        if (typeof val1?.length === 'number') {
          result = Boolean(val1.length < val2);
        }
        break;
      case 15: {
        // Between
        const numberValue = Number(val1);
        const lowerBound = Number(val2);
        const upperBound = Number(val3);
        if (!Number.isNaN(numberValue) && !Number.isNaN(lowerBound) && !Number.isNaN(upperBound)) {
          result = numberValue >= lowerBound && numberValue <= upperBound;
        }
        break;
      }
      case 16: // Does it have accents?
        result = /[^\u0000-\u007F]/.test(val1);
        break;
      case 17: {
        // Includes the words ["a","b","c"]
        const source = typeof val1 === 'string' ? val1 : String(val1 ?? '');
        const conditionsX = Array.isArray(val2) ? val2 : [];
        result = conditionsX.some((els) => source.includes(els));
        break;
      }
      case 18: {
        // Equals the words ["a","b","c"]
        const conditionsZ = Array.isArray(val2) ? val2 : [];
        result = conditionsZ.some((elz) => isLooselyEqual(val1, elz));
        break;
      }
      case 19: {
        // Is it an even number
        const numericVal = Number(val1);
        result = !Number.isNaN(numericVal) && numericVal % 2 === 0;
        break;
      }
      case 20: {
        // Is it an odd number
        const numericVal = Number(val1);
        result = !Number.isNaN(numericVal) && Math.abs(numericVal % 2) === 1;
        break;
      }
      case 21: // Is it a number
        result = Boolean(!isNaN(parseFloat(val1.toString().replace(',', '.'))));
        break;
      case 22: // Is it a list
        result = Boolean(Array.isArray(val1));
        break;
      case 23: {
        // Is this an image URL
        result = isImageUrl(val1);
        break;
      }
      case 24: // Is it text
        result = typeof val1 === 'string';
        break;
      case 25: {
        // Is it a URL
        result = isUrl(val1);
        break;
      }
      case 26: // Is a number (only digits)
        result = /^\d+$/.test(val1);
        break;
    }
    this.executeResults(result, data?.branch ?? data, cache);
  },

  // ---------------------------------------------------------------------
  // Action Bot Mod Init
  // ---------------------------------------------------------------------

  modInit(data) {
    this.prepareActions(data.branch?.iftrueActions);
    this.prepareActions(data.branch?.iffalseActions);
  },

  // ---------------------------------------------------------------------
  // Action Bot Mod
  // ---------------------------------------------------------------------

  mod() {},
};
