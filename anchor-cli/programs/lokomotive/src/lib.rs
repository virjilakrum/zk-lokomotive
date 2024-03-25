use anchor_lang::prelude::*;

// Wormhole SDK kütüphaneleri
use wormhole_sdk::{bridge::Bridge, solana::SolanaWallet, token::Token, types::*};

declare_id!("Fhip5iGYbNmDmzB9H4DUiXXEhotfzCfgqajk95Fs7FCK");

#[program]
pub mod multichain_transfer {
    use super::*;

    pub fn share_documents(
        ctx: Context<Leaks>,
        title: String,
        description: String,
        docs: String,
    ) -> Result<()> {
        let files: &mut Account<Files> = &mut ctx.accounts.files;
        files.title = title;
        files.description = description;
        files.docs = docs;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Leaks<'info> {
    #[account(init,payer=user,space=64*3)]
    pub files: Account<'info, Files>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Files {
    pub title: String,
    pub description: String,
    pub docs: String,
}
