module.exports = {
  //---------------------------------------------------------------------
  // Action Name
  //---------------------------------------------------------------------

  name: 'Store Time Info',

  //---------------------------------------------------------------------
  // Action Section
  //---------------------------------------------------------------------

  section: 'Other Stuff',

  //---------------------------------------------------------------------
  // Action Subtitle
  //---------------------------------------------------------------------

  subtitle(data, presets) {
    const time = ['Year', 'Month', 'Day of the Month', 'Hour', 'Minute', 'Second', 'Milisecond', 'Month Text'];
    return `${time[parseInt(data.type, 10)]}`;
  },

  //---------------------------------------------------------------------
  // Action Storage Function
  //---------------------------------------------------------------------

  variableStorage(data, varType) {
    const type = parseInt(data.storage, 10);
    if (type !== varType) return;
    let result = 'Number';
    if (data.type === '7') {
      result = 'Text';
    }
    return [data.varName, result];
  },

  //---------------------------------------------------------------------
  // Action Meta Data
  //---------------------------------------------------------------------

  meta: {
    version: '2.2.0',
    preciseCheck: true,
    author: null,
    authorUrl: null,
    downloadUrl: 'https://github.com/DBM-POLSKA/DBM-14/blob/main/bot-files/actions/store_time_info.js',
  },

  //---------------------------------------------------------------------
  // Action Fields
  //---------------------------------------------------------------------

  fields: ['type', 'storage', 'varName'],

  //---------------------------------------------------------------------
  // Command HTML
  //---------------------------------------------------------------------

  html(isEvent, data) {
    return `
<div>
	<div style="padding-top: 8px; width: 70%;">
		<span class="dbminputlabel">Time Info</span><br>
		<select id="type" class="round">
			<option value="0" selected>Year</option>
			<option value="1">Month (Number)</option>
			<option value="7">Month (Text)</option>
			<option value="2">Day of the Month</option>
			<option value="3">Hour</option>
			<option value="4">Minute</option>
			<option value="5">Second</option>
			<option value="6">Milisecond</option>
		</select>
	</div>
</div>

<br>

<store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></store-in-variable>`;
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
    const type = parseInt(data.type, 10);
    const date = new Date();
    let result;
    switch (type) {
      case 0:
        result = date.getFullYear();
        break;
      case 1:
        result = date.getMonth() + 1;
        break;
      case 2:
        result = date.getDate();
        break;
      case 3:
        result = date.getHours();
        break;
      case 4:
        result = date.getMinutes();
        break;
      case 5:
        result = date.getSeconds();
        break;
      case 6:
        result = date.getMilliseconds();
        break;
      case 7:
        result = [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December',
        ][date.getMonth()];
        break;
      default:
        break;
    }
    if (result !== undefined) {
      const storage = parseInt(data.storage, 10);
      const varName = this.evalMessage(data.varName, cache);
      this.storeValue(result, storage, varName, cache);
    }
    this.callNextAction(cache);
  },

  //---------------------------------------------------------------------
  // Action Bot Mod
  //---------------------------------------------------------------------

  mod() {},
};
