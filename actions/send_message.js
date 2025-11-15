module.exports = {
  // ---------------------------------------------------------------------
  // Action Name
  // ---------------------------------------------------------------------

  name: 'Send Message MOD',
  displayName: 'Send Message',

  // ---------------------------------------------------------------------
  // Action Section
  // ---------------------------------------------------------------------

  section: 'Messaging',

  // ---------------------------------------------------------------------
  // Action Size
  // ---------------------------------------------------------------------

  size() {
    return { width: 640, height: 550 };
  },

  // ---------------------------------------------------------------------
  // Action Subtitle
  // ---------------------------------------------------------------------

  subtitle(data, presets) {
    let defaultText = '';
    if (data.message) {
      defaultText = `"${data.message.replace(/[\n\r]+/, ' ↲ ')}"`;
    } else if (data.embeds?.length > 0) {
      defaultText = `${data.embeds.length} Embeds`;
    } else if (data.attachments?.length > 0) {
      defaultText = `${data.attachments.length} Attachments`;
    } else if (data.buttons?.length > 0 || data.selectMenus?.length > 0) {
      defaultText = `${data.buttons.length} Buttons and ${data.selectMenus.length} Select Menus`;
    } else if (data.editMessage && data.editMessage !== '0') {
      defaultText = `Message Options - ${presets.getVariableText(data.editMessage, data.editMessageVarName)}`;
    } else {
      defaultText = `Nothing (might cause error)`;
    }
    if (data.dontReply) {
      defaultText = `Store Data: ${defaultText}`;
    } else {
      defaultText = `${presets.getSendReplyTargetText(data.channel, data.varName)}: ${defaultText}`;
    }

    const userDesc = data.actionDescription?.toString().trim();
    if (userDesc) {
      const color = data.actionDescriptionColor || '#ffffff';

      return `<span style="color: ${color};">${userDesc}</span>`;
    }

    return defaultText;
  },

  // ---------------------------------------------------------------------
  // Action Storage Function
  // ---------------------------------------------------------------------

  variableStorage(data, varType) {
    const type = parseInt(data.storage, 10);
    if (type !== varType) return;
    return [data.varName2, data.dontSend ? 'Message Options' : 'Message'];
  },

  // ---------------------------------------------------------------------
  // Action Meta Data
  // ---------------------------------------------------------------------

  meta: {
    version: '2.2.0',
    preciseCheck: true,
    author: 'Shadow',
    authorUrl: 'https://github.com/DBM-POLSKA',
    downloadUrl: 'https://github.com/DBM-POLSKA/DBM-14/blob/main/bot-files/actions/send_message.js',
  },

  // ---------------------------------------------------------------------
  // Action Fields
  // ---------------------------------------------------------------------

  fields: [
    'channel',
    'varName',
    'message',
    'buttons',
    'selectMenus',
    'attachments',
    'embeds',
    'reply',
    'ephemeral',
    'dontReply',
    'tts',
    'overwrite',
    'dontSend',
    'editMessage',
    'editMessageVarName',
    'storage',
    'varName2',
    'pinned',
    'channel',
    'varNameContainer',
    'varName',
    'pollQuestion',
    'pollAnswers',
    'pollAnswer',
    'pollEmoji',
    'pollAllowMultipleAnswers',
    'pollDuration',
    'actionDescription',
    'actionDescriptionColor',
    'allowMentionUsers',
    'allowMentionRoles',
    'allowMentionEveryone',
    'allowMentionCommandUser',
    'suppressLinkEmbeds',
    'suppressNotifications',
    'selectMenuOnTop',
  ],

  // ---------------------------------------------------------------------
  // Command HTML
  // ---------------------------------------------------------------------

  html(isEvent, data) {
    void isEvent;
    void data;
    return `
<div style="position:fixed;bottom:0;left:0;padding:5px;padding-top:5px;padding-bottom:5px;font:13px sans-serif;border-radius:10px;background:rgba(0,0,0,0.7);color:#999;border:1px solid rgba(50,50,50,.7);z-index:999999;opacity:0.5;transition:all .3s" onmouseover="this.style.opacity='1';this.style.borderColor='gray'" onmouseout="this.style.opacity='0.5';this.style.borderColor='rgba(50,50,50,.7)'">Creator: Shadow<br><br>Help: <a href='https://discord.gg/9HYB4n3Dz4' target='_blank' style='color:#07f;text-decoration:none'>Discord</a></div><div style="position:fixed;bottom:0;right:0;padding:5px;font:20px sans-serif;border-radius:10px;background:rgba(0,0,0,0.7);color:#999;border:1px solid rgba(50,50,50,.7);z-index:999999;opacity:0.5;transition:all .3s" onmouseover="this.style.opacity='1';this.style.borderColor='gray'" onmouseout="this.style.opacity='0.5';this.style.borderColor='rgba(50,50,50,.7)'"><a href='https://dbm-polska.github.io/DBM-14/' target='_blank' style='color:#07f;text-decoration:none'><!--Version-->3.6</a></div>
    
  <div style="margin-top: -10px;">
<send-reply-target-input selectId="channel" variableInputId="varName"></send-reply-target-input>
</div>

<br>

<tab-system style="margin-top: 50px;">


  <tab label="Message" icon="comment">
  <div style="width: 100%; padding:8px;height: calc(100vh - 270px);overflow:auto">
      <textarea id="message" class="dbm_monospace" rows="10" placeholder="Insert message here..." style="height: calc(100vh - 309px); white-space: nowrap;"></textarea>
      <div id="counter" style="float:right;text-align:right;position:relative;width:22%">characters: 0</div>
  </div>
  </tab>


  <tab label="Embeds" icon="book image">
    <div style="padding: 8px;">

      <dialog-list id="embeds" fields='["title", "url", "color", "useTimestamp", "timestamp", "imageUrl", "thumbUrl", "description", "fields", "author", "authorUrl", "authorIcon", "footerText", "footerIconUrl"]' saveButtonText="Save Embed", dialogTitle="Embed Info" dialogWidth="540" dialogHeight="460" listLabel="Embeds" listStyle="height: calc(100vh - 350px);" itemName="Embed" itemCols="2" itemHeight="80px;" itemTextFunction="glob.formatItemEmbed(data)" itemStyle="text-align: left; line-height: 30px;">
        <div style="padding: 16px 16px 0px 16px;">

          <tab-system>

            <tab label="General" icon="certificate">
              <div style="padding: 8px">
                <div style="float: left; width: calc(50% - 12px);">
                  <span class="dbminputlabel">Title</span><br>
                  <input id="title" class="round" type="text" placeholder="Leave blank for none...">

                  <br>

                  <div style="display:flex;align-items:center;gap:6px">
  <div style="flex-grow:1">
    <span class="dbminputlabel">Color
    <help-icon dialogTitle="Embed Colors" dialogWidth="540" dialogHeight="460">
                  <div style="padding: 16px;">
                 <div style="background-color:rgba(0, 0, 0, 0.41); border: 2px solid rgba(255, 255, 255, 0.5); padding: 10px; border-radius: 5px; margin-bottom: 10px;">
                  <u><b><span style="font-size: 15px;">Custom Colors</span></b></u><br>
                  <div style="display: flex; gap: 20px;">
                   <ul style="flex: 1; list-style: none; padding-left: 0; margin: 0;">
                     <li><span style="display:inline-block; width:10px; height:10px; background-color: #CC0000; border-radius: 50%; margin-right: 8px;"></span> DarkRed </li>
                     <li><span style="display:inline-block; width:10px; height:10px; background-color: #DC143C; border-radius: 50%; margin-right: 8px;"></span> Crimson </li>
                     <li><span style="display:inline-block; width:10px; height:10px; background-color: #FF6347; border-radius: 50%; margin-right: 8px;"></span> Tomato </li>
                     <li><span style="display:inline-block; width:10px; height:10px; background-color: #FF7F50; border-radius: 50%; margin-right: 8px;"></span> Coral </li>
                     <li><span style="display:inline-block; width:10px; height:10px; background-color: #FF4500; border-radius: 50%; margin-right: 8px;"></span> OrangeRed </li>
                     <li><span style="display:inline-block; width:10px; height:10px; background-color: #FF8C00; border-radius: 50%; margin-right: 8px;"></span> DarkOrange </li>
                     <li><span style="display:inline-block; width:10px; height:10px; background-color: #FFA500; border-radius: 50%; margin-right: 8px;"></span> Orange </li>
                     <li><span style="display:inline-block; width:10px; height:10px; background-color: #FFD700; border-radius: 50%; margin-right: 8px;"></span> Gold </li>
                     <li><span style="display:inline-block; width:10px; height:10px; background-color: #DAA520; border-radius: 50%; margin-right: 8px;"></span> GoldenRod </li>
                     <li><span style="display:inline-block; width:10px; height:10px; background-color: #FFBF00; border-radius: 50%; margin-right: 8px;"></span> Amber </li>
                     <li><span style="display:inline-block; width:10px; height:10px; background-color: #FFFF00; border-radius: 50%; margin-right: 8px;"></span> Yellow </li>
                     <li><span style="display:inline-block; width:10px; height:10px; background-color:rgb(255, 255, 156); border-radius: 50%; margin-right: 8px;"></span> LightYellow </li>
                     <li><span style="display:inline-block; width:10px; height:10px; background-color: #FFF700; border-radius: 50%; margin-right: 8px;"></span> Lemon </li>
                     <li><span style="display:inline-block; width:10px; height:10px; background-color:rgb(255, 255, 173); border-radius: 50%; margin-right: 8px;"></span> Ivory </li>
                     <li><span style="display:inline-block; width:10px; height:10px; background-color: #7FFF00; border-radius: 50%; margin-right: 8px;"></span> Chartreuse </li>
                     <li><span style="display:inline-block; width:10px; height:10px; background-color: #00FF00; border-radius: 50%; margin-right: 8px;"></span> Lime </li>
                     <li><span style="display:inline-block; width:10px; height:10px; background-color: #7CFC00; border-radius: 50%; margin-right: 8px;"></span> LawnGreen </li>
                     <li><span style="display:inline-block; width:10px; height:10px; background-color: #008000; border-radius: 50%; margin-right: 8px;"></span> Green </li>
                     <li><span style="display:inline-block; width:10px; height:10px; background-color: #228B22; border-radius: 50%; margin-right: 8px;"></span> ForestGreen </li>
                     <li><span style="display:inline-block; width:10px; height:10px; background-color: #2E8B57; border-radius: 50%; margin-right: 8px;"></span> SeaGreen </li>
                     <li><span style="display:inline-block; width:10px; height:10px; background-color: #00FF7F; border-radius: 50%; margin-right: 8px;"></span> SpringGreen </li>
                     <li><span style="display:inline-block; width:10px; height:10px; background-color: #00FA9A; border-radius: 50%; margin-right: 8px;"></span> MediumSpringGreen </li>
                     <li><span style="display:inline-block; width:10px; height:10px; background-color: #98FF98; border-radius: 50%; margin-right: 8px;"></span> Mint </li>
                     <li><span style="display:inline-block; width:10px; height:10px; background-color: #40E0D0; border-radius: 50%; margin-right: 8px;"></span> Turquoise </li>
                     <li><span style="display:inline-block; width:10px; height:10px; background-color: #00FFFF; border-radius: 50%; margin-right: 8px;"></span> Aqua </li>
                   </ul>
                   <ul style="flex: 1; list-style: none; padding-left: 0; margin: 0;">
                     <li><span style="display:inline-block; width:10px; height:10px; background-color: #00FFFF; border-radius: 50%; margin-right: 8px;"></span> Cyan </li>
                     <li><span style="display:inline-block; width:10px; height:10px; background-color:rgb(175, 255, 255); border-radius: 50%; margin-right: 8px;"></span> LightCyan </li>
                     <li><span style="display:inline-block; width:10px; height:10px; background-color: #87CEEB; border-radius: 50%; margin-right: 8px;"></span> SkyBlue </li>
                     <li><span style="display:inline-block; width:10px; height:10px; background-color: #00BFFF; border-radius: 50%; margin-right: 8px;"></span> DeepSkyBlue </li>
                     <li><span style="display:inline-block; width:10px; height:10px; background-color: #1E90FF; border-radius: 50%; margin-right: 8px;"></span> DodgerBlue </li>
                     <li><span style="display:inline-block; width:10px; height:10px; background-color:rgb(52, 52, 255); border-radius: 50%; margin-right: 8px;"></span> Blue </li>
                     <li><span style="display:inline-block; width:10px; height:10px; background-color: #0000CD; border-radius: 50%; margin-right: 8px;"></span> MediumBlue </li>
                     <li><span style="display:inline-block; width:10px; height:10px; background-color: #4169E1; border-radius: 50%; margin-right: 8px;"></span> RoyalBlue </li>
                     <li><span style="display:inline-block; width:10px; height:10px; background-color: #000080; border-radius: 50%; margin-right: 8px;"></span> Navy </li>
                     <li><span style="display:inline-block; width:10px; height:10px; background-color: #4B0082; border-radius: 50%; margin-right: 8px;"></span> Indigo </li>
                     <li><span style="display:inline-block; width:10px; height:10px; background-color: #8A2BE2; border-radius: 50%; margin-right: 8px;"></span> BlueViolet </li>
                     <li><span style="display:inline-block; width:10px; height:10px; background-color: #9400D3; border-radius: 50%; margin-right: 8px;"></span> DarkViolet </li>
                     <li><span style="display:inline-block; width:10px; height:10px; background-color: #9932CC; border-radius: 50%; margin-right: 8px;"></span> DarkOrchid </li>
                     <li><span style="display:inline-block; width:10px; height:10px; background-color: #800080; border-radius: 50%; margin-right: 8px;"></span> Purple </li>
                     <li><span style="display:inline-block; width:10px; height:10px; background-color: #9370DB; border-radius: 50%; margin-right: 8px;"></span> MediumPurple </li>
                     <li><span style="display:inline-block; width:10px; height:10px; background-color: #EE82EE; border-radius: 50%; margin-right: 8px;"></span> Violet </li>
                     <li><span style="display:inline-block; width:10px; height:10px; background-color: #DA70D6; border-radius: 50%; margin-right: 8px;"></span> Orchid </li>
                     <li><span style="display:inline-block; width:10px; height:10px; background-color: #FF00FF; border-radius: 50%; margin-right: 8px;"></span> Fuchsia </li>
                     <li><span style="display:inline-block; width:10px; height:10px; background-color: #FF69B4; border-radius: 50%; margin-right: 8px;"></span> HotPink </li>
                     <li><span style="display:inline-block; width:10px; height:10px; background-color: #FF1493; border-radius: 50%; margin-right: 8px;"></span> DeepPink </li>
                     <li><span style="display:inline-block; width:10px; height:10px; background-color:rgb(255, 171, 185); border-radius: 50%; margin-right: 8px;"></span> Pink </li>
                     <li><span style="display:inline-block; width:10px; height:10px; background-color: #FFB6C1; border-radius: 50%; margin-right: 8px;"></span> LightPink </li>
                     <li><span style="display:inline-block; width:10px; height:10px; background-color: #DB7093; border-radius: 50%; margin-right: 8px;"></span> PaleVioletRed </li>
                     <li><span style="display:inline-block; width:10px; height:10px; background-color: #FA8072; border-radius: 50%; margin-right: 8px;"></span> Salmon </li>
                     <li><span style="display:inline-block; width:10px; height:10px; background-color: #FFFFFF; border-radius: 50%; margin-right: 8px;"></span> White </li>
                     <li><span style="display:inline-block; width:10px; height:10px; background-color: #000000; border-radius: 50%; margin-right: 8px;"></span> Black </li>
                   </ul>
                  </div>
                  </div>
                </div>
              </help-icon>
    </span><br>
    <input id="color" class="round" type="text" placeholder="Leave blank for black...">
  </div>
  <button onclick="const i=color,b=this;t=i.type==='text';i.type=t?'color':'text';b.textContent=t?'Text':'Color'" class="tiny compact ui icon button" style="margin-top:18px">Color</button>
</div>

                </div>

                <div style="float: right; width: calc(50% - 12px);">
                  <span class="dbminputlabel">Tittle URL</span><br>
                  <input id="url" class="round" type="text" placeholder="Leave blank for none...">

                  <br>

              <div style="width:100%; vertical-align: top;">
               <div style="display: flex; flex-direction: column; position: relative; margin-top: -4px;">
                   <dbm-checkbox id="useTimestamp" style="font-size:13px; margin: 0; margin-left: 3px;" label="Use Timestamp"></dbm-checkbox>
                   <input id="timestamp" class="round" type="text" placeholder="Leave blank for current..." style="position: relative; z-index: 2; margin-top: -3px;">
               </div>
              </div>

                </div>

                <br><br><br><br><br><br><br>

                <hr class="subtlebar">

                <br>

                <span class="dbminputlabel">Image URL</span><br>
                <input id="imageUrl" class="round" type="text" placeholder="Leave blank for none...">

                <br>

                <span class="dbminputlabel">Thumbnail URL</span><br>
                <input id="thumbUrl" class="round" type="text" placeholder="Leave blank for none...">
              </div>
            </tab>

            <tab label="Description" icon="file image">
              <div style="padding: 8px">
                <textarea id="description" class="dbm_monospace" rows="10" placeholder="Insert description here..." style="height: calc(100vh - 149px); white-space: nowrap; resize: none;"></textarea>
                </div>
            </tab>

            <tab label="Fields" icon="list">
              <div style="padding: 8px">
                <dialog-list id="fields" fields='["name", "value", "inline"]' saveButtonText="Save Field", dialogTitle="Field Info" dialogWidth="540" dialogHeight="300" listLabel="Fields" listStyle="height: calc(100vh - 190px);" itemName="Field" itemCols="1" itemHeight="30px;" itemTextFunction="data.name + '<br>' + data.value" itemStyle="text-align: left; line-height: 30px;">
                  <div style="padding: 16px;">
                    <div style="float: left; width: calc(50% - 12px);">
                      <span class="dbminputlabel">Field Name</span><br>
                      <input id="name" class="round" type="text">
                    </div>

                    <div style="float: right; width: calc(50% - 12px);">
                      <span class="dbminputlabel">Inline?</span><br>
                      <select id="inline" class="round">
                        <option value="true">Yes</option>
                        <option value="false" selected>No</option>
                      </select>
                    </div>

                    <br><br><br><br>

                    <span class="dbminputlabel">Field Value</span><br>
                    <textarea id="value" class="dbm_monospace" rows="10" placeholder="Insert field text here..." style="height: calc(100vh - 190px); white-space: nowrap; resize: none;"></textarea>

                  </div>
                </dialog-list>
              </div>
            </tab>

            <tab label="Author" icon="user circle">
              <div style="padding: 8px">
                <span class="dbminputlabel">Author Text</span><br>
                <input id="author" class="round" type="text" placeholder="Leave blank to disallow...">

                <br>

                <span class="dbminputlabel">Author URL</span><br>
                <input id="authorUrl" class="round" type="text" placeholder="Leave blank for none...">

                <br>

                <span class="dbminputlabel">Author Icon URL</span><br>
                <input id="authorIcon" class="round" type="text" placeholder="Leave blank for none...">
              </div>
            </tab>

            <tab label="Footer" icon="map outline">
              <div style="padding: 8px;">
                <span class="dbminputlabel">Footer Icon URL</span><br>
                <input id="footerIconUrl" class="round" type="text" placeholder="Leave blank for none...">

                <br>

                <span class="dbminputlabel">Footer Text</span><br>
                <textarea id="footerText" class="dbm_monospace" rows="10" placeholder="Leave blank to disallow..." style="height: calc(100vh - 234px); white-space: nowrap; resize: none;"></textarea>
              </div>
            </tab>

          </tab-system>

        </div>
      </dialog-list>

    </div>
  </tab>

  <tab label="Poll" icon="chart bar">
    <div style="padding: 8px 50px;">

    <span class="dbminputlabel">Question</span>
    <input id="pollQuestion" class="round" type="text" placeholder="Leave blank for disable poll..." style="width: 100%;">

    <dialog-list id="pollAnswers" fields='["pollAnswer", "pollEmoji"]' saveButtonText="Save Answer", dialogTitle="Create Answer" dialogWidth="400" dialogHeight="280" listLabel="Answers (min 1 - max 10)" listStyle="height: calc(100vh - 450px);" itemName="Answer" itemCols="1" itemHeight="30px;" itemTextFunction="data.pollEmoji + data.pollAnswer" itemStyle="text-align: left; line-height: 30px;">
      <div style="padding: 16px;">
        <span class="dbminputlabel">Answer</span>
        <input id="pollAnswer" class="round" type="text" placeholder="Type your answer" style="width: 100%;">

        <br>

        <span class="dbminputlabel">Emoji</span>
        <input id="pollEmoji" class="round" type="text" placeholder="Leave blank for none..." style="width: 100%;">

        <br>
      </div>
    </dialog-list>

    <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 20px; margin-bottom: 0;">
     
      <div style="flex: 1; text-align: left;">
        <dbm-checkbox id="pollAllowMultipleAnswers" label="Allow Multiple Answers"></dbm-checkbox>
      </div>
      
      <div style="flex: 1; text-align: left;">
      <span class="dbminputlabel">Duration (in hours 1/2/3...)</span>
      <input id="pollDuration" class="round" type="text" placeholder="Leave blank for 24h..." style="width: 100%;">
    </div>
  </div>
    </div>
  </tab>


  <tab label="Buttons" icon="clone">
    <div style="padding: 8px;">

      <dialog-list id="buttons" fields='["name", "type", "id", "row", "url", "emoji", "disabled", "mode", "time", "actions", "ButtonDisabled"]' saveButtonText="Save Button", dialogTitle="Button Info" dialogWidth="600" dialogHeight="700" listLabel="Buttons" listStyle="height: calc(100vh - 350px);" itemName="Button" itemCols="5" itemHeight="40px;" itemTextFunction="glob.formatItemButton(data)" itemStyle="text-align: center; line-height: 40px;">
        <div style="padding: 16px;">
          <div style="width: calc(50% - 12px); float: left;">
            <span class="dbminputlabel">Name</span>
            <input id="name" class="round" type="text" placeholder="Leave blank for none...">

            <br>

            <span class="dbminputlabel">Type
            <help-icon dialogTitle="Button Types" dialogWidth="680" dialogHeight="420">
                  <div style="padding: 16px;">
                 <div style="background-color:rgba(0, 0, 0, 0.41); border: 2px solid rgba(255, 255, 255, 0.5); padding: 10px; border-radius: 5px; margin-bottom: 10px;">
                  <u><b><span style="font-size: 15px;">Button Types</span></b></u><br>
                  <div style="display: flex; gap: 20px;">
                   <ul style="flex: 1; list-style: none; padding-left: 0; margin: 0;">
                       <br>
                       <li><img src="https://media.discordapp.net/attachments/1301409004248891443/1376373867056201839/Zrzut_ekranu_2025-05-26_033635.png?ex=6835178d&is=6833c60d&hm=aaa033d7e6ed65c3d02327f6ba0e5d6767095369e0ace21193b54a2fa6be87e6&=&format=webp&quality=lossless" alt="Primary" style="width: 100px; height: 40px; margin-right: 8px; vertical-align: middle;"> A blue button used for the main or most important action. </li>
                       <br>
                       <li><img src="https://media.discordapp.net/attachments/1301409004248891443/1376373867790209177/Zrzut_ekranu_2025-05-26_033648.png?ex=6835178d&is=6833c60d&hm=27fc7b6aad2ab2bc2700baa191088d03a2bbd5a4e460cee1a7edde51249e9e7b&=&format=webp&quality=lossless" alt="Secondary" style="width: 100px; height: 40px; margin-right: 8px; vertical-align: middle;"> A gray button used for secondary or less important actions. </li>
                       <br>
                       <li><img src="https://media.discordapp.net/attachments/1301409004248891443/1376373868486328462/Zrzut_ekranu_2025-05-26_033705.png?ex=6835178e&is=6833c60e&hm=cd388ebf2a859524cc592e087b1dbb99e743dc924e3dab8c2cdd515149df42be&=&format=webp&quality=lossless" alt="Success" style="width: 100px; height: 40px; margin-right: 8px; vertical-align: middle;"> A green button typically used to confirm or indicate a successful action. </li>
                       <br>
                       <li><img src="https://media.discordapp.net/attachments/1301409004248891443/1376373868712824962/Zrzut_ekranu_2025-05-26_033728.png?ex=6835178e&is=6833c60e&hm=17bf8a69626f940b23de55bd150d2f1dd3e2f97db532810ece2be63c0d0f2f7d&=&format=webp&quality=lossless" alt="Danger" style="width: 100px; height: 40px; margin-right: 8px; vertical-align: middle;"> A red button used for destructive or potentially irreversible actions. </li>
                       <br>
                       <li><img src="https://media.discordapp.net/attachments/1301409004248891443/1376373867378905108/Zrzut_ekranu_2025-05-26_033742.png?ex=6835178d&is=6833c60d&hm=ff72baa8e4f82a20866f989a7f9a8e67eb5e5a580a57cedd75105cdfcf61aa63&=&format=webp&quality=lossless" alt="Link" style="width: 100px; height: 40px; margin-right: 8px; vertical-align: middle;"> A gray button that opens a specified URL when clicked, acting like a hyperlink. </li>
                   </ul>
                  </div>
                  </div>
                 </div>
               </help-icon>
            </span><br>
            <select id="type" class="round">
              <option value="1" selected>Primary (Blurple)</option>
              <option value="2">Secondary (Grey)</option>
              <option value="3">Success (Green)</option>
              <option value="4">Danger (Red)</option>
              <option value="5">Link (Grey)</option>
            </select>

            <br>

            <span class="dbminputlabel">Link URL</span>
            <input id="url" placeholder="Leave blank for none..." class="round" type="text">
           
            <br>

            <span class="dbminputlabel">
              Action Response Mode
              <help-icon type="ACTION_RESPONSE_MODE"></help-icon>
            </span><br>
            <select id="mode" class="round">
              <option value="PERSONAL">Once, Command User Only</option>
              <option value="PUBLIC">Once, Anyone Can Use</option>
              <option value="MULTIPERSONAL">Multi, Command User Only</option>
              <option value="MULTI" selected>Multi, Anyone Can Use</option>
              <option value="PERSISTENT">Persistent</option>
            </select>
          </div>
          <div style="width: calc(50% - 12px); float: right;">
            <span class="dbminputlabel">Unique ID</span>
            <input id="id" placeholder="Leave blank to auto-generate..." class="round" type="text">

            <br>

            <span class="dbminputlabel">Action Row (1 - 5)</span>
            <input id="row" placeholder="Leave blank for default..." class="round" type="text">

            <br>

            <span class="dbminputlabel">Emoji</span>
            <input id="emoji" placeholder="Leave blank for none..." class="round" type="text">

            <br>

            <span class="dbminputlabel">Temporary Time-Limit (Miliseconds)</span>
            <input id="time" placeholder="60000" class="round" type="text">


            <div style="padding-top: 8px; margin-top: 10px;">
          <span class="dbminputlabel">Enable/Disable Button</span>
          <select id="ButtonDisabled" class="round">
            <option value="false">Enable</option>
            <option value="true">Disable</option>
          </select>
        </div>
           
          </div>

          <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>

          <action-list-input mode="BUTTON" id="actions" height="calc(100vh - 460px)"></action-list-input>

        </div>
      </dialog-list>

    </div>
  </tab>

  <tab label="Selects" icon="list alternate">
  <div style="padding: 8px;">

    <dialog-list id="selectMenus" fields='["placeholder", "id", "tempVarName", "row", "min", "max", "mode", "time", "options", "actions", "SelectMenuType", "SelectMenuDisabled"]' saveButtonText="Save Select Menu", dialogTitle="Select Menu Info" dialogWidth="800" dialogHeight="700" listLabel="Select Menus" listStyle="height: calc(100vh - 350px);" itemName="Select Menu" itemCols="1" itemHeight="40px;" itemTextFunction="glob.formatItemSelectMenu(data)" itemStyle="text-align: left; line-height: 40px;">
      <div style="padding: 16px;">
        <div style="width: calc(33% - 16px); float: left; margin-right: 16px;">
          <span class="dbminputlabel">Placeholder</span>
          <input id="placeholder" class="round" type="text" placeholder="Leave blank for default...">

          <br>

          <span class="dbminputlabel">Temp Variable Name</span>
          <input id="tempVarName" placeholder="Stores selected value for actions..." class="round" type="text">

          <br>

          <span class="dbminputlabel">Minimum Select Number</span>
          <input id="min" class="round" type="text" value="1">

          <br>

          <span class="dbminputlabel">
            Action Response Mode
            <help-icon type="ACTION_RESPONSE_MODE"></help-icon>
          </span><br>
          <select id="mode" class="round">
            <option value="PERSONAL">Once, Command User Only</option>
            <option value="PUBLIC">Once, Anyone Can Use</option>
            <option value="MULTIPERSONAL">Multi, Command User Only</option>
            <option value="MULTI" selected>Multi, Anyone Can Use</option>
            <option value="PERSISTENT">Persistent</option>
          </select>

          <div style="padding-top: 8px; margin-top: 10px;">
          <span class="dbminputlabel">Select Menu Type</span>
          <select id="SelectMenuType" class="round">
          <optgroup label="Default Select Menu">
            <option value="StringSelectMenu">String Select Menu</option>
            <option value="UserSelectMenu">User Select Menu</option>
            <option value="RoleSelectMenu">Role Select Menu</option>
            <option value="MentionableSelectMenu">Mentionable Select Menu</option>
            <option value="ChannelSelectMenu">Channel Select Menu</option>
          </optgroup>
          <optgroup label="Specific Channel Select Menu">
          <option value="ChannelTextSelectMenu">Text Channel Select Menu</option>
          <option value="ChannelVoiceSelectMenu">Voice Channel Select Menu</option>
          <option value="CategorySelectMenu">Category Select Menu</option>
          <option value="ChannelStageSelectMenu">Stage Channel Select Menu</option>
          <option value="ChannelForumSelectMenu">Forum Channel Select Menu</option>
          </optgroup>
          <optgroup label="Other Channel Select Menu">
          <option value="ChannelTextAndVoiceSelectMenu">Text + Voice Select Menu</option>
          <option value="ChannelTextAndCategorySelectMenu">Text + Category Select Menu</option>
          <option value="ChannelTextAndStageSelectMenu">Text + Stage Select Menu</option>
          <option value="ChannelTextAndForumSelectMenu">Text + Forum Select Menu</option>
          <option value="ChannelVoiceAndCategorySelectMenu">Voice + Category Select Menu</option>
          <option value="ChannelVoiceAndStageSelectMenu">Voice + Stage Select Menu</option>
          <option value="ChannelVoiceAndForumSelectMenu">Voice + Forum Select Menu</option>
          <option value="ChannelCategoryAndStageSelectMenu">Category + Stage Select Menu</option>
          <option value="ChannelCategoryAndForumSelectMenu">Category + Forum Select Menu</option>
          <option value="ChannelStageAndForumSelectMenu">Stage + Forum Select Menu</option>
          </select>
        </div>
        </div>

        <div style="width: calc(33% - 16px); float: left; margin-right: 16px;">
          <span class="dbminputlabel">Unique ID</span>
          <input id="id" placeholder="Leave blank to auto-generate..." class="round" type="text">

          <br>

          <span class="dbminputlabel">Action Row (1 - 5)</span>
          <input id="row" placeholder="Leave blank for default..." class="round" type="text">

          <br>

          <span class="dbminputlabel">Maximum Select Number</span>
          <input id="max" class="round" type="text" value="1">

          <br>

          <span class="dbminputlabel">Temporary Time-Limit (Miliseconds)</span>
          <input id="time" placeholder="60000" class="round" type="text">


          <div style="padding-top: 8px; margin-top: 10px;">
          <span class="dbminputlabel">Enable/Disable Select Menu</span>
          <select id="SelectMenuDisabled" class="round">
            <option value="false">Enable</option>
            <option value="true">Disable</option>
          </select>
        </div>
        

        </div>

        <div style="width: calc(34% - 8px); height: 300px; float: left; margin-left: 8px;">

          <dialog-list id="options" fields='["label", "description", "value", "emoji", "default"]' saveButtonText="Save Option", dialogTitle="Select Menu Option Info" dialogWidth="360" dialogHeight="440" listLabel="Options" listStyle="height: 210px;" itemName="Option" itemCols="1" itemHeight="20px;" itemTextFunction="data.label" itemStyle="text-align: left; line-height: 20px;">
            <div style="padding: 16px;">
              <span class="dbminputlabel">Name</span>
              <input id="label" class="round" type="text">

              <br>

              <span class="dbminputlabel">Description</span>
              <input id="description" class="round" type="text" placeholder="Leave blank for none...">

              <br>

              <span class="dbminputlabel">Value</span>
              <input id="value" placeholder="The text passed to the temp variable..." class="round" type="text">

              <br>

              <span class="dbminputlabel">Emoji</span>
              <input id="emoji" placeholder="Leave blank for none..." class="round" type="text">

              <br>

              <span class="dbminputlabel">Default Selected</span><br>
              <select id="default" class="round">
                <option value="true">Yes</option>
                <option value="false" selected>No</option>
              </select>
            </div>
          </dialog-list>

        </div>

        <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>

        <action-list-input mode="SELECT" id="actions" height="calc(100vh - 430px)">
          <script class="setupTempVars">
            const elem = document.getElementById("tempVarName");
            if(elem?.value) {
              tempVars.push([elem.value, "Text"]);
            }
          </script>
        </action-list-input>

      </div>
    </dialog-list>

  </div>
</tab>

  
  <tab label="Files" icon="file image">
    <div style="padding: 8px;">

      <dialog-list id="attachments" fields='["url", "name", "spoiler"]' saveButtonText="Save File", dialogTitle="Attachment Info" dialogWidth="400" dialogHeight="280" listLabel="Files" listStyle="height: calc(100vh - 350px);" itemName="File" itemCols="1" itemHeight="30px;" itemTextFunction="data.url" itemStyle="text-align: left; line-height: 30px;">
        <div style="padding: 16px;">
          <span class="dbminputlabel">Attachment Local/Web URL</span>
          <input id="url" class="round" type="text" value="resources/">

          <br>

          <span class="dbminputlabel">Attachment Name</span>
          <input id="name" class="round" type="text" placeholder="Leave blank for default...">

          <br>

          <div style="text-align: center; padding-top: 4px;">
            <dbm-checkbox id="spoiler" label="Make Attachment Spoiler"></dbm-checkbox>
          </div>
        </div>
      </dialog-list>
    </div>
  </tab>


  <tab label="Settings" icon="cogs">
  <div style="width: 100%; padding:8px;height: calc(100vh - 260px);overflow-y: scroll;overflow-x: hidden;">

      <div style="display: flex; justify-content: space-between;">
         <dbm-checkbox style="float: left;" id="reply" label="Reply to Interaction if Possible" checked></dbm-checkbox>

         <dbm-checkbox style="float: middle;" id="ephemeral" label="Make Reply Private (ephemeral)"></dbm-checkbox>
      </div>

      <br>

      <div style="display: flex; justify-content: space-between;">
        <dbm-checkbox id="tts" label="Text to Speech"></dbm-checkbox>

        <dbm-checkbox id="overwrite" label="Overwrite Changes"></dbm-checkbox>

        <dbm-checkbox id="dontSend" label="Don't Send Message"></dbm-checkbox>

        <dbm-checkbox id="pinned" label="Pin Msg."></dbm-checkbox>
      </div>

      <br>

      <div style="display: flex; justify-content: space-between;">
        <dbm-checkbox id="suppressLinkEmbeds" label="Suppress Link Embeds"></dbm-checkbox>

        <dbm-checkbox id="selectMenuOnTop" label="Select Menu On Top" checked></dbm-checkbox>

        <dbm-checkbox id="allowMentionCommandUser" label="Ping Command User"></dbm-checkbox>
      </div>

      <br>

      <div style="display: flex; justify-content: space-between;">
        <dbm-checkbox id="allowMentionUsers" label="Allow Mention Users" checked></dbm-checkbox>

        <dbm-checkbox id="allowMentionRoles" label="Allow Mention Roles" checked></dbm-checkbox>

        <dbm-checkbox id="allowMentionEveryone" label="Allow Mention Everyone" checked></dbm-checkbox>
      </div>

      <br>

      <div style="display: flex; justify-content: space-between;">
        <dbm-checkbox id="suppressNotifications" label="Suppress Notifications"></dbm-checkbox>
      </div>

      <br>

      <div style="display: flex; justify-content: space-between;">
        
      </div>

      <br>
      <hr class="subtlebar" style="margin-top: 4px; margin-bottom: 4px; width: 100%;">
      

      <table style="width:100%;"><tr>
      <td><span class="dbminputlabel">Action Description
      <help-icon dialogTitle="[Send Message] Settings" dialogWidth="640" dialogHeight="500">
                  <div style="padding: 16px;">
                 <div style="background-color:rgba(0, 0, 0, 0.41); border: 2px solid rgba(255, 255, 255, 0.5); padding: 10px; border-radius: 5px; margin-bottom: 10px;">
                 <u><b><span style="font-size: 15px;">Reply to Interaction if Possible</span></b></u><br>
                  <div style="display: flex; gap: 20px;">  
                   <ul style="flex: 1;  padding-left: 20px; margin: 0;">
                     <li>When you enable this option, the message sent will be a response to the interaction/message...</li>
                   </ul>
                  </div>
                  </div>
                  <div style="background-color:rgba(0, 0, 0, 0.41); border: 2px solid rgba(255, 255, 255, 0.5); padding: 10px; border-radius: 5px; margin-bottom: 10px;">
                 <u><b><span style="font-size: 15px;">Make Reply Private (ephemeral)</span></b></u><br>
                  <div style="display: flex; gap: 20px;">  
                   <ul style="flex: 1;  padding-left: 20px; margin: 0;">
                     <li>When this option is enabled, the message that will be sent will only be visible to the person who launched the command.</li>
                     <li>For this to work you must also enable "Reply to Interaction if Possible".</li>
                   </ul>
                  </div>
                  </div>
                  <div style="background-color:rgba(0, 0, 0, 0.41); border: 2px solid rgba(255, 255, 255, 0.5); padding: 10px; border-radius: 5px; margin-bottom: 10px;">
                 <u><b><span style="font-size: 15px;">Text to Speech</span></b></u><br>
                  <div style="display: flex; gap: 20px;">  
                   <ul style="flex: 1;  padding-left: 20px; margin: 0;">
                     <li>When you enable this option, the message sent by your bot will be read aloud.</li>
                   </ul>
                  </div>
                  </div>
                  <div style="background-color:rgba(0, 0, 0, 0.41); border: 2px solid rgba(255, 255, 255, 0.5); padding: 10px; border-radius: 5px; margin-bottom: 10px;">
                 <u><b><span style="font-size: 15px;">Overwrite Changes</span></b></u><br>
                  <div style="display: flex; gap: 20px;">  
                   <ul style="flex: 1;  padding-left: 20px; margin: 0;">
                     <li>You can only use this option when editing a message.</li>
                     <li>When this option is enabled, the old message will be replaced by the new message.</li>
                     <li>When this option is disabled, the old message will be merged with the new message.</li>
                   </ul>
                  </div>
                  </div>
                  <div style="background-color:rgba(0, 0, 0, 0.41); border: 2px solid rgba(255, 255, 255, 0.5); padding: 10px; border-radius: 5px; margin-bottom: 10px;">
                 <u><b><span style="font-size: 15px;">Don't Send Message</span></b></u><br>
                  <div style="display: flex; gap: 20px;">  
                   <ul style="flex: 1;  padding-left: 20px; margin: 0;">
                     <li>When you enable this option, the message will not be sent but you can save it in a variable.</li>
                   </ul>
                  </div>
                  </div>
                  <div style="background-color:rgba(0, 0, 0, 0.41); border: 2px solid rgba(255, 255, 255, 0.5); padding: 10px; border-radius: 5px; margin-bottom: 10px;">
                 <u><b><span style="font-size: 15px;">Pin Msg.</span></b></u><br>
                  <div style="display: flex; gap: 20px;">  
                   <ul style="flex: 1;  padding-left: 20px; margin: 0;">
                     <li>When you enable this option, the message will be pinned to the channel immediately after it is sent.</li>
                     <li>This option does not always work, so it is recommended to use a separate action to pin the message.</li>
                   </ul>
                  </div>
                  </div>
                  <div style="background-color:rgba(0, 0, 0, 0.41); border: 2px solid rgba(255, 255, 255, 0.5); padding: 10px; border-radius: 5px; margin-bottom: 10px;">
                 <u><b><span style="font-size: 15px;">Suppress Link Embeds</span></b></u><br>
                  <div style="display: flex; gap: 20px;">  
                   <ul style="flex: 1;  padding-left: 20px; margin: 0;">
                     <li>If you have a link in the message you are sending and you enable this option, the link will not be formatted for embed.</li>
                   </ul>
                  </div>
                  </div>
                  <div style="background-color:rgba(0, 0, 0, 0.41); border: 2px solid rgba(255, 255, 255, 0.5); padding: 10px; border-radius: 5px; margin-bottom: 10px;">
                 <u><b><span style="font-size: 15px;">Select Menu On Top</span></b></u><br>
                  <div style="display: flex; gap: 20px;">  
                   <ul style="flex: 1;  padding-left: 20px; margin: 0;">
                     <li>When you enable this option, selection menus will be displayed above the buttons.</li>
                     <li>When you disable this option, the buttons will be displayed above the select menu.</li>
                   </ul>
                  </div>
                  </div>
                  <div style="background-color:rgba(0, 0, 0, 0.41); border: 2px solid rgba(255, 255, 255, 0.5); padding: 10px; border-radius: 5px; margin-bottom: 10px;">
                 <u><b><span style="font-size: 15px;">Ping Command User</span></b></u><br>
                  <div style="display: flex; gap: 20px;">  
                   <ul style="flex: 1;  padding-left: 20px; margin: 0;">
                     <li>This option only works for text commands.</li>
                     <li>After enabling this option, the message sent will ping the command user (for the ping to work, the "Reply to Interaction if Possible" option must be enabled).</li>
                   </ul>
                  </div>
                  </div>
                  <div style="background-color:rgba(0, 0, 0, 0.41); border: 2px solid rgba(255, 255, 255, 0.5); padding: 10px; border-radius: 5px; margin-bottom: 10px;">
                 <u><b><span style="font-size: 15px;">Allow Mention Users/Roles/Everyone</span></b></u><br>
                  <div style="display: flex; gap: 20px;">  
                   <ul style="flex: 1;  padding-left: 20px; margin: 0;">
                     <li>These options allow you to manage whether the message should ping users/roles/everyone.</li>
                   </ul>
                  </div>
                  </div>
                  <div style="background-color:rgba(0, 0, 0, 0.41); border: 2px solid rgba(255, 255, 255, 0.5); padding: 10px; border-radius: 5px; margin-bottom: 10px;">
                 <u><b><span style="font-size: 15px;">Suppress Notifications</span></b></u><br>
                  <div style="display: flex; gap: 20px;">  
                   <ul style="flex: 1;  padding-left: 20px; margin: 0;">
                     <li>When the option is enabled, notifications will not arrive.</li>
                   </ul>
                  </div>
                  </div>
                  <div style="background-color:rgba(0, 0, 0, 0.41); border: 2px solid rgba(255, 255, 255, 0.5); padding: 10px; border-radius: 5px; margin-bottom: 10px;">
                 <u><b><span style="font-size: 15px;">Message/Options to Edit</span></b></u><br>
                  <div style="display: flex; gap: 20px;">  
                   <ul style="flex: 1;  padding-left: 20px; margin: 0;">
                     <li>This option allows you to edit the message.</li>
                     <li>(Interaction Update), is used to edit the message being interacted with, this can be used in the buttons/select menu.</li>
                     <li>(Temp/Server/Global Variable), here you can manually enter a variable that contains the message object.</li>
                   </ul>
                  </div>
                  </div>
                  <div style="background-color:rgba(0, 0, 0, 0.41); border: 2px solid rgba(255, 255, 255, 0.5); padding: 10px; border-radius: 5px; margin-bottom: 10px;">
                 <u><b><span style="font-size: 15px;">Store Message In</span></b></u><br>
                  <div style="display: flex; gap: 20px;">  
                   <ul style="flex: 1;  padding-left: 20px; margin: 0;">
                     <li>Here you can save the message object (message) into a variable.</li>
                   </ul>
                  </div>
                  </div>
                </div>
              </help-icon>
      </span><br><input type="text" class="round" id="actionDescription" placeholder="Leave blank for default..."></td>
      <td style="padding:0px 0px 0px 10px;width:55px"><div style="float:left;padding:0px 0px 0px 7px;margin-top:-5px"></div><br><input type="color" value="#ffffff" class="round" id="actionDescriptionColor"></td>
      </tr></table>

      <hr class="subtlebar" style="margin-top: 4px; margin-bottom: 4px; width: 100%;">
      <br>
      

      <div style="padding-bottom: 12px;">
        <retrieve-from-variable allowNone dropdownLabel="Message/Options to Edit" selectId="editMessage" variableInputId="editMessageVarName" variableContainerId="editMessageVarNameContainer">
          <option value="intUpdate">Interaction Update</option>
        </retrieve-from-variable>
      </div>

      <br><br><br>

      <div style="padding-bottom: 12px;">
        <store-in-variable dropdownLabel="Store Message In" allowNone selectId="storage" variableInputId="varName2" variableContainerId="varNameContainer2"></store-in-variable>
      </div>

      <br><br>

      <div></div>
    </div>
  </tab>


</tab-system>`;
  },

  // ---------------------------------------------------------------------
  // Action Editor Init Code
  // ---------------------------------------------------------------------

  init() {
    const { document, glob } = this;

    const textarea = document.getElementById('message');
    const counter = document.getElementById('counter');
    const textLength = textarea.value.length;
    counter.textContent = `characters: ${textLength}`;
    textarea.addEventListener('input', () => {
      const textLength = textarea.value.length;
      counter.textContent = `characters: ${textLength}`;
    });

    glob.formatItemButton = function formatItemButton(data) {
      let setcor = '';
      if (data.type === '1') {
        setcor = 'rgb(88,101,242)';
      }
      if (data.type === '2' || data.type === '5') {
        setcor = 'rgb(78,80,88)';
      }
      if (data.type === '3') {
        setcor = 'rgb(36,128,70)';
      }
      if (data.type === '4') {
        setcor = 'rgb(218,55,60)';
      }
      let result = `<div style="display: inline-block; width: 100%;"><div style="width:10px;background:${setcor};float:left;margin-left:-10px"><br></div><table style="margin-left:10px"><tr><td style="width:100%">`;
      const comp = '0';
      switch (comp) {
        case '0':
          result += `${data.emoji} ${data.name}`;
          break;
      }

      return result;
    };

    glob.formatItemSelectMenu = function formatItemSelectMenu(data) {
      const selectMenuType = data.SelectMenuType;

      let result =
        '<div style="display: inline-block; width: 100%; padding-left: 8px">' +
        '<div style="float:left;width: calc(100% - 200px);overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">';

      result += data.placeholder;

      result +=
        "</div><div style='float:right;width:190px;text-align:right;padding:0px 10px 0px 0px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;'>";

      if (selectMenuType === 'StringSelectMenu') {
        result += `Options: ${data.options.length} / 25`;
      } else {
        result += selectMenuType.replace(/([A-Z])/g, ' $1').trim();
      }

      result += '</div></div>';

      return result;
    };

    glob.formatItemEmbed = function formatItemEmbed(data) {
      const maxLength = 30;
      const firstLine = data.description.substring(0, maxLength);
      const secondLine =
        data.description.length > maxLength ? data.description.substring(maxLength, maxLength * 2) : '';

      const result =
        `<div style="margin-left:-10px; background:${data.color}; float:left; width:10px; overflow:hidden; height:80px;"><br></div>` +
        `<div style="float:left; width:70%; overflow:hidden; margin-left:5px; white-space: normal; line-height: 1.2;">` +
        `<br>` +
        `<strong style='font-weight: bolder;'>${data.title}</strong>` +
        `<br>${firstLine}<br>${secondLine}</div>` +
        `<div style="float:right; width:19%; text-align:right; overflow:hidden;">${
          Number(data.formula) === 1 || Number(data.formula) === 2
            ? '<span style="float:right;" title="Condition enabled"> 🔘 </span>'
            : ''
        }</div>`;

      return result;
    };
  },

  // ---------------------------------------------------------------------
  // Action Editor On Save
  // ---------------------------------------------------------------------

  onSave(data, helpers) {
    if (Array.isArray(data?.buttons)) {
      for (let i = 0; i < data.buttons.length; i++) {
        if (!data.buttons[i].id) {
          data.buttons[i].id = `msg-button-${helpers.generateUUID().substring(0, 7)}`;
        }
      }
    }
    if (Array.isArray(data?.selectMenus)) {
      for (let i = 0; i < data.selectMenus.length; i++) {
        if (!data.selectMenus[i].id) {
          data.selectMenus[i].id = `msg-select-${helpers.generateUUID().substring(0, 7)}`;
        }
      }
    }
    return data;
  },

  // ---------------------------------------------------------------------
  // Action Editor On Paste
  // ---------------------------------------------------------------------

  onPaste(data, helpers) {
    if (Array.isArray(data?.buttons)) {
      for (let i = 0; i < data.buttons.length; i++) {
        const id = data.buttons[i].id;
        if (!id || id.startsWith('msg-button-')) {
          data.buttons[i].id = `msg-button-${helpers.generateUUID().substring(0, 7)}`;
        }
      }
    }
    if (Array.isArray(data?.selectMenus)) {
      for (let i = 0; i < data.selectMenus.length; i++) {
        const id = data.selectMenus[i].id;
        if (!id || id.startsWith('msg-select-')) {
          data.selectMenus[i].id = `msg-select-${helpers.generateUUID().substring(0, 7)}`;
        }
      }
    }
    return data;
  },

  // ---------------------------------------------------------------------
  // Action Bot Function
  // ---------------------------------------------------------------------

  async action(cache) {
    const data = cache.actions[cache.index];

    process.emitWarning = () => {};
    process.on('unhandledRejection', (reason) => {
      console.error('[Send Message] An error occurred:', reason);
      this.callNextAction(cache);
    });

    // ---------------------------------------------------------------------
    // region Obsługa Ustawień
    // ---------------------------------------------------------------------

    const settings = {
      reply: data.reply,
      ephemeral: data.ephemeral,
      tts: data.tts,
      overwrite: data.overwrite,
      dontSend: data.dontSend,
      pinned: data.pinned,
      selectMenuOnTop: data.selectMenuOnTop,
      suppressLinkEmbeds: data.suppressLinkEmbeds,
      suppressNotifications: data.suppressNotifications,
      allowMentionUsers: data.allowMentionUsers,
      allowMentionRoles: data.allowMentionRoles,
      allowMentionEveryone: data.allowMentionEveryone,
      allowMentionCommandUser: data.allowMentionCommandUser,
    };
    const interaction = cache.interaction?.__originalInteraction ?? cache.interaction;
    const channel = parseInt(data.channel, 10);
    let target = await this.getSendReplyTarget(channel, this.evalMessage(data.varName, cache), cache);
    const awaitResponses = [];

    // ---------------------------------------------------------------------
    // region Obsługa Wiadomości
    // ---------------------------------------------------------------------

    const messageContent = this.evalMessage(data.message, cache);

    // ---------------------------------------------------------------------
    // region Obsługa Embedów
    // ---------------------------------------------------------------------

    const EmbedBuilders = [];

    if (Array.isArray(data.embeds)) {
      const { EmbedBuilder, Colors } = this.getDBM().DiscordJS;

      for (const e of data.embeds) {
        const emb = new EmbedBuilder();

        if (e.title) emb.setTitle(this.evalMessage(e.title, cache));
        if (e.description) emb.setDescription(this.evalMessage(e.description, cache));
        if (e.url) emb.setURL(this.evalMessage(e.url, cache));

        if (e.color) {
          const raw = this.evalMessage(e.color, cache).trim();
          const key = raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
          let resolved = Colors[key];

          const custom = {
            red: '#FF0000',
            darkRed: '#CC0000',
            crimson: '#DC143C',
            tomato: '#FF6347',
            coral: '#FF7F50',
            orangeRed: '#FF4500',
            darkOrange: '#FF8C00',
            orange: '#FFA500',
            gold: '#FFD700',
            goldenRod: '#DAA520',
            amber: '#FFBF00',
            yellow: '#FFFF00',
            lightYellow: '#FFFFE0',
            lemon: '#FFF700',
            ivory: '#FFFFF0',
            chartreuse: '#7FFF00',
            lime: '#00FF00',
            lawnGreen: '#7CFC00',
            green: '#008000',
            forestGreen: '#228B22',
            seaGreen: '#2E8B57',
            springGreen: '#00FF7F',
            mediumSpringGreen: '#00FA9A',
            mint: '#98FF98',
            turquoise: '#40E0D0',
            aqua: '#00FFFF',
            cyan: '#00FFFF',
            lightCyan: '#E0FFFF',
            skyBlue: '#87CEEB',
            deepSkyBlue: '#00BFFF',
            dodgerBlue: '#1E90FF',
            blue: '#0000FF',
            mediumBlue: '#0000CD',
            royalBlue: '#4169E1',
            navy: '#000080',
            indigo: '#4B0082',
            blueViolet: '#8A2BE2',
            darkViolet: '#9400D3',
            darkOrchid: '#9932CC',
            purple: '#800080',
            mediumPurple: '#9370DB',
            violet: '#EE82EE',
            orchid: '#DA70D6',
            fuchsia: '#FF00FF',
            hotPink: '#FF69B4',
            deepPink: '#FF1493',
            pink: '#FFC0CB',
            lightPink: '#FFB6C1',
            paleVioletRed: '#DB7093',
            salmon: '#FA8072',
            white: '#FFFFFF',
            black: '#000000',
          };
          if (!resolved && custom[raw.toLowerCase()]) {
            resolved = custom[raw.toLowerCase()];
          }

          if (!resolved) resolved = raw;

          emb.setColor(resolved);
        }

        if (e.useTimestamp) {
          if (e.timestamp) {
            emb.setTimestamp(parseFloat(this.evalMessage(e.timestamp, cache)));
          } else {
            emb.setTimestamp();
          }
        }

        if (e.author) {
          emb.setAuthor({
            name: this.evalMessage(e.author, cache),
            iconURL: e.authorIcon ? this.evalMessage(e.authorIcon, cache) : undefined,
            url: e.authorUrl ? this.evalMessage(e.authorUrl, cache) : undefined,
          });
        }

        if (e.footerText) {
          emb.setFooter({
            text: this.evalMessage(e.footerText, cache),
            iconURL: e.footerIconUrl ? this.evalMessage(e.footerIconUrl, cache) : undefined,
          });
        }

        if (e.imageUrl) emb.setImage(this.evalMessage(e.imageUrl, cache));

        if (e.thumbUrl) emb.setThumbnail(this.evalMessage(e.thumbUrl, cache));

        if (Array.isArray(e.fields)) {
          for (const f of e.fields) {
            emb.addFields({
              name: this.evalMessage(f.name, cache),
              value: this.evalMessage(f.value, cache),
              inline: f.inline === 'true',
            });
          }
        }

        EmbedBuilders.push(emb);
      }
    }

    // ---------------------------------------------------------------------
    // region Obsługa Ankiet
    // ---------------------------------------------------------------------

    const pollQuestion = this.evalMessage(data.pollQuestion, cache);
    const pollDuration = this.evalMessage(data.pollDuration, cache) || '24';
    const pollAllowMultipleAnswers = data.pollAllowMultipleAnswers ? true : false;

    const pollAnswers = data.pollAnswers.map((answerData) => {
      return {
        text: this.evalMessage(answerData.pollAnswer, cache),
        emoji: this.evalMessage(answerData.pollEmoji, cache) || undefined,
      };
    });

    let messagePoll = undefined;

    if (pollQuestion && pollAnswers.length > 0) {
      messagePoll = {
        question: { text: pollQuestion },
        answers: pollAnswers,
        allowMultiselect: pollAllowMultipleAnswers,
        duration: pollDuration,
      };
    }

    // ---------------------------------------------------------------------
    // region Obsługa Przycisków
    // ---------------------------------------------------------------------

    const ButtonBuilders = [];

    const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = this.getDBM().DiscordJS;

    if (Array.isArray(data.buttons)) {
      let currentRow = new ActionRowBuilder();

      for (const b of data.buttons) {
        const btn = new ButtonBuilder();

        const style = this.evalMessage(b.type, cache);

        if (ButtonStyle[style]) {
          btn.setStyle(ButtonStyle[style]);
        } else {
          btn.setStyle(parseInt(style, 10));
        }

        const label = this.evalMessage(b.name, cache);
        if (label) btn.setLabel(label);
        if (b.emoji) btn.setEmoji(this.evalMessage(b.emoji, cache));

        if (b.ButtonDisabled === 'true') btn.setDisabled(true);

        if (style === ButtonStyle.Link || b.type === '5') {
          const url = this.evalMessage(b.url, cache);
          btn.setURL(url);
        } else {
          btn.setCustomId(b.id);
        }

        if (currentRow.components.length >= 5) {
          ButtonBuilders.push(currentRow);
          currentRow = new ActionRowBuilder();
        }

        if (Array.isArray(data.buttons)) {
          for (const b of data.buttons) {
            const userId = interaction?.user?.id || interaction?.member?.user?.id || null;
            const id = this.evalMessage(b.id, cache);
            const mode = b.mode ?? 'MULTI';
            const timeB = b.time ? parseInt(this.evalMessage(b.time, cache), 10) : 60000;
            if (mode !== 'PERSISTENT') {
              awaitResponses.push({
                type: 'BUTTON',
                time: timeB,
                id,
                user: mode.endsWith('PERSONAL') ? userId : null,
                multi: mode.startsWith('MULTI'),
                data: b,
              });
            }
          }
        }

        currentRow.addComponents(btn);
      }

      if (currentRow.components.length > 0) {
        ButtonBuilders.push(currentRow);
      }
    }

    // ---------------------------------------------------------------------
    // region Obsługa Select Menu
    // ---------------------------------------------------------------------

    const StringSelectMenuBuilders = [];

    const {
      StringSelectMenuBuilder,
      UserSelectMenuBuilder,
      RoleSelectMenuBuilder,
      MentionableSelectMenuBuilder,
      ChannelSelectMenuBuilder,
      ChannelType,
    } = this.getDBM().DiscordJS;

    if (Array.isArray(data.selectMenus)) {
      let currentRow = new ActionRowBuilder();

      for (const menu of data.selectMenus) {
        const type = this.evalMessage(menu.SelectMenuType, cache);
        const customId = menu.id;
        const disabled = menu.SelectMenuDisabled === 'true';
        const placeholder = this.evalMessage(menu.placeholder, cache);
        const min = parseInt(this.evalMessage(menu.min, cache), 10) || 1;
        const max = parseInt(this.evalMessage(menu.max, cache), 10) || 1;

        let builder;

        switch (type) {
          case 'StringSelectMenu': {
            builder = new StringSelectMenuBuilder()
              .setCustomId(customId)
              .setDisabled(disabled)
              .setPlaceholder(placeholder)
              .setMinValues(min)
              .setMaxValues(max);

            if (Array.isArray(menu.options)) {
              const options = menu.options.map((opt) => ({
                label: this.evalMessage(opt.label, cache),
                value: this.evalMessage(opt.value, cache),
                description: opt.description ? this.evalMessage(opt.description, cache) : undefined,
                emoji: opt.emoji ? this.evalMessage(opt.emoji, cache) : undefined,
                default: opt.default === 'true',
              }));
              builder.addOptions(options);
            }
            break;
          }

          case 'UserSelectMenu':
            builder = new UserSelectMenuBuilder();
            break;
          case 'RoleSelectMenu':
            builder = new RoleSelectMenuBuilder();
            break;
          case 'MentionableSelectMenu':
            builder = new MentionableSelectMenuBuilder();
            break;
          case 'ChannelSelectMenu':
            builder = new ChannelSelectMenuBuilder();
            break;
          case 'ChannelTextSelectMenu':
            builder = new ChannelSelectMenuBuilder().addChannelTypes(ChannelType.GuildText);
            break;
          case 'ChannelVoiceSelectMenu':
            builder = new ChannelSelectMenuBuilder().addChannelTypes(ChannelType.GuildVoice);
            break;
          case 'CategorySelectMenu':
            builder = new ChannelSelectMenuBuilder().addChannelTypes(ChannelType.GuildCategory);
            break;
          case 'ChannelStageSelectMenu':
            builder = new ChannelSelectMenuBuilder().addChannelTypes(ChannelType.GuildStageVoice);
            break;
          case 'ChannelForumSelectMenu':
            builder = new ChannelSelectMenuBuilder().addChannelTypes(ChannelType.GuildForum);
            break;
          case 'ChannelTextAndVoiceSelectMenu':
            builder = new ChannelSelectMenuBuilder().addChannelTypes(ChannelType.GuildText, ChannelType.GuildVoice);
            break;
          case 'ChannelTextAndCategorySelectMenu':
            builder = new ChannelSelectMenuBuilder().addChannelTypes(ChannelType.GuildText, ChannelType.GuildCategory);
            break;
          case 'ChannelTextAndStageSelectMenu':
            builder = new ChannelSelectMenuBuilder().addChannelTypes(
              ChannelType.GuildText,
              ChannelType.GuildStageVoice,
            );
            break;
          case 'ChannelTextAndForumSelectMenu':
            builder = new ChannelSelectMenuBuilder().addChannelTypes(ChannelType.GuildText, ChannelType.GuildForum);
            break;
          case 'ChannelVoiceAndCategorySelectMenu':
            builder = new ChannelSelectMenuBuilder().addChannelTypes(ChannelType.GuildVoice, ChannelType.GuildCategory);
            break;
          case 'ChannelVoiceAndStageSelectMenu':
            builder = new ChannelSelectMenuBuilder().addChannelTypes(
              ChannelType.GuildVoice,
              ChannelType.GuildStageVoice,
            );
            break;
          case 'ChannelVoiceAndForumSelectMenu':
            builder = new ChannelSelectMenuBuilder().addChannelTypes(ChannelType.GuildVoice, ChannelType.GuildForum);
            break;
          case 'ChannelCategoryAndStageSelectMenu':
            builder = new ChannelSelectMenuBuilder().addChannelTypes(
              ChannelType.GuildCategory,
              ChannelType.GuildStageVoice,
            );
            break;
          case 'ChannelCategoryAndForumSelectMenu':
            builder = new ChannelSelectMenuBuilder().addChannelTypes(ChannelType.GuildCategory, ChannelType.GuildForum);
            break;
          case 'ChannelStageAndForumSelectMenu':
            builder = new ChannelSelectMenuBuilder().addChannelTypes(
              ChannelType.GuildStageVoice,
              ChannelType.GuildForum,
            );
            break;

          default:
            continue;
        }

        if (builder) {
          builder
            .setCustomId(customId)
            .setDisabled(disabled)
            .setPlaceholder(placeholder)
            .setMinValues(min)
            .setMaxValues(max);
        }

        const componentType = builder.data.type;
        const isSelectMenu = [3, 5, 6, 7, 8].includes(componentType);

        const id = this.evalMessage(menu.id, cache);
        if (!this.$select) this.$select = {};
        this.$select[id] = menu;

        if (isSelectMenu) {
          if (currentRow.components.length > 0) {
            StringSelectMenuBuilders.push(currentRow);
          }
          currentRow = new ActionRowBuilder().addComponents(builder);
          StringSelectMenuBuilders.push(currentRow);
          currentRow = new ActionRowBuilder();

          if (Array.isArray(data.selectMenus)) {
            for (const s of data.selectMenus) {
              const userId = interaction?.user?.id || interaction?.member?.user?.id || null;
              const id = this.evalMessage(s.id, cache);
              const mode = s.mode ?? 'MULTI';
              const timeS = s.time ? parseInt(this.evalMessage(s.time, cache), 10) : 60000;
              if (mode !== 'PERSISTENT') {
                awaitResponses.push({
                  type: 'SELECT',
                  time: timeS,
                  id,
                  user: mode.endsWith('PERSONAL') ? userId : null,
                  multi: mode.startsWith('MULTI'),
                  data: s,
                });
              }
            }
          }
        } else {
          if (currentRow.components.length >= 5) {
            StringSelectMenuBuilders.push(currentRow);
            currentRow = new ActionRowBuilder();
          }

          currentRow.addComponents(builder);
        }
      }

      if (currentRow.components.length > 0) {
        StringSelectMenuBuilders.push(currentRow);
      }
    }

    // ---------------------------------------------------------------------
    // region Obsługa Plików
    // ---------------------------------------------------------------------

    const messageFiles = [];

    const { basename, AttachmentBuilder } = this.getDBM().DiscordJS;

    if (Array.isArray(data.attachments)) {
      for (const a of data.attachments) {
        const url = this.evalMessage(a.url, cache);
        if (!url) continue;

        const name = a.name ? this.evalMessage(a.name, cache) : basename(url);

        const attach = new AttachmentBuilder(url, { name });

        if (a.spoiler === true || a.spoiler === 'true') {
          attach.setSpoiler(true);
        }

        messageFiles.push(attach);
      }
    }

    // ---------------------------------------------------------------------
    // region Ustawienia Wiadomości
    // ---------------------------------------------------------------------

    const mentionParse = [];
    if (settings.allowMentionUsers) mentionParse.push('users');
    if (settings.allowMentionRoles) mentionParse.push('roles');
    if (settings.allowMentionEveryone) mentionParse.push('everyone');
    const replied = Boolean(settings.allowMentionCommandUser);

    const componentButtons = ButtonBuilders;
    const componentSelects = StringSelectMenuBuilders;
    const finalComponents = settings.selectMenuOnTop
      ? [...componentSelects, ...componentButtons]
      : [...componentButtons, ...componentSelects];

    let flags = 0;
    if (settings.ephemeral === true || settings.ephemeral === 'true') {
      flags |= 64;
    }
    if (settings.suppressLinkEmbeds === true || settings.suppressLinkEmbeds === 'true') {
      flags |= 4;
    }
    if (settings.suppressNotifications === true || settings.suppressNotifications === 'true') {
      flags |= 4096;
    }

    // ---------------------------------------------------------------------
    // region Tworzenie Wiadomości
    // ---------------------------------------------------------------------

    let payload = {
      content: messageContent,
      tts: settings.tts,
      embeds: EmbedBuilders,
      components: finalComponents,
      files: messageFiles,
      flags: flags !== 0 ? flags : undefined,
      ...(messagePoll ? { poll: messagePoll } : {}),
      allowedMentions: {
        parse: mentionParse,
        replied_user: replied,
      },
    };

    // ---------------------------------------------------------------------
    // region Wysyłanie wiadomości
    // ---------------------------------------------------------------------

    // -------------------------
    // Nie Wysyłaj
    // -------------------------

    if (settings.dontSend) {
      const varName2 = this.evalMessage(data.varName2, cache);
      const storage = parseInt(data.storage, 10);
      payload._awaitResponses = awaitResponses;
      this.storeValue(payload, storage, varName2, cache);
      this.callNextAction(cache);
      return;
    }

    // ---------------------------------------------------------------------
    // region Wysyłanie
    // ---------------------------------------------------------------------

    const { Message } = this.getDBM().DiscordJS;

    let isEdit = 0;
    if (data.editMessage === 'intUpdate') {
      isEdit = 2;
    } else {
      const editMessage = parseInt(data.editMessage, 10);
      if (typeof editMessage === 'number' && editMessage >= 0) {
        const editVarName = this.evalMessage(data.editMessageVarName, cache);
        const editObject = this.getVariable(editMessage, editVarName, cache);
        const { Message } = this.getDBM().DiscordJS;
        if (editObject) {
          if (editObject instanceof Message) {
            target = editObject;
            isEdit = 1;
          }
        }
      }
    }

    // ---------------------------------------------------------------------
    // region overwrite Payload
    // ---------------------------------------------------------------------

    if (!settings.overwrite) {
      let oldPayload = {};
      let oldMessage = null;

      if (isEdit === 1 && target instanceof Message) {
        oldMessage = target;
      } else if (isEdit === 2 && cache.interaction?.message) {
        oldMessage = cache.interaction.message;
      }

      if (oldMessage) {
        oldPayload = {
          content: oldMessage.content,
          embeds: oldMessage.embeds,
          components: oldMessage.components,
          files: oldMessage.attachments.map((a) => a),
        };
      }

      payload = {
        ...oldPayload,
        ...payload,
        content: [oldPayload.content, payload.content].filter(Boolean).join('\n'),
        embeds: [...(oldPayload.embeds || []), ...(payload.embeds || [])],
        components: [...(oldPayload.components || []), ...(payload.components || [])],
        files: [...(oldPayload.files || []), ...(payload.files || [])],
      };
    }

    // //

    let defaultResultMsg = null;
    const onComplete = (resultMsg) => {
      if (defaultResultMsg) {
        resultMsg ??= defaultResultMsg;
      }

      if (resultMsg) {
        const varName2 = this.evalMessage(data.varName2, cache);
        const storage = parseInt(data.storage, 10);
        this.storeValue(resultMsg, storage, varName2, cache);
        this.callNextAction(cache);

        for (let i = 0; i < awaitResponses.length; i++) {
          const response = awaitResponses[i];
          const originalInteraction = cache.interaction?.__originalInteraction ?? cache.interaction;
          const tempVariables = cache.temp || {};

          this.registerTemporaryInteraction(
            resultMsg.id,
            response.time,
            response.id,
            response.user,
            response.multi,
            (interaction) => {
              if (response.data) {
                interaction.__originalInteraction = originalInteraction;
                if (response.type === 'BUTTON') {
                  this.preformActionsFromInteraction(interaction, response.data, cache.meta, tempVariables);
                } else {
                  this.preformActionsFromSelectInteraction(interaction, response.data, cache.meta, tempVariables);
                }
              }
            },
          );
        }
      } else {
        this.callNextAction(cache);
      }

      if (settings.pinned && resultMsg?.pin instanceof Function) {
        resultMsg.pin().catch(() => {});
      }
    };

    const isMessageTarget = target instanceof this.getDBM().DiscordJS.Message;

    const sameId = target?.id?.length > 0 && (target?.id ?? '') === cache?.interaction?.channel?.id;
    const sameChannel = channel === 0 || sameId;
    const canReply = !isMessageTarget && cache?.interaction?.replied === false && sameChannel;

    if (data.dontSend) {
      const varName2 = this.evalMessage(data.varName2, cache);
      const storage = parseInt(data.storage, 10);
      payload._awaitResponses = awaitResponses;
      this.storeValue(payload, storage, varName2, cache);
      this.callNextAction(cache);
    } else if (Array.isArray(target)) {
      this.callListFunc(target, 'send', [payload]).then(onComplete);
    } else if (isEdit === 2) {
      let promise = null;

      defaultResultMsg = cache.interaction?.message;

      if (cache.interaction?.replied && cache.interaction?.editReply) {
        promise = cache.interaction.editReply(payload);
      } else if (cache?.interaction?.update) {
        promise = cache.interaction.update(payload);
      } else {
        this.displayError(
          data,
          cache,
          'Send Message -> Message/Options to Edit -> Interaction Update / Could not find interaction to edit',
        );
      }

      if (promise) {
        promise.then(onComplete).catch((err) => this.displayError(data, cache, err));
      }
    } else if (isEdit === 1 && target?.edit) {
      target
        .edit(payload)
        .then(onComplete)
        .catch((err) => this.displayError(data, cache, err));
    } else if (isMessageTarget && target?.reply) {
      target
        .reply(payload)
        .then(onComplete)
        .catch((err) => this.displayError(data, cache, err));
    } else if (data.reply === true && canReply) {
      payload.fetchReply = true;

      let promise = null;
      if (cache.interaction.deferred) {
        promise = cache.interaction.editReply(payload);
      } else {
        promise = cache.interaction.reply(payload);
      }
      promise.then(onComplete).catch((err) => this.displayError(data, cache, err));
    } else if (settings.reply && cache.msg && typeof cache.msg.reply === 'function') {
      cache.msg
        .reply(payload)
        .then(onComplete)
        .catch((err) => this.displayError(data, cache, err));
    } else if (target?.send) {
      target
        .send(payload)
        .then(onComplete)
        .catch((err) => this.displayError(data, cache, err));
    } else {
      this.callNextAction(cache);
    }

    // ---------------------------------------------------------------------
    // region Koniec
    // ---------------------------------------------------------------------
  },

  // ---------------------------------------------------------------------
  // Action Bot Mod Init
  // ---------------------------------------------------------------------

  modInit(data) {
    if (Array.isArray(data?.buttons)) {
      for (let i = 0; i < data.buttons.length; i++) {
        const button = data.buttons[i];
        if (button.mode === 'PERSISTENT') {
          this.registerButtonInteraction(button.id, button);
        }
        this.prepareActions(button.actions);
      }
    }

    if (Array.isArray(data?.selectMenus)) {
      for (let i = 0; i < data.selectMenus.length; i++) {
        const select = data.selectMenus[i];

        if (select.mode === 'PERSISTENT') {
          this.registerSelectMenuInteraction(select.id, select);
        }

        this.prepareActions(select.actions);
      }
    }
  },

  // ---------------------------------------------------------------------
  // Action Bot Mod
  // ---------------------------------------------------------------------

  mod() {},
};
