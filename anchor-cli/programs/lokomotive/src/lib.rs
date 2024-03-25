use anchor_lang::prelude::*;

// Wormhole SDK Library
use wormhole_sdk::{bridge::Bridge, solana::SolanaWallet, token::Token, types::*};

declare_id!("Fhip5iGYbNmDmzB9H4DUiXXEhotfzCfgqajk95Fs7FCK");

#[program]
pub mod multichain_transfer {
    use super::*;

    // Function: Solana to Ethereum

    pub fn transfer_sol_to_eth(
        ctx: Context<MultichainTransfer>,
        receiver_address: Pubkey,
        file_content: &[u8],
    ) -> Result<()> {
        // Wormhole bridge & create Solana wallet
        let bridge = Bridge::new(ctx.accounts.bridge.to_account_info());
        let solana_wallet = SolanaWallet::new(ctx.accounts.solana_wallet.to_account_info());
        //token_address: Pubkey,

        // Convert file content to Data object
        let data = Data::from_bytes(file_content);

        // Transfer with Wormhole SDK
        bridge.transfer(
            &solana_wallet,
            &data,
            1, // Use 1 as the transfer amount for data
            "ethereum",
            receiver_address.as_ref(),
        )?;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct MultichainTransfer {
    #[account(mut)]
    pub bridge: AccountInfo,
    #[account(mut)]
    pub solana_wallet: AccountInfo,
}
