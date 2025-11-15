module.exports = {
  //---------------------------------------------------------------------
  // Action Name
  //---------------------------------------------------------------------

  name: 'Multi-Check Variable',

  //---------------------------------------------------------------------
  // Action Section
  //---------------------------------------------------------------------

  section: 'Conditions',

  //---------------------------------------------------------------------
  // Action Subtitle
  //---------------------------------------------------------------------

  subtitle(data, presets) {
    return `Check ${presets.getVariableText(data.storage, data.varName)} with ${data.branches.length} Branches`;
  },

  //---------------------------------------------------------------------
  // Action Meta Data
  //---------------------------------------------------------------------

  meta: {
    version: '2.2.0',
    preciseCheck: true,
    author: null,
    authorUrl: null,
    downloadUrl: 'https://github.com/DBM-POLSKA/DBM-14/blob/main/bot-files/actions/multi_check_variable.js',
  },

  //---------------------------------------------------------------------
  // Action Fields
  //---------------------------------------------------------------------

  fields: ['storage', 'varName', 'branches'],

  //---------------------------------------------------------------------
  // Command HTML
  //---------------------------------------------------------------------

  html(isEvent, data) {
    return `
<retrieve-from-variable allowSlashParams dropdownLabel="Variable" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></retrieve-from-variable>

<br><br><br><br>

<dialog-list id="branches" fields='["comparison", "value", "actions"]' dialogResizable dialogTitle="Check Variable Info" dialogWidth="600" dialogHeight="400" listLabel="Comparisons and Actions" listStyle="height: calc(100vh - 290px);" itemName="Condition" itemHeight="28px;" itemTextFunction="glob.formatItem(data)" itemStyle="line-height: 28px;">
  <div style="padding: 16px;">
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
      </select>
    </div>
    <div style="float: right; width: 60%;">
      <span class="dbminputlabel">Value to Compare to</span><br>
      <input id="value" class="round" type="text" name="is-eval">
    </div>

    <br><br><br><br>

    <action-list-input id="actions" height="calc(100vh - 220px)"></action-list-input>

  </div>
</dialog-list>`;
  },

  //---------------------------------------------------------------------
  // Action Editor Init Code
  //---------------------------------------------------------------------

  init() {
    const { glob } = this;

    glob.formatItem = function (data) {
      let result = '<div style="display: inline-block; width: 200px; padding-left: 8px;">VAR ';
      const comp = data.comparison;
      switch (comp) {
        case '0':
          result += 'Exists';
          break;
        case '1':
          result += '= ' + data.value;
          break;
        case '2':
          result += '= ' + data.value;
          break;
        case '3':
          result += '< ' + data.value;
          break;
        case '4':
          result += '> ' + data.value;
          break;
        case '5':
          result += 'Includes ' + data.value;
          break;
        case '6':
          result += 'Matches Regex ' + data.value;
          break;
      }
      result += '</div><span>Call ' + data.actions.length + ' Actions</span>';
      return result;
    };
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
    if (variable) {
      const val1 = variable;
      const branches = data.branches;
      for (let i = 0; i < branches.length; i++) {
        const branch = branches[i];
        const compare = parseInt(branch.comparison, 10);
        let val2 = branch.value;
        if (compare !== 6) val2 = this.evalIfPossible(val2, cache);
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
            if (typeof val1.includes === 'function') {
              result = val1.includes(val2);
            }
            break;
          case 6:
            result = Boolean(val1.match(new RegExp('^' + val2 + '$', 'i')));
            break;
        }
        if (result) {
          this.executeSubActionsThenNextAction(branch.actions, cache);
          break;
        }
      }
    }
    if (!result) {
      this.callNextAction(cache);
    }
  },

  //---------------------------------------------------------------------
  // Action Bot Mod Init
  //---------------------------------------------------------------------

  modInit(data) {
    if (Array.isArray(data?.branches)) {
      for (let i = 0; i < data.branches.length; i++) {
        const branch = data.branches[i];
        this.prepareActions(branch.actions);
      }
    }
  },

  //---------------------------------------------------------------------
  // Action Bot Mod
  //---------------------------------------------------------------------

  mod() {},
};
