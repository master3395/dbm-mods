module.exports = {
  //---------------------------------------------------------------------
  // Action Name
  //---------------------------------------------------------------------

  name: 'Wait',

  //---------------------------------------------------------------------
  // Action Section
  //---------------------------------------------------------------------

  section: 'Other Stuff',

  //---------------------------------------------------------------------
  // Action Subtitle
  //---------------------------------------------------------------------

  subtitle(data, presets) {
    const measurements = ['Milliseconds', 'Seconds', 'Minutes', 'Hours'];
    return `${data.time} ${measurements[parseInt(data.measurement, 10)]}`;
  },

  //---------------------------------------------------------------------
  // Action Meta Data
  //---------------------------------------------------------------------

  meta: {
    version: '2.2.0',
    preciseCheck: true,
    author: null,
    authorUrl: null,
    downloadUrl: 'https://github.com/DBM-POLSKA/DBM-14/blob/main/bot-files/actions/wait.js',
  },

  //---------------------------------------------------------------------
  // Action Fields
  //---------------------------------------------------------------------

  fields: ['time', 'measurement'],

  //---------------------------------------------------------------------
  // Command HTML
  //---------------------------------------------------------------------

  html(isEvent, data) {
    return `
<div>
	<div style="float: left; width: 45%;">
		<span class="dbminputlabel">Measurement</span><br>
		<select id="measurement" class="round">
			<option value="0">Milliseconds</option>
			<option value="1" selected>Seconds</option>
			<option value="2">Minutes</option>
			<option value="3">Hours</option>
		</select>
	</div>
	<div style="float: right; width: 50%;">
		<span class="dbminputlabel">Amount</span><br>
		<input id="time" class="round" type="text">
	</div>
</div>`;
  },

  //---------------------------------------------------------------------
  // Action Editor Init Code
  //---------------------------------------------------------------------

  init() {},

  //---------------------------------------------------------------------
  // Action Bot Function
  //---------------------------------------------------------------------

  action(cache) {
    const data = cache.actions[cache.index];
    let time = parseInt(this.evalMessage(data.time, cache), 10);
    const type = parseInt(data.measurement, 10);
    switch (type) {
      case 1:
        time *= 1e3;
        break;
      case 2:
        time *= 1e3 * 60;
        break;
      case 3:
        time *= 1e3 * 60 * 60;
        break;
      default:
        return this.callNextAction(cache);
    }
    setTimeout(() => this.callNextAction(cache), time).unref();
  },

  //---------------------------------------------------------------------
  // Action Bot Mod
  //---------------------------------------------------------------------

  mod() {},
};
