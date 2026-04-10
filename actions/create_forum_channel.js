module.exports = {
  //---------------------------------------------------------------------
  // Action Name
  //---------------------------------------------------------------------

  name: "Create Forum Channel",

  //---------------------------------------------------------------------
  // Action Section
  //---------------------------------------------------------------------

  section: "Channel Control",

  //---------------------------------------------------------------------
  // Action Subtitle
  //---------------------------------------------------------------------

  subtitle(data) {
    return `${data.channelName}`;
  },

  //---------------------------------------------------------------------
  // Action Storage Function
  //---------------------------------------------------------------------

  variableStorage(data, varType) {
    const type = parseInt(data.storage, 10);
    if (type !== varType) return;
    return [data.varName, "Channel"];
  },

  //---------------------------------------------------------------------
  // Action Meta Data
  //---------------------------------------------------------------------

  meta: { version: "2.2.0", preciseCheck: true, author: null, authorUrl: 'https://github.com/master3395/dbm-mods', downloadURL: 'https://github.com/dbm-network/mods' },

  //---------------------------------------------------------------------
  // Action Fields
  //---------------------------------------------------------------------

  fields: ["channelName", "topic", "position", "storage", "varName", "categoryID", "options"],

  //---------------------------------------------------------------------
  // Command HTML
  //---------------------------------------------------------------------

  html() {
    return `
<div style="height: 350px; overflow-y: scroll; overflow-x: hidden;">
  <div style="float: left; width: 100%; padding-top: 8px;">
    <span class="dbminputlabel">Name</span>
    <input id="channelName" class="round" type="text">
  </div>

  <div style="float: left; width: 100%; padding-top: 16px;">
    <span class="dbminputlabel">Guidelines</span>
    <textarea id="topic" rows="3" style="white-space: nowrap;"></textarea>
  </div>
  
  <div style="float: left; width: 100%;">
    <div style="float: left; width: 60%; padding-top: 16px;">
      <span class="dbminputlabel">Category ID</span><br>
      <input id="categoryID" class="round" type="text" placeholder="Leave blank for no category">
    </div>

    <div style="float: right; width: 35%; padding-top: 16px;">
      <span class="dbminputlabel">Position</span><br>
      <input id="position" class="round" type="text" placeholder="Leave blank for default">
    </div>
  </div>

  <br><br><br><br><br><br><br><br><br><br><br><br>

  <div style="padding-top: 8px">
    <span class="dbminputlabel">Extra Options</span>
    <dialog-button
      id="options"
      style="width: 100%;"
      fields='[
        "defaultSortType",
        "defaultForumLayout",
        "rateLimitPerUser",
        "autoArchiveDuration",
        "reason",
        "tags"
      ]'
      dialogTitle="Forum Channel Options"
      dialogWidth="600"
      dialogHeight="430"
      dialogResizable="false"
      saveButtonText="Save Actions"
      saveButtonIcon="star"
      buttonTextFunction="
        '(' +
        (data.defaultSortType === '1' ? 'Creation Date' : 'Latest Activity') +
        ', ' + (data.defaultForumLayout === '2' ? 'Gallery View' : 'List View') +
        ', ' + (data.rateLimitPerUser || '[no rate limit]') +
        ', ' + (data.reason || '[no reason]') +
        ')'
      "
    >
      <div style="padding: 16px;">
        <div style="padding-top: 8px; float: left; width: calc(50% - 12px);">
          <span class="dbminputlabel">Default Sort Type</span><br>
          <select id="defaultSortType" class="round">
            <option value="1" selected>Creation Date</option>
            <option value="0">Latest Activity</option>
          </select>

          <br>

          <span class="dbminputlabel">Default Layout Type</span><br>
          <select id="defaultForumLayout" class="round">
            <option value="2" selected>Gallery View</option>
            <option value="1">List View</option>
          </select>

          <br>

          <span class="dbminputlabel">Rate Limit Per User</span><br>
          <input id="rateLimitPerUser" class="round" type="text" placeholder="Leave blank to disable">

          <br>

          <span class="dbminputlabel">Auto-Archive Duration</span><br>
          <select id="autoArchiveDuration" class="round">
            <option value="60" selected>1 hour</option>
            <option value="1440">24 hours</option>
            <option value="4320">3 days</option>
            <option value="10080">1 week</option>
            <option value="max">Maximum</option>
          </select>

          <br>

          <span class="dbminputlabel">Reason</span>
          <input id="reason" placeholder="Optional" class="round" type="text">
        </div>
        <div style="width: calc(50% - 12px); float: right">
          <dialog-list
            id="tags"
            fields='[
              "name",
              "moderated",
              "emoji"
            ]'
            dialogTitle="Tag Info"
            dialogWidth="400"
            dialogHeight="300"
            listLabel="Available Tags"
            listStyle="height: calc(100vh - 150px);"
            itemName="Tag"
            itemCols="1"
            itemHeight="30px;"
            itemTextFunction="data.name"
            itemStyle="text-align: left; line-height: 30px;"
          >
            <div style="padding: 16px;">
              <span class="dbminputlabel">Name</span>
              <input id="name" class="round" type="text">

              <br>

              <span class="dbminputlabel">Moderated</span>
              <input id="moderated" placeholder="'Yes' or 'No'" class="round" type="text">

              <br>

              <span class="dbminputlabel">Emoji</span>
              <input id="emoji" placeholder="Leave blank for none..." class="round" type="text">
            </div>
          </dialog-list>
        </div>
      </div>
    </dialog-button>
  </div>

  <br>

  <div style="float: left; width: 100%;">
    <store-in-variable allowNone dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></store-in-variable>
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

  async action(cache) {
    const data = cache.actions[cache.index];
    const DBM = this.getDBM();
    const DiscordJS = DBM.DiscordJS;
    const isV14 = DBM.isDiscordJSv14 ? DBM.isDiscordJSv14() : parseInt(DiscordJS.version.split('.')[0], 10) >= 14;
    const { server } = cache;

    if (!server) {
      this.callNextAction(cache);
      return;
    }

    // Use compatibility helper for channel type
    const ChannelType = DBM.getChannelType ? DBM.getChannelType() : DiscordJS.ChannelType || {};
    const forumType = ChannelType.GuildForum !== undefined ? ChannelType.GuildForum : 15;

    const channelData = {
      name: this.evalMessage(data.channelName, cache),
      type: forumType,
    };

    if (data.topic) {
      channelData.topic = this.evalMessage(data.topic, cache);
    }
    if (data.position) {
      channelData.position = parseInt(this.evalMessage(data.position, cache), 10);
    }
    if (data.categoryID) {
      channelData.parent = this.evalMessage(data.categoryID, cache);
    }
    if (data.options?.rateLimitPerUser) {
      channelData.rateLimitPerUser = parseInt(this.evalMessage(data.options.rateLimitPerUser, cache), 10);
    }
    if (data.options?.reason) {
      channelData.reason = this.evalMessage(data.options.reason, cache);
    }

    // ThreadAutoArchiveDuration
    if (data.options?.autoArchiveDuration) {
      channelData.autoArchiveDuration =
        data.options.autoArchiveDuration === "max" ? 10080 : parseInt(data.options.autoArchiveDuration, 10);
    }

    // SortOrderType
    if (data.options?.defaultSortType !== undefined) {
      channelData.defaultSortOrder = parseInt(data.options.defaultSortType, 10);
    }

    // ForumLayoutType
    if (data.options?.defaultForumLayout !== undefined) {
      channelData.defaultForumLayout = parseInt(data.options.defaultForumLayout, 10);
    }

    // GuildForumTagData
    if (data.options?.tags && data.options.tags.length > 0) {
      channelData.availableTags = data.options.tags.map((tagData) => {
        const result = {
          name: this.evalMessage(tagData.name, cache),
          moderated: tagData.moderated === "yes" || tagData.moderated === "Yes",
        };
        if (tagData.emoji) {
          const emoji = this.evalMessage(tagData.emoji, cache);
          if (emoji.match(/^\d+$/)) {
            result.emojiId = emoji;
          } else {
            result.emojiName = emoji;
          }
        }
        return result;
      });
    }

    // v13: create(name, options), v14: create(options with name)
    const createPromise = isV14
      ? server.channels.create(channelData)
      : server.channels.create(channelData.name, channelData);

    createPromise
      .then((channel) => {
        const storage = parseInt(data.storage, 10);
        const varName = this.evalMessage(data.varName, cache);
        this.storeValue(channel, storage, varName, cache);
        this.callNextAction(cache);
      })
      .catch((err) => this.displayError(data, cache, err));
  },

  //---------------------------------------------------------------------
  // Action Bot Mod
  //---------------------------------------------------------------------

  mod() {},
};

