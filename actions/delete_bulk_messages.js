module.exports = {
  //---------------------------------------------------------------------
  // Action Name
  //---------------------------------------------------------------------

  name: 'Delete Bulk Messages',

  //---------------------------------------------------------------------
  // Action Section
  //---------------------------------------------------------------------

  section: 'Messaging',

  //---------------------------------------------------------------------
  // Action Subtitle
  //---------------------------------------------------------------------

  subtitle(data, presets) {
    return `Delete ${data.count} messages from ${presets.getChannelText(data.channel, data.varName)}`;
  },

  //---------------------------------------------------------------------
  // Action Meta Data
  //---------------------------------------------------------------------

  meta: {
    version: '2.2.0',
    preciseCheck: true,
    author: null,
    authorUrl: null,
    downloadUrl: 'https://github.com/DBM-POLSKA/DBM-14/blob/main/bot-files/actions/delete_bulk_messages.js',
  },

  //---------------------------------------------------------------------
  // Action Fields
  //---------------------------------------------------------------------

  fields: ['channel', 'count', 'condition', 'custom', 'varName'],

  //---------------------------------------------------------------------
  // Command HTML
  //---------------------------------------------------------------------

  html(isEvent, data) {
    return `
<channel-input dropdownLabel="Source Channel" selectId="channel" variableContainerId="varNameContainer" variableInputId="varName"></channel-input>

<br><br><br>

<div style="padding-top: 8px;">
	<span class="dbminputlabel">Amount to Delete</span><br>
	<input id="count" class="round" type="text" style="width: 90%;"><br>
</div>
<div>
	<div style="float: left; width: 35%;">
		<span class="dbminputlabel">Delete Condition</span><br>
		<select id="condition" class="round" onchange="glob.onChange2(this)">
			<option value="0" selected>None</option>
			<option value="1">Has Author</option>
			<option value="2">Custom</option>
		</select>
	</div>
	<div id="varNameContainer2" style="display: none; float: right; width: 60%;">
		<span class="dbminputlabel">Code</span><br>
		<input id="custom" class="round" type="text"><br>
	</div>
</div>`;
  },

  //---------------------------------------------------------------------
  // Action Editor Init Code
  //---------------------------------------------------------------------

  init() {
    const { glob, document } = this;

    glob.onChange2 = function (event) {
      const value = parseInt(event.value, 10);
      const varNameInput = document.getElementById('varNameContainer2');
      if (value === 0) {
        varNameInput.style.display = 'none';
      } else {
        varNameInput.style.display = null;
      }
    };

    glob.onChange2(document.getElementById('condition'));
  },

  //---------------------------------------------------------------------
  // Action Bot Function
  //---------------------------------------------------------------------

  async action(cache) {
    const data = cache.actions[cache.index];
    const server = cache.server;
    const source = await this.getChannelFromData(data.channel, data.varName, cache);

    if (!source?.messages) return this.callNextAction(cache);

    const count = Math.min(parseInt(this.evalMessage(data.count, cache), 10), 100);
    const options = {
      limit: count,
    };

    if (cache.msg) {
      options.before = cache.msg.id;
    }

    source.messages
      .fetch(options)
      .then((messages) => {
        const condition = parseInt(data.condition, 10);
        if (condition === 1) {
          let author;
          try {
            author = this.eval(data.custom, cache);
          } catch (e) {
            this.displayError(data, cache, e);
            author = null;
          }
          if (author?.id) {
            messages = messages.filter((m) => m.author.id === author.id);
          }
        } else if (condition === 2) {
          const cond = data.custom;
          messages = messages.filter((message) => {
            let result = false;
            try {
              result = !!this.eval(cond, cache);
            } catch (e) {
              this.displayError(data, cache, 'Error with custom eval:\n' + e.stack);
            }
            return result;
          });
        }
        source
          .bulkDelete(messages, true)
          .then(() => this.callNextAction(cache))
          .catch((err) => this.displayError(data, cache, err));
      })
      .catch((err) => this.displayError(data, cache, err));
  },

  //---------------------------------------------------------------------
  // Action Bot Mod
  //---------------------------------------------------------------------

  mod(DBM) {},
};
