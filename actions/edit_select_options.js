module.exports = {
  //---------------------------------------------------------------------
  // Action Name
  //---------------------------------------------------------------------

  name: 'Edit Select Menu Options',

  //---------------------------------------------------------------------
  // Action Section
  //---------------------------------------------------------------------

  section: 'Messaging',

  //---------------------------------------------------------------------
  // Action Subtitle
  //---------------------------------------------------------------------

  subtitle(data, presets) {
    const optionChange = data.optionChange ?? {};
    if (optionChange._index === 0) {
      return `Add Option Labeled "${optionChange.label}"`;
    } else if (optionChange.type === 'value') {
      return `Remove Option with Value "${optionChange.value}"`;
    }
    return `Remove Option with Label "${optionChange.value}"`;
  },

  //---------------------------------------------------------------------
  // Action Meta Data
  //---------------------------------------------------------------------

  meta: {
    version: '2.2.0',
    preciseCheck: true,
    author: null,
    authorUrl: null,
    downloadUrl: 'https://github.com/DBM-POLSKA/DBM-14/blob/main/bot-files/actions/edit_select_options.js',
  },

  //---------------------------------------------------------------------
  // Action Fields
  //---------------------------------------------------------------------

  fields: ['message', 'messageVarName', 'type', 'searchValue', 'optionChange'],

  //---------------------------------------------------------------------
  // Command HTML
  //---------------------------------------------------------------------

  html(isEvent, data) {
    return `
<message-input dropdownLabel="Source Message" selectId="message" variableContainerId="varNameContainer" variableInputId="messageVarName"></message-input>

<br><br><br><br>

<div style="float: left; width: calc(50% - 12px);">
  <span class="dbminputlabel">Components to Edit</span><br>
  <select id="type" class="round" onchange="glob.onButtonSelectTypeChange(this)">
    <option value="allSelects">All Select Menus</option>
    <option value="sourceSelect" selected>Source Select Menu</option>
    <option value="findSelect">Specific Select Menu</option>
  </select>
</div>

<div style="float: right; width: calc(50% - 12px);">
  <div id="nameContainer">
    <span class="dbminputlabel">Select Menu Label/ID</span><br>
    <input id="searchValue" class="round" type="text">
  </div>
</div>

<br><br><br><br>

<tab-system exclusiveTabData spreadOut id="optionChange">

  <tab label="Add Option" icon="plus" fields='["label", "description", "value", "emoji"]'>
    <div style="padding: 8px;">
      <div style="float: left; width: calc(50% - 12px);">
        <span class="dbminputlabel">Name</span>
        <input id="label" class="round" type="text">

        <br>

        <span class="dbminputlabel">Value</span>
        <input id="value" placeholder="Passed to the temp variable..." class="round" type="text">
      </div>
      <div style="float: right; width: calc(50% - 12px);">
        <span class="dbminputlabel">Description</span>
        <input id="description" class="round" type="text">

        <br>

        <span class="dbminputlabel">Emoji</span>
        <input id="emoji" placeholder="Leave blank for none..." class="round" type="text">
      </div>

      <br><br><br><br><br><br>
    </div>
  </tab>

  <tab label="Remove Option" icon="x icon" fields='["type", "value"]'>
    <div style="padding: 8px; margin-bottom: 10px;">
      <div style="float: left; width: calc(50% - 12px);">
        <span class="dbminputlabel">Remove Type</span><br>
        <select id="type" class="round">
          <option value="value" selected>Remove By Value</option>
          <option value="label">Remove By Label</option>
        </select>
      </div>
      <div id="removeValueContainer" style="float: right; width: calc(50% - 12px);">
        <span class="dbminputlabel">Option Value to Remove</span>
        <input id="value" class="round" type="text">
      </div>

      <br><br>
    </div>
  </tab>

</tab-system>
`;
  },

  //---------------------------------------------------------------------
  // Action Editor Init Code
  //---------------------------------------------------------------------

  init() {
    const { glob } = this;

    glob.onButtonSelectTypeChange = function (event) {
      const input = document.getElementById('nameContainer');
      input.style.display = event.value === 'findSelect' ? null : 'none';
    };

    glob.onButtonSelectTypeChange(document.getElementById('type'));
  },

  //---------------------------------------------------------------------
  // Action Bot Function
  //---------------------------------------------------------------------

  async action(cache) {
    const data = cache.actions[cache.index];
    const message = await this.getMessageFromData(data.message, data.messageVarName, cache);

    const type = data.type;

    let sourceSelect = null;
    if (cache.interaction.isSelectMenu()) {
      sourceSelect = cache.interaction.customId;
    }

    const optionChange = data.optionChange;

    let newOptionData = null;
    let removeOptionValue = null;
    let removeOptionLabel = null;
    if (optionChange._index === 0) {
      newOptionData = {
        label: this.evalMessage(optionChange.label, cache),
        value: this.evalMessage(optionChange.value, cache),
        default: false,
      };
      if (optionChange.description) {
        newOptionData.description = this.evalMessage(optionChange.description, cache);
      }
      if (optionChange.emoji) {
        newOptionData.emoji = this.evalMessage(optionChange.emoji, cache);
      }
    } else if (optionChange._index === 1) {
      if (optionChange.type === 'value') {
        removeOptionValue = this.evalMessage(optionChange.value, cache);
      } else if (optionChange.type === 'label') {
        removeOptionLabel = this.evalMessage(optionChange.value, cache);
      }
    }

    const onSelectMenuFound = (select) => {
      if (select) {
        if (!select.options) select.options = [];
        if (newOptionData) {
          select.options.push({ ...newOptionData });
        } else if (removeOptionValue) {
          select.options = select.options.filter((o) => o.value !== removeOptionValue);
        } else if (removeOptionLabel) {
          select.options = select.options.filter((o) => o.label !== removeOptionLabel);
        }
      }
    };

    let components = null;
    let searchValue = null;

    if (message?.components) {
      const { ActionRowBuilder } = this.getDBM().DiscordJS;
      const oldComponents = message.components;
      const newComponents = [];

      for (let i = 0; i < oldComponents.length; i++) {
        const compData = oldComponents[i];
        const comps = compData instanceof ActionRowBuilder ? compData.toJSON() : compData;

        for (let j = 0; j < comps.components.length; j++) {
          const comp = comps.components[j];

          switch (type) {
            case 'allSelects': {
              if (comp.type === 3 || comp.type === 'SELECT_MENU') {
                onSelectMenuFound(comp);
              }
              break;
            }
            case 'sourceSelect': {
              if (comp.custom_id === sourceSelect) {
                onSelectMenuFound(comp);
              }
              break;
            }
            case 'findSelect': {
              if (searchValue === null) {
                searchValue = this.evalMessage(data.searchValue, cache);
              }
              if (comp.custom_id === searchValue || comp.customId === searchValue || comp.label === searchValue) {
                onSelectMenuFound(comp);
              }
              break;
            }
          }
        }

        newComponents.push(comps);
      }

      components = newComponents;
    }

    if (components) {
      if (Array.isArray(message)) {
        this.callListFunc(message, 'edit', [{ components }]).then(() => this.callNextAction(cache));
      } else if (message?.edit) {
        message
          .edit({ components })
          .then(() => this.callNextAction(cache))
          .catch((err) => this.displayError(data, cache, err));
      } else {
        if (message.components) {
          message.components = components;
        }
        this.callNextAction(cache);
      }
    } else {
      this.callNextAction(cache);
    }
  },

  //---------------------------------------------------------------------
  // Action Bot Mod
  //---------------------------------------------------------------------

  mod() {},
};
