module.exports = {
  //---------------------------------------------------------------------
  // Action Name
  //---------------------------------------------------------------------

  name: 'Store Thread Channel Info',

  //---------------------------------------------------------------------
  // Action Section
  //---------------------------------------------------------------------

  section: 'Channel Control',

  //---------------------------------------------------------------------
  // Action Subtitle
  //---------------------------------------------------------------------

  subtitle(data, presets) {
    const info = [
      'Thread Channel Object',
      'Thread Channel ID',
      'Thread Channel Name',
      'Thread Channel Is Archived?',
      'Thread Channel Is Locked?',
      'Thread Channel Is Invitable?',
      'Thread Channel Archived At',
      'Thread Channel Archived At Timestamp',
      'Parent Channel ID',
    ];
    return `${presets.getChannelText(data.thread, data.threadVarName)} - ${info[parseInt(data.info, 10)]}`;
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
        dataType = 'Thread Channel';
        break;
      case 1:
        dataType = 'Thread Channel ID';
        break;
      case 2:
        dataType = 'Text';
        break;
      case 3:
      case 4:
      case 5:
        dataType = 'Boolean';
        break;
      case 6:
        dataType = 'Date';
        break;
      case 7:
        dataType = 'Timestamp';
        break;
      case 8:
        dataType = 'Text';
        break;
    }
    return [data.storageVarName, dataType];
  },

  //---------------------------------------------------------------------
  // Action Meta Data
  //---------------------------------------------------------------------

  meta: {
    version: '2.2.0',
    preciseCheck: true,
    author: null,
    authorUrl: null,
    downloadUrl: 'https://github.com/DBM-POLSKA/DBM-14/blob/main/bot-files/actions/store_thread_channel_info.js',
  },

  //---------------------------------------------------------------------
  // Action Fields
  //---------------------------------------------------------------------

  fields: ['thread', 'threadVarName', 'info', 'storage', 'storageVarName'],

  //---------------------------------------------------------------------
  // Command HTML
  //---------------------------------------------------------------------

  html(isEvent, data) {
    return `
<thread-channel-input dropdownLabel="Source Channel" selectId="thread" variableContainerId="varNameContainer" variableInputId="threadVarName"></thread-channel-input>

<br><br><br>

<div style="padding-top: 8px;">
	<span class="dbminputlabel">Source Info</span><br>
	<select id="info" class="round">
		<option value="0" selected>Thread Channel Object</option>
		<option value="1">Thread Channel ID</option>
		<option value="2">Thread Channel Name</option>
		<option value="3">Thread Channel Is Archived?</option>
		<option value="4">Thread Channel Is Locked?</option>
		<option value="5">Thread Channel Is Invitable?</option>
		<option value="6">Thread Channel Archived At</option>
		<option value="7">Thread Channel Archived At Timestamp</option>
    <option value="8">Parent Channel ID</option>
	</select>
</div>

<br>

<store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer2" variableInputId="storageVarName"></store-in-variable>`;
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

    const targetChannel = await this.getChannelFromData(data.thread, data.threadVarName, cache);

    if (!targetChannel) {
      this.callNextAction(cache);
      return;
    }

    let result;
    const info = parseInt(data.info, 10);
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
        result = targetChannel.archived;
        break;
      case 4:
        result = targetChannel.locked;
        break;
      case 5:
        result = targetChannel.invitable;
        break;
      case 6:
        result = targetChannel.archivedAt;
        break;
      case 7:
        result = targetChannel.archiveTimestamp;
        break;
      case 8:
        result = targetChannel.parentId;
        break;

      default:
        break;
    }

    if (result !== undefined) {
      const storage = parseInt(data.storage, 10);
      const storageVarName = this.evalMessage(data.storageVarName, cache);
      this.storeValue(result, storage, storageVarName, cache);
    }

    this.callNextAction(cache);
  },

  //---------------------------------------------------------------------
  // Action Bot Mod
  //---------------------------------------------------------------------

  mod() {},
};
