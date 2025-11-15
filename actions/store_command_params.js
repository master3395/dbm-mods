module.exports = {
  //---------------------------------------------------------------------
  // Command Only
  //---------------------------------------------------------------------

  commandOnly: true,

  //---------------------------------------------------------------------
  // Action Name
  //---------------------------------------------------------------------

  name: 'Store Command Params',

  //---------------------------------------------------------------------
  // Action Section
  //---------------------------------------------------------------------

  section: 'Other Stuff',

  //---------------------------------------------------------------------
  // Action Subtitle
  //---------------------------------------------------------------------

  subtitle(data, presets) {
    const infoSources = [
      'One Parameter',
      'Multiple Parameters',
      'Mentioned Member',
      'Mentioned Role',
      'Mentioned Channel',
    ];
    return `${infoSources[parseInt(data.info, 10)]} #${data.infoIndex}`;
  },

  //---------------------------------------------------------------------
  // Action Storage Function
  //---------------------------------------------------------------------

  variableStorage(data, varType) {
    const type = parseInt(data.storage, 10);
    if (type !== varType) return;
    const info = parseInt(data.info, 10);
    let dataType = 'None';
    switch (info) {
      case 0:
      case 1:
        dataType = 'Text';
        break;
      case 2:
        dataType = 'Server Member';
        break;
      case 3:
        dataType = 'Role';
        break;
      case 4:
        dataType = 'Channel';
        break;
    }
    return [data.varName, dataType];
  },

  //---------------------------------------------------------------------
  // Action Meta Data
  //---------------------------------------------------------------------

  meta: {
    version: '2.2.0',
    preciseCheck: true,
    author: null,
    authorUrl: null,
    downloadUrl: 'https://github.com/DBM-POLSKA/DBM-14/blob/main/bot-files/actions/store_command_params.js',
  },

  //---------------------------------------------------------------------
  // Action Fields
  //---------------------------------------------------------------------

  fields: ['info', 'infoIndex', 'storage', 'varName'],

  //---------------------------------------------------------------------
  // Command HTML
  //---------------------------------------------------------------------

  html(isEvent, data) {
    return `
<div>
	<div style="float: left; width: 35%;">
		<span class="dbminputlabel">Source Info</span><br>
		<select id="info" class="round" onchange="glob.onSourceInfoChanged(this)">
			<option value="0" selected>One Parameter</option>
			<option value="1">Multiple Parameters</option>
			<option value="2">Mentioned Member</option>
			<option value="3">Mentioned Role</option>
			<option value="4">Mentioned Channel</option>
		</select>
	</div>
	<div style="float: right; width: 60%;">
		<span class="dbminputlabel" id="infoCountLabel">Parameter Number:</span>
		<input id="infoIndex" class="round" type="text" value="1"><br>
	</div>
</div>

<br><br><br>

<store-in-variable style="padding-top: 8px;" dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></store-in-variable>`;
  },

  //---------------------------------------------------------------------
  // Action Editor Init Code
  //---------------------------------------------------------------------

  init() {
    const { glob, document } = this;

    glob.onSourceInfoChanged = function (event) {
      const value = parseInt(event.value, 10);
      const infoCountLabel = document.getElementById('infoCountLabel');
      switch (value) {
        case 0:
          infoCountLabel.innerHTML = 'Parameter Number';
          break;
        case 1:
          infoCountLabel.innerHTML = 'Starting From Parameter Number';
          break;
        case 2:
          infoCountLabel.innerHTML = 'Member Mention Number';
          break;
        case 3:
          infoCountLabel.innerHTML = 'Role Mention Number';
          break;
        case 4:
          infoCountLabel.innerHTML = 'Channel Mention Number';
          break;
        default:
          infoCountLabel.innerHTML = '';
          break;
      }
    };

    glob.onSourceInfoChanged(document.getElementById('info'));
  },

  //---------------------------------------------------------------------
  // Action Bot Function
  //---------------------------------------------------------------------

  action(cache) {
    const data = cache.actions[cache.index];
    const msg = cache.msg;
    const interactionOptions = cache.interaction?.options ?? null;
    if (!msg && !interactionOptions) {
      return this.callNextAction(cache);
    }

    const { Bot, Files } = this.getDBM();
    const infoType = parseInt(data.info, 10);
    const index = parseInt(this.evalMessage(data.infoIndex, cache), 10) - 1;

    let separator;
    let content = null;
    const getContent = () => {
      if (content === null) {
        separator = Files.data.settings.separator || '\\s+';
        Bot.populateTagRegex();
        content = msg.content?.replace(Bot.tagRegex, '').replace(Bot.checkTag(msg.content), '').trimStart();
      }
      return content;
    };

    let source;
    switch (infoType) {
      case 0: {
        if (interactionOptions) {
          const result = this.getParameterFromParameterData(interactionOptions.data[index]);
          if (result) {
            source = result;
          }
        } else if (msg && getContent()) {
          const params = content.split(new RegExp(separator));
          source = params[index] || '';
        }
        break;
      }

      case 1: {
        if (interactionOptions) {
          const result = [];
          for (let i = 0; i < index; i++) {
            const r = this.getParameterFromParameterData(interactionOptions.data[i]);
            if (r) {
              result.push(r);
            }
          }
          if (result.length > 0) {
            source = result;
          }
        } else if (msg && getContent()) {
          const params = content.split(new RegExp(separator));
          source = '';
          for (let i = 0; i < index; i++) {
            source += params[i] + ' ';
          }
          const location = content.indexOf(source);
          if (location === 0) {
            source = content.substring(source.length);
          }
        }
        break;
      }

      case 2: {
        if (interactionOptions) {
          const options = interactionOptions.data.filter((option) => option.type === 'USER');
          if (options[index]) {
            source = options[index].member ?? options[index].user;
          }
        } else if (msg.mentions.members.size) {
          const members = [...msg.mentions.members.values()];
          if (members[index]) {
            source = members[index];
          }
        }
        break;
      }

      case 3: {
        if (interactionOptions) {
          const options = interactionOptions.data.filter((option) => option.type === 'ROLE');
          if (options[index]) {
            source = options[index].role;
          }
        } else if (msg.mentions.roles.size) {
          const roles = [...msg.mentions.roles.values()];
          if (roles[index]) {
            source = roles[index];
          }
        }
        break;
      }

      case 4: {
        if (interactionOptions) {
          const options = interactionOptions.data.filter((option) => option.type === 'CHANNEL');
          if (options[index]) {
            source = options[index].channel;
          }
        } else if (msg.mentions.channels.size) {
          const channels = [...msg.mentions.channels.values()];
          if (channels[index]) {
            source = channels[index];
          }
        }
        break;
      }

      default: {
        break;
      }
    }

    if (source) {
      const storage = parseInt(data.storage, 10);
      const varName = this.evalMessage(data.varName, cache);
      this.storeValue(source, storage, varName, cache);
    }

    this.callNextAction(cache);
  },

  //---------------------------------------------------------------------
  // Action Bot Mod
  //---------------------------------------------------------------------

  mod() {},
};
