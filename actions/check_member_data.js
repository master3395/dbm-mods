module.exports = {
  //---------------------------------------------------------------------
  // Action Name
  //---------------------------------------------------------------------

  name: 'Check Member Data',

  //---------------------------------------------------------------------
  // Action Section
  //---------------------------------------------------------------------

  section: 'Data',

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
    downloadUrl: 'https://github.com/DBM-POLSKA/DBM-14/blob/main/bot-files/actions/check_member_data.js',
  },

  //---------------------------------------------------------------------
  // Action Fields
  //---------------------------------------------------------------------

  fields: ['member', 'varName', 'dataName', 'comparison', 'value', 'branch'],

  //---------------------------------------------------------------------
  // Command HTML
  //---------------------------------------------------------------------

  html(isEvent, data) {
    return `
<member-input dropdownLabel="Member" selectId="member" variableContainerId="varNameContainer" variableInputId="varName"></member-input>

<br><br><br>

<div style="padding-top: 8px;">
	<div style="float: left; width: calc(50% - 12px);">
		<span class="dbminputlabel">Data Name</span><br>
		<input id="dataName" class="round" type="text">
	</div>
	<div style="float: right; width: calc(50% - 12px);">
		<span class="dbminputlabel">Comparison Type</span><br>
		<select id="comparison" class="round">
			<option value="0">Exists</option>
			<option value="1" selected>Equals</option>
			<option value="2">Equals Exactly</option>
			<option value="3">Less Than</option>
			<option value="4">Greater Than</option>
			<option value="5">Includes</option>
			<option value="6">Matches Regex</option>
		</select>
	</div>
</div>

<br><br><br>

<div style="padding-top: 8px;">
	<span class="dbminputlabel">Value to Compare to</span><br>
	<input id="value" class="round" type="text" name="is-eval">
</div>

<br>

<hr class="subtlebar">

<conditional-input id="branch" style="padding-top: 16px;"></conditional-input>`;
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

  init() {},

  //---------------------------------------------------------------------
  // Action Bot Function
  //---------------------------------------------------------------------

  async action(cache) {
    const data = cache.actions[cache.index];
    const member = await this.getMemberFromData(data.member, data.varName, cache);
    let result = false;
    if (member?.data) {
      const dataName = this.evalMessage(data.dataName, cache);
      const val1 = member.data(dataName);
      const compare = parseInt(data.comparison, 10);
      let val2 = this.evalMessage(data.value, cache);
      if (compare !== 6) val2 = this.eval(val2, cache);
      if (val2 === false) val2 = this.evalMessage(data.value, cache);
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
          result = Boolean(val1.match(new RegExp(`^${val2}$`, 'i')));
          break;
      }
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
