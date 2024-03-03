const { BufferJSON, WA_DEFAULT_EPHEMERAL, generateWAMessageFromContent, proto, generateWAMessageContent, downloadContentFromMessage, generateWAMessage, prepareWAMessageMedia, areJidsSameUser, getContentType, GroupSettingChange } = require("@adiwajshing/baileys");
const child_process = require('child_process'); 
const { Octokit } = require("@octokit/rest");
const moment = require('moment-timezone');
const speed = require('performance-now')
const path = require('path');
const axios = require('axios');
const fs = require("fs");
const os = require('os');
const util = require("util");
const chalk = require("chalk");
const { Configuration, OpenAIApi } = require("openai");
const weatherConfig = require('./weather.json');
let setting = require("./apikey.json");
module.exports = ridwanz = async (client, m, chatUpdate, store) => {
try {
var body =
m.mtype === "conversation"
? m.message.conversation
: m.mtype == "imageMessage"
? m.message.imageMessage.caption
: m.mtype == "videoMessage"
? m.message.videoMessage.caption
: m.mtype == "extendedTextMessage"
? m.message.extendedTextMessage.text
: m.mtype == "buttonsResponseMessage"
? m.message.buttonsResponseMessage.selectedButtonId
: m.mtype == "listResponseMessage"
? m.message.listResponseMessage.singleSelectReply.selectedRowId
: m.mtype == "templateButtonReplyMessage"
? m.message.templateButtonReplyMessage.selectedId
: m.mtype === "messageContextInfo"
? m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply.selectedRowId || m.text
: "";
var budy = typeof m.text == "string" ? m.text : "";
var prefix = /^[\\/!#.]/gi.test(body) ? body.match(/^[\\/!#.]/gi) : "/";
const isCmd2 = body.startsWith(prefix);
const command = body.replace(prefix, "").trim().split(/ +/).shift().toLowerCase();
const args = body.trim().split(/ +/).slice(1);
const pushname = m.pushName || "No Name";
const ownerData = JSON.parse(fs.readFileSync('./owner.json'));
const ownerNumber = ownerData.ownerNumber;
const itsMe = m.sender == ownerNumber ? true : false;
let text = (q = args.join(" "));
const arg = budy.trim().substring(budy.indexOf(" ") + 1);
const arg1 = arg.trim().substring(arg.indexOf(" ") + 1);
const from = m.chat;
const reply = m.reply;
const sender = m.sender;
const mek = chatUpdate.messages[0];
const color = (text, color) => { 
return !color ? chalk.green(text) : chalk.keyword(color)(text);
};
//Animasi Loading
const antidel = [];
const isCmd = body.startsWith(prefix);
const autodelete = from && isCmd ? antidel.includes(from) : false;
async function loading() {
const progressBarLength = 10;
let { key } = await client.sendMessage(from, { text: '' });
for (let i = 0; i <= progressBarLength; i++) {
const percentage = i * 10;
const progress = `[${"■".repeat(i)}${"□".repeat(progressBarLength - i)}] ${percentage}%`;
await client.sendMessage(from, { text: `*${progress}*`, edit: key });
await new Promise(resolve => setTimeout(resolve, 100));
}
}
if (autodelete) {
client.sendMessage(m.chat, {
delete: {
remoteJid: m.chat,
fromMe: true,
id: mek.key.id,
participant: mek.key.participant
}
});
}
// Auto Read
client.sendPresenceUpdate('composing', from);
client.sendPresenceUpdate('available', from)
client.readMessages([m.key]);
// Batas Awal
const groupMetadata = m.isGroup ? await client.groupMetadata(m.chat).catch((e) => {}) : "";
const groupName = m.isGroup ? groupMetadata.subject : "";
let argsLog = budy.length > 30 ? `${q.substring(0, 30)}...` : budy;
if (isCmd2 && !m.isGroup) {
console.log(chalk.black(chalk.bgWhite("[ LOGS ]")), color(argsLog, "turquoise"), chalk.magenta("From"), chalk.green(pushname), chalk.yellow(`[ ${m.sender.replace("@s.whatsapp.net", "")} ]`));
 } else if (isCmd2 && m.isGroup) {
console.log(
chalk.black(chalk.bgWhite("[ LOGS ]")),
color(argsLog, "turquoise"),
chalk.magenta("From"),
chalk.green(pushname),
chalk.yellow(`[ ${m.sender.replace("@s.whatsapp.net", "")} ]`),
chalk.blueBright("IN"),
chalk.green(groupName)
);
}
if (isCmd2) {
switch (command) { 
case "menu":
case "help":
try {
await loading()
const platform = os.platform();
const uptime = process.uptime();
const hours = Math.floor(uptime / 3600);
const minutes = Math.floor((uptime % 3600) / 60);
const seconds = Math.floor(uptime % 60);
const currentDate = moment();
currentDate.tz('Asia/Jakarta');
const dayOfWeek = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const dayIndex = currentDate.day();
const gregorianDayName = dayOfWeek[dayIndex];
const wibTime = currentDate.format('HH:mm');
const dayOfMonth = currentDate.date();
const monthIndex = currentDate.month();
const year = currentDate.year();
const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const monthName = monthNames[monthIndex];
const formattedDateString = `${dayOfMonth} ${monthName} ${year}`;
const combinedDayName = `${gregorianDayName}`;
let greeting = '';
const currentHour = currentDate.hours();
if (currentHour >= 0 && currentHour < 12) {
 greeting = 'Pagi 🌄';
} else if (currentHour >= 12 && currentHour < 15) {
 greeting = 'Siang ☀️';
} else if (currentHour >= 15 && currentHour < 18) {
 greeting = 'Sore 🌅';
} else {
 greeting = 'Malam 🌙';
}
const menuText = `
ʜᴀʟʟᴏ ᴋᴀᴋ *${pushname}👋*

╭─────•「 *RIDZ-BOTZ* 」•─────•
│• *ᴘʟᴀᴛꜰᴏʀᴍ :* ${platform}
│• *ʙᴀʜᴀsᴀ :* Node.js
│• *ʀᴜɴᴛɪᴍᴇ :* ${hours} Jam, ${minutes} Menit, ${seconds} Detik
│• *sᴇʟᴀᴍᴀᴛ :* ${greeting}
│• *ʜᴀʀɪ :* ${combinedDayName}
│• *ᴊᴀᴍ :* ${wibTime} WIB
│• *ᴛᴀɴɢɢᴀʟ :* ${formattedDateString}
╰─────────────•
╭─────────•
│».ᴏᴡɴᴇʀʙᴏᴛ
│».sᴇᴛʙɪᴏʙᴏᴛ
│».ɪɴsᴛᴀʟʟᴍᴏᴅᴜʟᴇ
│».ᴅᴇʟᴇᴛᴇᴍᴏᴅᴜʟᴇ
│».ʟɪsᴛᴍᴏᴅᴜʟ
│».ɢᴇᴛᴀᴘɪᴋᴇʏ
│».sᴇᴛᴏᴘᴇɴᴀɪ
│».ᴄʜᴀᴛɢᴘᴛ
│».ᴏᴘᴇɴᴀɪ
│».ʀᴜɴᴛɪᴍᴇ
│».ʀᴇsᴛᴀʀᴛ
│».ɢɪᴛʜᴜʙsᴇᴀʀᴄʜ
│».ᴅᴇʟʀᴇᴘᴏsɪᴛᴏʀɪ
│».ɢᴇᴛꜰɪʟᴇʀᴇᴘᴏ
│».ɪɴꜰᴏɢɪᴛʜᴜʙ
│».ɪɴꜰᴏɢʀᴏᴜᴘ
│».ʟɪɴᴋɢʀᴏᴜᴘ
│».ᴊᴏɪɴɢʀᴏᴜᴘ
│».ᴏᴜᴛɢʀᴏᴜᴘ
│».ʜɪᴅᴇᴛᴀɢ
│».ʀᴇᴠᴏᴋᴇ
│».ɢᴇᴛꜰɪʟᴇ
│».sᴀᴠᴇꜰɪʟᴇ
│».ᴅᴇʟꜰɪʟᴇ
│».ᴘɪɴɢ
│».ᴅᴇʟᴇᴛᴇ
│».ᴄᴜᴀᴄᴀ
╰────────• `;
const menuImage = fs.readFileSync('./menu.jpg');
await client.sendMessage(from, { image: menuImage, caption: menuText });
} catch (error) {
m.reply(`Error: ${error.message}`);
}
break;

case 'ownerbot':
case 'owner': {
let vcard = 'BEGIN:VCARD\n'
+ 'VERSION:3.0\n' 
+ 'N:;Ridwanz Saputra;;;'
 + 'FN:Ridwanz Saputra\n' 
+ 'ORG:Owner Bot;\n'
+ 'TEL;type=CELL;type=VOICE;waid=6285225416745:+6285225416745\n'
+ 'END:VCARD'
client.sendMessage(m.chat, { contacts: { displayName: '@RidwanzSaputra', contacts: [{ vcard }] } }, { quoted: m })
}
break

// Function Runtime
function runtime(seconds) {
const hours = Math.floor(seconds / 3600);
const minutes = Math.floor((seconds % 3600) / 60);
const secondsRemaining = Math.floor(seconds % 60);
return `${hours} hours, ${minutes} minutes, ${secondsRemaining} seconds`;
}
// Function Formatp
function formatp(bytes) {
const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
if (bytes === 0) return '0 Byte';
const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
return Math.round(100 * (bytes / Math.pow(1024, i))) / 100 + ' ' + sizes[i];
}
// Fungsi Case Ping
case 'ping':
{
await loading()
const used = process.memoryUsage();
const cpus = os.cpus().map(cpu => {
cpu.total = Object.keys(cpu.times).reduce((last, type) => last + cpu.times[type], 0);
return cpu;
});
const cpu = cpus.reduce((last, cpu, _, { length }) => {
last.total += cpu.total;
last.speed += cpu.speed / length;
last.times.user += cpu.times.user;
last.times.nice += cpu.times.nice;
last.times.sys += cpu.times.sys;
last.times.idle += cpu.times.idle;
last.times.irq += cpu.times.irq;
return last;
}, {
speed: 0,
total: 0,
times: {
user: 0,
nice: 0,
sys: 0,
idle: 0,
irq: 0
}
});
let timestamp = speed();
let latensi = speed() - timestamp;
neww = performance.now();
oldd = performance.now();
respon = `
*RESPONSE TIME :* ${latensi.toFixed(4)} seconds
*ACTIVE FOR :* ${runtime(process.uptime())}
*RAM USAGE :* ${formatp(os.totalmem() - os.freemem())} / ${formatp(os.totalmem())}

*MEMORY USAGE (Node.js) :*
${Object.keys(used).map((key, _, arr) => `${key.padEnd(Math.max(...arr.map(v => v.length)), ' ')}: ${formatp(used[key])}`).join('\n')}

${cpus[0] ? `*TOTAL CPU USAGE :* 
${cpus[0].model.trim()} (${cpu.speed} MHz)\n${Object.keys(cpu.times).map(type => ` - ${type.padEnd(6)}: ${(100 * cpu.times[type] / cpu.total).toFixed(2)}%`).join('\n')}

*CPU CORE USAGE (${cpus.length} Core CPU) :*
${cpus.map((cpu, i) => `${i + 1}. ${cpu.model.trim()} (${cpu.speed} MHz)\n${Object.keys(cpu.times).map(type => ` - ${type.padEnd(6)}: ${(100 * cpu.times[type] / cpu.total).toFixed(2)}%`).join('\n')}`).join('\n\n')}` : ''}
`.trim();
reply(respon);
}
break;

case "uptime":
case "runtime":
const uptime = process.uptime();
const hours = Math.floor(uptime / 3600);
const minutes = Math.floor((uptime % 3600) / 60);
const seconds = Math.floor(uptime % 60);
const uptimeString = `${hours} Jam, ${minutes} Menit, ${seconds} Detik`;
m.reply(`*Bot Aktif Selama :*\n${uptimeString}`);
break;

case 'restart':
if (!itsMe) return reply('Only the owner can use this command.');
await loading()
setTimeout(() => {
process.exit(1);
}, 2000);
break;

case "ai": 
case "chatgpt":
case "openai": 
try {
if (!text) return reply(`*Contoh :*\n${prefix}${command} Siapa Mark Zuckerberg.`);
const configuration = new Configuration({
apiKey: setting.apikey,
});
const openai = new OpenAIApi(configuration);
/*const response = await openai.createCompletion({
model: "text-davinci-002",
prompt: text,
temperature: 0, // Higher values means the model will take more risks.
max_tokens: 2048, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
top_p: 1, // alternative to sampling with temperature, called nucleus sampling
frequency_penalty: 0.3, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
presence_penalty: 0 // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
});
m.reply(`${response.data.choices[0].text}`);*/
const response = await openai.createChatCompletion({
model: "gpt-3.5-turbo-0301",
messages: [{role: "user", content: text}],
});
m.reply(`${response.data.choices[0].message.content}`);
} catch (error) {
if (error.response) {
console.log(error.response.status);
console.log(error.response.data);
console.log(`${error.response.status}\n\n${error.response.data}`);
} else {
console.log(error);
m.reply("Error :"+ error.message);
}
}
break;

case 'setopenai':
try {
if (!itsMe) return reply('Hanya pemilik dapat menggunakan perintah ini.');
if (!args[0]) return reply("*Contoh :*\n.setopenai <apikey baru>");
setting.apikey = args[0];
fs.writeFileSync('./apikey.json', JSON.stringify(setting, null, 2));
return reply(`API key OpenAI Berhasil Diperbarui Menjadi : *${args[0]}*`);
} catch (error) {
m.reply(`Error: ${error.message}`);
}
break;

case 'getapikey':
try {
if (!itsMe) return reply('Only the owner can use this command.');
const currentApiKey = setting.apikey;
return reply(`*Current OpenAI API key :*\n${currentApiKey}`);
} catch (error) {
m.reply(`Error: ${error.message}`);
}
break;

case "githubsearch":
try {
if (!args[0]) return reply("*Contoh :*\ngithubsearch <username>");
const githubUsername = args[0];
const githubUserApiUrl = `https://api.github.com/users/${githubUsername}`;
const githubReposApiUrl = `https://api.github.com/users/${githubUsername}/repos`;
const [userResponse, reposResponse] = await Promise.all([
axios.get(githubUserApiUrl),
axios.get(githubReposApiUrl),
 ]);
const userData = userResponse.data;
const githubRepos = reposResponse.data;
if (!userData || githubRepos.length === 0) {
return reply(`No information found for GitHub user: ${githubUsername}`);
 }
const fullName = userData.name || "N/A";
const followers = userData.followers || 0;
const following = userData.following || 0;
const publicRepos = userData.public_repos || 0;
const createdAt = new Date(userData.created_at).toLocaleDateString();
const repoList = githubRepos
.map(
(repo, index) =>
`*${index + 1}. ${repo.name}*\n *[GitHub Repo]*\n(${repo.html_url})\n *Updated at:* ${new Date(
repo.updated_at
).toLocaleDateString()}`
)
.join("\n\n");
const responseText = `
*GitHub Profile for (${githubUsername})*

- *Full Name :* ${fullName}
- *Followers :* ${followers}
- *Following :* ${following}
- *Public Repositories :* ${publicRepos}
- *Account Created At :* ${createdAt}

*Number of Repositories (${githubRepos.length}):*\n
${repoList}
`;

return reply(responseText);
} catch (error) {
m.reply(`Error: ${error.message}`);
}
break;

case 'infogithub':
try {
if (!args[0]) return reply(`*Contoh:*\n${prefix}${command} <namagithub>`);
const octokit = new Octokit({
 auth: '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',
});
const ownerInfo = args[0];
const userInfo = await octokit.users.getByUsername({
username: ownerInfo
});
const repoInfo = await octokit.repos.listForUser({
username: ownerInfo,
per_page: 100
});
const repoCount = repoInfo.data.length;
const userDisplayName = userInfo.data.name || 'Tidak tersedia';
const joinDate = new Date(userInfo.data.created_at).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }); 
reply(`Informasi GitHub *${ownerInfo}*:\n\nNama : *${userDisplayName}*\nJumlah Repository : *${repoCount}*\nTanggal Bergabung :\n*${joinDate}*`);
} catch (error) {
reply(`Error: ${error.message}`);
}
break;

case 'delrepositori':
try { 
if (!args[0]) return reply(`*Contoh :*\n${prefix}${command} namagithub|namarepo|tokengithub`); 
const [owner, repo, token] = args[0].split('|');
const octokitWithToken = new Octokit({
auth: token,
}); 
const response = await octokitWithToken.request('DELETE /repos/{owner}/{repo}', {
owner: owner,
repo: repo,
}); 
reply(`Repository *${owner}/${repo}* Berhasil Dihapus.`);
} catch (error) {
if (error.status === 401) {
reply("Token GitHub Tidak Valid.");
} else {
reply(`Error: ${error.message}`);
}
}
break;

case 'join':
case 'joingroup':
if (!itsMe) return reply('Only the owner can use this command.');
if (args.length < 1) return reply(`*Contoh :*\n${prefix}${command} _linkgrup_`);
let link = args[0].startsWith("http");
if (!link) return reply(`Kirim perintah ${command} _linkgrup_`);
let groupLink = args[0];
let groupId = groupLink.split('https://chat.whatsapp.com/')[1];
await client.groupAcceptInvite(groupId);
reply("Berhasil Bergabung Ke Group!");
break;

case 'outgroup':
case 'out':
if (!itsMe) return reply('Only the owner can use this command.');
if (!m.isGroup) return reply("Command ini hanya bisa digunakan di dalam grup.");
await client.groupLeave(from);
break;

case 'installmodule':
if (!itsMe) return reply('Only the owner can use this command.');
if (!args[0]) return reply("Please provide the module name to install.");
await loading()
const moduleName = args[0];
child_process.exec(`npm install ${moduleName}`, (error, stdout, stderr) => {
if (error) {
console.error(`exec error: ${error}`);
reply(`Error: ${error.message}`);
return;
}
console.log(`stdout: ${stdout}`);
console.error(`stderr: ${stderr}`);
reply(`Module *${moduleName}* Installed Successfully.`);
});
break;
 
case 'deletemodule':
if (!itsMe) return reply('Only the owner can use this command.');
if (!args[0]) return reply("Please provide the module name to uninstall.");
await loading()
const moduleToDelete = args[0];
child_process.exec(`npm uninstall ${moduleToDelete}`, (error, stdout, stderr) => {
if (error) {
console.error(`exec error: ${error}`);
reply(`Error: ${error.message}`);
return;
}
console.log(`stdout: ${stdout}`);
console.error(`stderr: ${stderr}`);
reply(`Module *${moduleToDelete}* Uninstalled Successfully.`);
});
break;

case 'listmodule':
if (!itsMe) return reply('Only the owner can use this command.');
await loading()
child_process.exec(`npm ls --depth=0 --json`, (error, stdout, stderr) => {
if (error) {
console.error(`exec error: ${error}`);
reply(`Error: ${error.message}`);
return;
}
const moduleList = JSON.parse(stdout).dependencies;
let modules = "";
for (const module in moduleList) {
modules += `- ${module}\n`;
}
const message = `*List Of Installed Modules :*\n${modules}`;
reply(message);
});
break;

case "getfile":
try {
if (!itsMe) return reply('Only the owner can use this command.');
if (!args[0]) return reply("*Contoh :*\n.getfile <nama file>");
const filename = args[0];
const filePath = __dirname + "/" + filename;
const fileContent = fs.readFileSync(filePath, 'utf8');
m.reply(`${fileContent}`);
} catch (error) {
m.reply(`Error: ${error.message}`);
}
break;

case "savefile":
try {
if (!itsMe) return reply('Only the owner can use this command.');
if (!args[0]) return reply("*Contoh :*\n.savefile <nama file> <reply pesan>");
const filename = args[0];
const quotedMessage = m.quoted && m.quoted.text ? m.quoted.text : null;
if (!quotedMessage) return reply('Reply to a message to save its content as a file.');
const filePath = __dirname + "/" + filename;
fs.writeFileSync(filePath, quotedMessage, 'utf8');
m.reply(`File *${filename}* Saved Successfully.`);
} catch (error) {
m.reply(`Error: ${error.message}`);
}
break;

case "delfile":
try {
if (!itsMe) return reply('Only the owner can use this command.');
if (!args[0]) return reply("*Contoh :*\n.hapusfile <nama file>");
const fileNameToDelete = args[0];
const filePathToDelete = __dirname + "/" + fileNameToDelete;
fs.unlinkSync(filePathToDelete);
reply(`File *${fileNameToDelete}* Berhasil Dihapus.`);
} catch (error) {
reply(`Error: ${error.message}`);
}
break;

case 'infogroup':
try {
if (!m.isGroup) return reply("Command ini hanya bisa digunakan di dalam grup.");
const groupMetadata = await client.groupMetadata(m.chat);
const creationDate = new Date(groupMetadata.creation * 1000);
const formatter = new Intl.DateTimeFormat('id-ID', {
weekday: 'long',
day: 'numeric',
month: 'long',
year: 'numeric',
hour: 'numeric',
minute: 'numeric',
hour12: false,
timeZone: 'Asia/Jakarta'
});
const createDateFormatted = formatter.format(creationDate);
const info = `
ℹ️ *INFORMASI GROUP* ℹ️\n
Nama Group : \n*${groupMetadata.subject}*\n
Jumlah Anggota :\n*${groupMetadata.participants.length} Anggota*\n
Dibuat pada :\n*${createDateFormatted} WIB*`;
reply(info);
} catch (error) {
console.error(error);
reply("Terjadi Kesalahan Saat Mengambil Informasi Group.");
}
break;

case 'linkgroup':
if (!itsMe) return reply('Only the owner can use this command.');
if (!m.isGroup) return reply("Command ini hanya bisa digunakan di dalam grup.");
await client.groupInviteCode(from).then(url => {
const link = 'https://chat.whatsapp.com/' + url;
reply(link);
}).catch(() => {
});
break;

case 'revoke':
if (!itsMe) return reply('Only the owner can use this command.');
if (!m.isGroup) return reply("Command ini hanya bisa digunakan di dalam grup.");
await client.groupRevokeInvite(from).then(res => {
reply('Successfully Revoked Link Group.');
}).catch(err => {
console.error(err);
});
break;

case "hidetag":
try {
if (!itsMe) return reply('Only the owner can use this command.');
if (!m.isGroup) return reply("Command ini hanya bisa digunakan di dalam grup.");
const groupMetadata = await client.groupMetadata(m.chat);
const participants = groupMetadata?.participants || [];
if (participants.length > 0) {
let members = "";
participants.forEach((member, index) => {
members += `${index+1}. @${(member.id || '').replace('@s.whatsapp.net', '')}\n`;
});
return reply(`${members}`);
} else {
return reply("No Group Members Found.");
}
} catch (error) {
return reply(`Error: ${error.message}`);
}
break;

case 'delete':{
client.sendMessage(m.chat,
{
delete: {
remoteJid: m.chat,
fromMe: false,
id: m.quoted.id,
participant: m.quoted.sender
}
})
}
break

case "setbiobot":
try {
if (!itsMe) return reply('Only the owner can use this command.');
if (!args[0]) 
return reply("*Contoh :*\n.setbiobot <bio baru>");
const newBio = args.join(" ");
client.setStatus(newBio);
return reply(`Bio Bot Berhasil Di Ubah Jadi :\n*${newBio}*`);
} catch (error) {
m.reply(`Error: ${error.message}`);
}
break;

case "cuaca":
try {
if (!args[0]) return reply("*Contoh :*\n.cuaca Inggris"); 
const cityName = args[0];
const weatherApiKey = weatherConfig.openWeatherMapApiKey;
const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${weatherApiKey}&units=metric`;
const weatherResponse = await axios.get(weatherApiUrl);
const weatherData = weatherResponse.data;
if (weatherData.cod === '404') {
return reply(`Maaf, Kota *${cityName}* Tidak Ditemukan`);
}
const suhu = weatherData.main.temp;
const deskripsiCuaca = weatherData.weather[0].description;
const kelembaban = weatherData.main.humidity;
const tekananUdara = weatherData.main.pressure;
const kecepatanAngin = weatherData.wind.speed;
const cuacaText = `\nCuaca Di *${cityName}* Saat Ini :\n- Suhu : *${suhu}°C*\n- Deskripsi : *${deskripsiCuaca}*\n- Kelembaban : *${kelembaban}%*\n- Tekanan Udara : *${tekananUdara} hPa*\n- Kecepatan Angin : *${kecepatanAngin} m/s*\n`;
return reply(cuacaText);
} catch (error) {
console.error(error);
return reply("Terjadi kesalahan saat mengambil data cuaca. Silakan coba lagi nanti.");
}
break;

default: {
if (isCmd2 && budy.toLowerCase() != undefined) {
if (m.chat.endsWith("broadcast")) return;
if (m.isBaileys) return;
if (!budy.toLowerCase()) return;
if (argsLog || (isCmd2 && !m.isGroup)) {
console.log(chalk.black(chalk.bgRed("[ ERROR ]")), color("command", "turquoise"), color(`${prefix}${command}`, "turquoise"), color("tidak tersedia", "turquoise"));
 } else if (argsLog || (isCmd2 && m.isGroup)) {
console.log(chalk.black(chalk.bgRed("[ ERROR ]")), color("command", "turquoise"), color(`${prefix}${command}`, "turquoise"), color("tidak tersedia", "turquoise"));
}
}
}
}
}
} catch (err) {
m.reply(util.format(err));
}
};
let file = require.resolve(__filename);
fs.watchFile(file, () => {
fs.unwatchFile(file);
console.log(chalk.redBright(`Update ${__filename}`));
delete require.cache[file];
require(file);
});
