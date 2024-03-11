"""from typing import Final
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes, CallbackQueryHandler, Updater


TOKEN = "7192726917:AAHbXfJlu6dgb2IhdVTtozzQ1CM6t8tfcBo"
BOT_CALLINGS: Final = ['@karlsgustavsbot', 'karlsgustavsbot', 'karl', 'gustav']
updater = Updater


# commands
async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("hello")


async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("hello help")


async def custom_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("hello custom")


# Responses
def handle_response(text: str) -> str:

    processed: str = text.lower()

    if "hello" in processed:
        return "hello"
    else:
        return "aaw"


async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):

    message_type = update.message.chat.type
    text: str = update.message.text

    print(f'User ({update.message.chat.id}) in {message_type}: {text}')

    # if message_type == "group":
    if set(BOT_CALLINGS).intersection(text.split(' ')): # any(BOT_USERNAME in text)
        # new_text: str = text.replace(BOT_USERNAME, '').strip()
        response: str = handle_response(text)
    else:
        return

    print("Bot: ", response)
    await update.message.reply_text(response)


async def errorr(update: Update, context: ContextTypes.DEFAULT_TYPE):
    print(f"Update {update} cause error {context.error}")


if __name__ == '__main__':

    print('Starting bot...')

    app = Application.builder().token(TOKEN).build()

    # commands
    app.add_handler(CommandHandler('start', start_command))
    app.add_handler(CommandHandler('help', help_command))
    app.add_handler(CommandHandler('custom', custom_command))

    # messages
    app.add_handler(MessageHandler(filters.TEXT, handle_message))

    # errors
    app.add_error_handler(errorr)

    # polling
    print("polling...")
    app.run_polling(poll_interval=3)
"""


#!/usr/bin/env python
# pylint: disable=unused-argument
# This program is dedicated to the public domain under the CC0 license.

"""
First, a few callback functions are defined. Then, those functions are passed to
the Application and registered at their respective places.
Then, the bot is started and runs until we press Ctrl-C on the command line.

Usage:
Example of a bot-user conversation using ConversationHandler.
Send /start to initiate the conversation.
Press Ctrl-C on the command line or send a signal to the process to stop the
bot.
"""
from functions import *


def main() -> None:
    """Run the bot."""
    # Create the Application and pass it your bot's token.
    application = Application.builder().token("7192726917:AAHbXfJlu6dgb2IhdVTtozzQ1CM6t8tfcBo").build()

    # Add conversation handler with the states CHOOSING, TYPING_CHOICE and TYPING_REPLY
    conv_handler = ConversationHandler(
        entry_points=[CommandHandler("start", start)],
        states={
            CHOOSING: [
                MessageHandler(
                    filters.Regex("^(NFT 🖼️)$"), select_nft
                ),
                # |Pool 🏊|Gas Price 🚰
                MessageHandler(
                    filters.Regex("^(Pool 🏊)$"), select_pool
                ),
                MessageHandler(
                    filters.Regex("^(Gas Price 🚰)$"), select_gas
                ),
                MessageHandler(
                    filters.Regex("^(Track 🐾)$"), select_track
                ),
                # |Pool 🏊|Gas Price 🚰
                MessageHandler(
                    filters.Regex("^(My Tracks 👞)$"), show_my_tracks
                ),
                # "Gas Price 🚰", "Funding 💰"],
                #     ["Main Menu 📑"],
                MessageHandler(
                    filters.Regex("^(Funding 💰)$"), select_funding
                ),
                MessageHandler(
                    filters.Regex("^(Main Menu 📑)$"), go_main_menu
                ),
            ],
            TYPING_CHOICE: [
                MessageHandler(
                    filters.TEXT & ~(filters.COMMAND | filters.Regex("^Done$")), select_nft
                )
            ],
            TYPING_REPLY: [
                MessageHandler(
                    filters.TEXT & ~(filters.COMMAND | filters.Regex("^Done$")),
                    received_information,
                )
            ],
        },
        fallbacks=[MessageHandler(filters.Regex("^Done$"), done)],
    )

    application.add_handler(conv_handler)

    # Run the bot until the user presses Ctrl-C
    application.run_polling(allowed_updates=Update.ALL_TYPES)


if __name__ == "__main__":
    main()
