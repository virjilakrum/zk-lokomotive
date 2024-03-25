use anchor_lang::prelude::*;

// Wormhole SDK Library
use wormhole_sdk::{bridge::Bridge, solana::SolanaWallet, token::Token, types::*};

declare_id!("Fhip5iGYbNmDmzB9H4DUiXXEhotfzCfgqajk95Fs7FCK");

#[program]
pub mod multichain_transfer {
    use super::*;

    /// Function: Solana to Ethereum

    pub fn transfer_sol_to_eth(
        ctx: Context<MultichainTransfer>,
        token_address: Pubkey,
        amount: u64,
    ) -> Result<()> {
        // Wormhole bridge ve create Solana wallet
        let bridge = Bridge::new(ctx.accounts.bridge.to_account_info());
        let solana_wallet = SolanaWallet::new(ctx.accounts.solana_wallet.to_account_info());
        // Transfer with Wormhole SDK
        let token = Token::new(token_address);
        bridge.transfer(
            &solana_wallet,
            &token,
            amount,
            "ethereum",
            "0x9502F71D9d37728C56175Fd9a0A5f1c1Fe472B61", // Baturalp's wallet
                                                          // ... (Varlık transferi tamamlandıktan sonra gerekli işlemleri gerçekleştirme)
        )?;
        Ok(())
    }
}
