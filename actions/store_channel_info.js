module.exports = {
  //---------------------------------------------------------------------
  // Action Name
  //---------------------------------------------------------------------

  name: 'Store Channel Info',

  //---------------------------------------------------------------------
  // Action Section
  //---------------------------------------------------------------------

  section: 'Channel Control',

  //---------------------------------------------------------------------
  // Action Subtitle
  //---------------------------------------------------------------------

  subtitle(data, presets) {
    const info = [
      'Channel Object',
      'Channel ID',
      'Channel Name',
      'Channel Topic',
      'Channel Last Message (Removed)',
      'Channel Position',
      'Channel Is NSFW?',
      'Channel Is DM?',
      'Channel Is Deleteable?',
      'Channel Creation Date',
      'Channel Category ID',
      'Channel Created At',
      'Channel Created At Timestamp',
    ];
    return `${presets.getChannelText(data.channel, data.varName)} - ${info[parseInt(data.info, 10)]}`;
  },

  //---------------------------------------------------------------------
  // Action Storage Function
  //---------------------------------------------------------------------

  variableStorage(data, varType) {
    const type = parseInt(data.storage, 10);
    if (type !== varType) return;
    const info = parseInt(data.info, 10);
    let dataType = 'Unknown Type';
    switch (info) {
      case 0:
        dataType = 'Channel';
        break;
      case 1:
        dataType = 'Channel ID';
        break;
      case 2:
      case 3:
        dataType = 'Text';
        break;
      case 5:
        dataType = 'Number';
        break;
      case 6:
      case 7:
      case 8:
        dataType = 'Boolean';
        break;
      case 10:
        dataType = 'Category ID';
        break;
      case 11:
        dataType = 'Date';
        break;
      case 12:
        dataType = 'Timestamp';
        break;
    }
    return [data.varName2, dataType];
  },

  //---------------------------------------------------------------------
  // Action Meta Data
  //---------------------------------------------------------------------

  meta: {
    version: '2.2.0',
    preciseCheck: true,
    author: null,
    authorUrl: null,
    downloadUrl: 'https://github.com/DBM-POLSKA/DBM-14/blob/main/bot-files/actions/store_channel_info.js',
  },

  //---------------------------------------------------------------------
  // Action Fields
  //---------------------------------------------------------------------

  fields: ['channel', 'varName', 'info', 'storage', 'varName2'],

  //---------------------------------------------------------------------
  // Command HTML
  //---------------------------------------------------------------------

  html(isEvent, data) {
    return `
<channel-input dropdownLabel="Source Channel" selectId="channel" variableContainerId="varNameContainer" variableInputId="varName"></channel-input>

<br><br><br>

<div style="padding-top: 8px;">
	<span class="dbminputlabel">Source Info</span><br>
	<select id="info" class="round">
		<option value="0" selected>Channel Object</option>
		<option value="1">Channel ID</option>
		<option value="2">Channel Name</option>
		<option value="3">Channel Topic</option>
		<option value="4">Channel Last Message (Removed)</option>
		<option value="5">Channel Position</option>
		<option value="6">Channel Is NSFW?</option>
		<option value="7">Channel Is DM?</option>
		<option value="8">Channel Is Deleteable?</option>
		<option value="9">Channel Creation Date</option>
		<option value="12">Channel Creation Timestamp</option>
		<option value="10">Channel Category ID</option>
	</select>
</div>

<br>

<store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer2" variableInputId="varName2"></store-in-variable>`;
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
    const DiscordJS = this.getDBM().DiscordJS;

    const targetChannel = await this.getChannelFromData(data.channel, data.varName, cache);

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
        result = targetChannel.topic;
        break;
      case 4:
        result = '';
        break;
      case 5:
        result = targetChannel.position;
        break;
      case 6:
        result = targetChannel.nsfw;
        break;
      case 7:
        result = targetChannel.type === 'DM';
        break;
      case 8:
        result = targetChannel.deletable;
        break;
      case 9:
      case 11:
        result = targetChannel.createdAt;
        break;
      case 10:
        result = targetChannel.parentId;
        break;
      case 12:
        result = targetChannel.createdTimestamp;
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

  //---------------------------------------------------------------------
  // Action Bot Mod
  //---------------------------------------------------------------------

  mod() {},
};
