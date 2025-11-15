module.exports = {
  // ---------------------------------------------------------------------
  // Command Only
  // ---------------------------------------------------------------------

  commandOnly: true,

  // ---------------------------------------------------------------------
  // Action Name
  // ---------------------------------------------------------------------

  name: 'Check Parameters',

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
    author: null,
    authorUrl: null,
    downloadUrl: 'https://github.com/DBM-POLSKA/DBM-14/blob/main/bot-files/actions/check_parameters.js',
  },

  // ---------------------------------------------------------------------
  // Action Fields
  // ---------------------------------------------------------------------

  fields: ['condition', 'comparison', 'value', 'branch'],

  // ---------------------------------------------------------------------
  // Command HTML
  // ---------------------------------------------------------------------

  html(isEvent, data) {
    return `
<div>
	<div style="float: left; width: calc(50% - 12px);">
		<span class="dbminputlabel">Condition</span><br>
		<select id="condition" class="round">
			<option value="0" selected>Number of Parameters is...</option>
			<option value="1">Number of Member Mentions are...</option>
			<option value="2">Number of Channel Mentions are...</option>
			<option value="3">Number of Role Mentions are...</option>
		</select>
	</div>
	<div style="padding-left: 18px; float: left; width: calc(25% - 12px);">
		<span class="dbminputlabel">Comparison</span><br>
		<select id="comparison" class="round">
			<option value="0" selected>=</option>
			<option value="1">\<</option>
			<option value="2">\></option>
		</select>
	</div>
	<div style="padding-left: 18px; float: left; width: calc(25% - 12px);">
		<span class="dbminputlabel">Number</span><br>
		<input id="value" class="round" type="text">
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

  init() {},

  // ---------------------------------------------------------------------
  // Action Bot Function
  // ---------------------------------------------------------------------

  action(cache) {
    const data = cache.actions[cache.index];
    const msg = cache.msg;
    let result = false;
    if (msg && msg.content.length > 0) {
      const condition = parseInt(data.condition, 10);
      let value = 0;
      switch (condition) {
        case 0:
          value = msg.content.split(/\s+/).length - 1;
          break;
        case 1:
          value = msg.mentions.members.size;
          break;
        case 2:
          value = msg.mentions.channels.size;
          break;
        case 3:
          value = msg.mentions.roles.size;
          break;
      }
      const comparison = parseInt(data.comparison, 10);
      const value2 = parseInt(data.value, 10);
      /* eslint-disable eqeqeq */
      const isLooselyEqual = (a, b) => a == b;
      /* eslint-enable eqeqeq */
      switch (comparison) {
        case 0:
          result = isLooselyEqual(value, value2);
          break;
        case 1:
          result = value < value2;
          break;
        case 2:
          result = value > value2;
          break;
      }
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
