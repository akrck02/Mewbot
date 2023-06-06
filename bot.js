const Discordjs = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const superagent = require('superagent');
const fs = require('fs');

const bot = new Discordjs.Client({ intents: [Discordjs.GatewayIntentBits.Guilds] })
console.log("[Bot] Starting Bot")

bot.on("ready", () => 
{
	if(fs.existsSync('./tmp')){
		fs.rmSync('./tmp', { recursive: true })
	}
	
	console.log(`[Bot] Logged in as ${bot.user.username}`)
	var commands = [
		new SlashCommandBuilder()
			.setName('generate')
			.setDescription('Generates a image using Dall-e')
			.addStringOption(option =>
				option.setName('prompt')
					.setDescription('The prmot to generate an image of')
					.setRequired(true)
			)
	]

	var rest = new REST({ version: '9' }).setToken(bot.token);
	rest.put(Routes.applicationCommands(bot.user.id), { body: commands });
	fs.mkdirSync('./tmp')
})

bot.login(process.env['token'])
bot.on('error', err => {console.error(err)})
bot.on('interactionCreate', async interaction => interact(interaction));


function base64ToPNG(data, prompt) {

	console.log(`Converting to PNG ./tmp/${prompt}.png`);

	path = require('path');
	data = data.replace(/^data:image\/png;base64,/, '');
  
	fs.writeFileSync(path.resolve(__dirname, `./tmp/${prompt}.png`), data, 'base64', function(err) {});
  }


async function interact(interaction){

	if (interaction.commandName == "generate") {

		console.log(`[Bot] Generating image for ${interaction.user.username}`);

		let prompt = interaction.options.data[0].value;
		let mentionId;
		let mention;


		//replace asterisks with "o"
		prompt = prompt.replace(/\*/g, "o")

		if (prompt.indexOf("<@") != -1 && prompt.indexOf(">") != -1 && prompt.indexOf("<@") < prompt.indexOf(">")) {
			mention = prompt.slice(prompt.indexOf("<@") + 2, prompt.indexOf(">"));
			if (mention.startsWith("!")) {
				mention = mention.slice(1);
			}

			mentionId = "<@" + mention + ">";
			mention = interaction.guild.members.cache.get(mention).displayName;
			mention = mention.replace(/\*/g, "o")
			prompt = prompt.replace(/<@.*>/g, mention)
		}
		

		superagent
			.post(`https://bf.dallemini.ai/generate`)
			.send({ prompt: prompt })
			.end((err, res) => {

				if (err) {
					console.error(err)
					interaction.editReply("Error occured on API call, please try again later").catch(e => {console.error(e) })
				} else {
					try {
						var files = []
						for (var i = 0; i < res.body.images.length; i++) {

							try {
								base64ToPNG(res.body.images[i], `${prompt}_${i}`)
								const file = new Discordjs.AttachmentBuilder(`tmp/${prompt}_${i}.png`);
								files.push(file)
							} catch (e) {
								console.error(e)
							}
						}


						prompt = prompt.replace(mention, mentionId)
						interaction.editReply({ content: `Heres what i think ${prompt} looks like`, files: files, embeds: [] });
					} catch (e) {
						console.error(e)
						interaction.editReply("Error occured, please try again later \n error" + err).catch(e => {console.log(e)})
					}

				}
			})
		}

		interaction.deferReply({ content: "Generating image", ephemeral: false }).catch(e => {console.error(e)})
}