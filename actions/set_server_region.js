module.exports = {
  // ---------------------------------------------------------------------
  // Action Name
  // ---------------------------------------------------------------------

  name: 'Set Server Region',

  // ---------------------------------------------------------------------
  // Action Section
  // ---------------------------------------------------------------------

  section: 'Server Control',

  // ---------------------------------------------------------------------
  // Action Subtitle
  // ---------------------------------------------------------------------

  subtitle(data, presets) {
    return `${presets.getServerText(data.server, data.varName)} - ${data.region}`;
  },

  // ---------------------------------------------------------------------
  // Action Meta Data
  // ---------------------------------------------------------------------

  meta: {
    version: '2.2.0',
    preciseCheck: true,
    author: null,
    authorUrl: null,
    downloadUrl: 'https://github.com/DBM-POLSKA/DBM-14/blob/main/bot-files/actions/set_server_region.js',
  },

  // ---------------------------------------------------------------------
  // Action Fields
  // ---------------------------------------------------------------------

  fields: ['server', 'varName', 'region', 'reason'],

  // ---------------------------------------------------------------------
  // Command HTML
  // ---------------------------------------------------------------------

  html(isEvent, data) {
    return `
<server-input dropdownLabel="Server" selectId="server" variableContainerId="varNameContainer" variableInputId="varName"></server-input>

<br><br><br>

<div style="padding-top: 8px;">
	<span class="dbminputlabel">Server Region</span><br>
	<select id="region" class="round">
		<option value="brazil">Brazil</option>
		<option value="us-west">US West</option>
		<option value="singapore">Singapore</option>
		<option value="eu-central">EU Central</option>
		<option value="hongkong">HongKong</option>
		<option value="us-south">US South</option>
		<option value="us-central">US Central</option>
		<option value="london">London</option>
		<option value="us-east">US East</option>
		<option value="sydney">Sydney</option>
		<option value="amsterdam">Amsterdam</option>
		<option value="eu-west">EU West</option>
		<option value="frankfurt">Frankfurt</option>
		<option value="russia">Russia</option>
	</select>
</div>

<br>

<div>
  <span class="dbminputlabel">Reason</span>
  <input id="reason" placeholder="Optional" class="round" type="text">
</div>`;
  },

  // ---------------------------------------------------------------------
  // Action Editor Init Code
  // ---------------------------------------------------------------------

  init() {},

  // ---------------------------------------------------------------------
  // Action Bot Function
  // ---------------------------------------------------------------------

  action(cache) {
    this.callNextAction(cache);
  },

  // ---------------------------------------------------------------------
  // Action Bot Mod
  // ---------------------------------------------------------------------

  mod() {},
};
