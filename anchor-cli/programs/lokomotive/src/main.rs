use anchor_lang::prelude::*;
use multichain_transfer::MultichainTransfer;

fn main() -> Result<()> {
    // Program kimliğini ve RPC URL'sini ayarlama
    let program_id = solana_program::id();
    let rpc_url = "https://api.devnet.solana.com";

    // Anchor'un Solana sağlayıcısını oluşturma
    let solana_provider = anchor_lang::solana::Provider::new(rpc_url.to_string());

    // Akıllı sözleşmeyle etkileşim kurmak için bir hesap oluşturma
    let payer = solana_provider.wallet();

    // Akıllı sözleşmeyle etkileşim kurmak için bir komut oluşturma
    let mut ix = anchor_lang::solana::Instruction::new_with_borsh(
        program_id,
        &MultichainTransfer::transfer_sol_to_eth,
        payer.public_key(),
        &[
            payer.public_key().as_ref(),
            solana_program::sysvar::clock::id(),
        ],
    );

    // İşlemi Solana ağına gönderme
    solana_provider.send_and_confirm(&mut ix)?;

    Ok(())
}
