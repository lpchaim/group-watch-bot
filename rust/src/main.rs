mod commands;

use std::{fs::File, io::BufReader};

use serde::{Deserialize, Serialize};
use serenity::async_trait;
use serenity::model::gateway::Ready;
use serenity::model::id::GuildId;
use serenity::model::interactions::application_command::ApplicationCommandInteractionDataOptionValue;
use serenity::model::interactions::{Interaction, InteractionResponseType};
use serenity::prelude::*;
use tokio::time::{sleep, Duration};

struct Handler;

#[async_trait]
impl EventHandler for Handler {
    async fn interaction_create(&self, ctx: Context, interaction: Interaction) {
        if let Interaction::ApplicationCommand(command) = interaction {
            println!("Received command interaction: {:#?}", command);

            let content = match command.data.name.as_str() {
                "countdown" => {
                    let options = command
                        .data
                        .options
                        .get(0)
                        .expect("Expected user option")
                        .resolved
                        .as_ref()
                        .unwrap_or(&ApplicationCommandInteractionDataOptionValue::Integer(5));

                    if let ApplicationCommandInteractionDataOptionValue::Integer(count) = options {
                        let mut count = count.to_owned();
                        let _max_count = count;
                        while count >= 0 {
                            match count {
                                count if count == _max_count => {
                                    command.create_interaction_response(&ctx.http, |response| {
                                        response
                                            .kind(InteractionResponseType::ChannelMessageWithSource)
                                            .interaction_response_data(|message| message.content(count))
                                    })
                                    .await
                                    .unwrap();
                                }
                                0 => {
                                    command
                                        .edit_original_interaction_response(&ctx.http, |response| {
                                            response.content("Go!")
                                        })
                                        .await
                                        .unwrap();
                                }
                                _ => {
                                    command
                                        .edit_original_interaction_response(&ctx.http, |response| {
                                            response.content(count)
                                        })
                                        .await
                                        .unwrap();
                                }
                            }
                            count -= 1;
                            sleep(Duration::from_millis(1000)).await;
                        }
                        "".to_string()
                    } else {
                        "Please provide a valid number to count down from".to_string()
                    }
                }
                command => format!("Command \"{}\" not implemented :(", command),
            };

            if let Err(why) = command
                .create_interaction_response(&ctx.http, |response| {
                    response
                        .kind(InteractionResponseType::ChannelMessageWithSource)
                        .interaction_response_data(|message| message.content(content))
                })
                .await
            {
                println!("Cannot respond to slash command: {}", why);
            }
        }
    }

    async fn ready(&self, ctx: Context, ready: Ready) {
        println!("{} is connected!", ready.user.name);

        let guild_ids = get_config().unwrap().guild_ids;
        for id in guild_ids {
            let guild_id = GuildId(id.parse().unwrap());
            let commands = guild_id
                .get_application_commands(&ctx.http)
                .await
                .unwrap_or_default();
            for command in commands {
                GuildId::delete_application_command(&guild_id, &ctx.http, command.id)
                    .await
                    .unwrap();
            }
        }

        // let commands = GuildId::set_application_commands(&guild_id, &ctx.http, |commands| {
        //     commands
        //         .create_application_command(|command| {
        //             command.name("countdown").description("Counts down from a number")
        //         })
        // .create_application_command(|command| {
        //     command.name("id").description("Get a user id").create_option(|option| {
        //         option
        //             .name("id")
        //             .description("The user to lookup")
        //             .kind(ApplicationCommandOptionType::User)
        //             .required(true)
        //     })
        // })
        // .create_application_command(|command| {
        //     command
        //         .name("welcome")
        // .name_localized("de", "begrüßen")
        //         .description("Welcome a user")
        // .description_localized("de", "Einen Nutzer begrüßen")
        //         .create_option(|option| {
        //             option
        //                 .name("user")
        // .name_localized("de", "nutzer")
        //                 .description("The user to welcome")
        // .description_localized("de", "Der zu begrüßende Nutzer")
        //                 .kind(ApplicationCommandOptionType::User)
        //                 .required(true)
        //         })
        //         .create_option(|option| {
        //             option
        //                 .name("message")
        // .name_localized("de", "nachricht")
        //                 .description("The message to send")
        // .description_localized("de", "Die versendete Nachricht")
        //                 .kind(ApplicationCommandOptionType::String)
        //                 .required(true)
        // .add_string_choice_localized(
        //     "Welcome to our cool server! Ask me if you need help",
        //     "pizza",
        //     [("de", "Willkommen auf unserem coolen Server! Frag mich, falls du Hilfe brauchst")]
        // )
        // .add_string_choice_localized(
        //     "Hey, do you want a coffee?",
        //     "coffee",
        //     [("de", "Hey, willst du einen Kaffee?")],
        // )
        // .add_string_choice_localized(
        //     "Welcome to the club, you're now a good person. Well, I hope.",
        //     "club",
        //     [("de", "Willkommen im Club, du bist jetzt ein guter Mensch. Naja, hoffentlich.")],
        // )
        // .add_string_choice_localized(
        //     "I hope that you brought a controller to play together!",
        //     "game",
        //     [("de", "Ich hoffe du hast einen Controller zum Spielen mitgebracht!")],
        // )
        //         })
        // })
        // .create_application_command(|command| {
        //     command
        //         .name("numberinput")
        //         .description("Test command for number input")
        //         .create_option(|option| {
        //             option
        //                 .name("int")
        //                 .description("An integer from 5 to 10")
        //                 .kind(ApplicationCommandOptionType::Integer)
        //                 .min_int_value(5)
        //                 .max_int_value(10)
        //                 .required(true)
        //         })
        //         .create_option(|option| {
        //             option
        //                 .name("number")
        //                 .description("A float from -3.3 to 234.5")
        //                 .kind(ApplicationCommandOptionType::Number)
        //                 .min_number_value(-3.3)
        //                 .max_number_value(234.5)
        //                 .required(true)
        //         })
        // })
        // .create_application_command(|command| {
        //     command
        //         .name("attachmentinput")
        //         .description("Test command for attachment input")
        //         .create_option(|option| {
        //             option
        //                 .name("attachment")
        //                 .description("A file")
        //                 .kind(ApplicationCommandOptionType::Attachment)
        //                 .required(true)
        //         })
        // })
        // })
        // .await;
        // println!("I now have the following guild slash commands: {:#?}", commands);

        // let guild_command = ApplicationCommand::create_global_application_command(&ctx.http, |command| {
        //     command.name("wonderful_command").description("An amazing command")
        // })
        // .await;
        // println!("I created the following global slash command: {:#?}", guild_command);
    }
}

#[derive(Serialize, Deserialize)]
struct ConfigFile {
    token: String,
    #[serde(rename = "clientId")]
    client_id: String,
    #[serde(rename = "guildIds")]
    guild_ids: Vec<String>,
}

#[tokio::main]
async fn main() {
    let config = get_config().expect("Unable to parse config file");

    // Configure the client with your Discord bot token in the environment.
    let token = config.token;

    // Build our client.
    let mut client = Client::builder(token, GatewayIntents::empty())
        .event_handler(Handler)
        .await
        .expect("Error creating client");
    if let Err(why) = client.start().await {
        println!("Client error: {:?}", why);
    }

    let shard_manager = client.shard_manager.clone();
    tokio::spawn(async move {
        tokio::signal::ctrl_c()
            .await
            .expect("Could not register ctrl+c handler");
        println!("Ctrl+c caught, shutting down...");
        shard_manager.lock()
            .await
            .shutdown_all()
            .await;
    });
}

fn get_config() -> Result<ConfigFile, serde_json::Error> {
    let file = File::open("config.json").expect("Unable to open config file");
    let reader = BufReader::new(file);
    serde_json::from_reader(reader)
}
