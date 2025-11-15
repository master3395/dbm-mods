module.exports = {
  // ---------------------------------------------------------------------
  // Action Name
  // ---------------------------------------------------------------------

  name: 'Store Voice Channel Info',

  // ---------------------------------------------------------------------
  // Action Section
  // ---------------------------------------------------------------------

  section: 'Channel Control',

  // ---------------------------------------------------------------------
  // Action Subtitle
  // ---------------------------------------------------------------------

  subtitle(data, presets) {
    const info = [
      'Voice Channel Object',
      'Voice Channel ID',
      'Voice Channel Name',
      'Voice Channel Position',
      'Voice Channel User Limit',
      'Voice Channel Bitrate',
    ];
    return `${presets.getVoiceChannelText(data.channel, data.varName)} - ${info[parseInt(data.info, 10)]}`;
  },

  // ---------------------------------------------------------------------
  // Action Storage Function
  // ---------------------------------------------------------------------

  variableStorage(data, varType) {
    const type = parseInt(data.storage, 10);
    if (type !== varType) return;
    const info = parseInt(data.info, 10);
    let dataType = 'Unknown Type';
    switch (info) {
      case 0:
        dataType = 'Voice Channel';
        break;
      case 1:
        dataType = 'Voice Channel ID';
        break;
      case 2:
        dataType = 'Text';
        break;
      case 3:
      case 4:
      case 5:
        dataType = 'Number';
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
    downloadUrl: 'https://github.com/DBM-POLSKA/DBM-14/blob/main/bot-files/actions/store_voice_channel_info.js',
  },

  // ---------------------------------------------------------------------
  // Action Fields
  // ---------------------------------------------------------------------

  fields: ['channel', 'varName', 'info', 'storage', 'varName2'],

  // ---------------------------------------------------------------------
  // Command HTML
  // ---------------------------------------------------------------------

  html(isEvent, data) {
    return `
<voice-channel-input dropdownLabel="Source Channel" selectId="channel" variableContainerId="varNameContainer" variableInputId="varName" selectWidth="45%" variableInputWidth="50%"></voice-channel-input>

<br><br><br>

<div style="padding-top: 8px;">
	<span class="dbminputlabel">Source Info</span><br>
	<select id="info" class="round">
		<option value="0" selected>Voice Channel Object</option>
		<option value="1">Voice Channel ID</option>
		<option value="2">Voice Channel Name</option>
		<option value="3">Voice Channel Position</option>
		<option value="4">Voice Channel User Limit</option>
		<option value="5">Voice Channel Bitrate</option>
	</select>
</div>

<br>

<store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer2" variableInputId="varName2"></store-in-variable>`;
  },

  // ---------------------------------------------------------------------
  // Action Editor Init Code
  // ---------------------------------------------------------------------

  init() {},

  // ---------------------------------------------------------------------
  // Action Bot Function
  // ---------------------------------------------------------------------

  async action(cache) {
    const data = cache.actions[cache.index];
    const targetChannel = await this.getVoiceChannelFromData(data.channel, data.varName, cache);

    if (!targetChannel) {
      this.callNextAction(cache);
      return;
    }

    const info = parseInt(data.info, 10);

    let result;
    switch (info) {
      case 0:
        result = targetChannel;
        break;
      case 1:
        result = targetChannel.id;
        break;
      case 2:
        result = targetChannel.name;
        break;
      case 3:
        result = targetChannel.position;
        break;
      case 4:
        result = targetChannel.userLimit;
        break;
      case 5:
        result = targetChannel.bitrate;
        break;
      default:
        break;
    }
    if (result !== undefined) {
      const storage = parseInt(data.storage, 10);
      const varName2 = this.evalMessage(data.varName2, cache);
      this.storeValue(result, storage, varName2, cache);
    }
    this.callNextAction(cache);
  },

  // ---------------------------------------------------------------------
  // Action Bot Mod
  // ---------------------------------------------------------------------

  mod() {},
};
