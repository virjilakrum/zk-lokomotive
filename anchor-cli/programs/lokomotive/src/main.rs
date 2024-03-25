use anchor_lang::prelude::*;
use multichain_transfer::{MultichainTransfer, CpiContext};
use std::convert::TryInto;

fn main() -> Result<()> {
    // Program ID & RPC URL
    let program_id = Pubkey::new_from_array(<YOUR_PROGRAM_ID_ARRAY>.try_into().unwrap());
    let rpc_url = "https://api.devnet.solana.com"; // Devnet (Example of)

    // anchor'un solana sağlayıcısını oluşturma
    let solana_provider = anchor_lang::solana::Provider::new(rpc_url.to_string());

    // create account with solana wallet
    let payer = solana_provider.wallet();

    // dosya içeriği (dynamic with UI)
    let file_content: Vec<u8> = vec![1, 2, 3, 4, 5]; // example of file transfer

    let client = IpfsClient::new("https://ipfs.infura.io:5001");
        let ipfs_hash = upload_file(&client, &file_content).await?;

    // Reciever wallet address (dynamic with UI)
    let receiver_address = Pubkey::new_from_array(<RECEIVER_ADDRESS_ARRAY>.try_into().unwrap());

    // CpiContext oluşturma
    let accounts = MultichainTransfer {
        bridge: payer.public_key().into(), // Sample bridge account
        solana_wallet: payer.public_key().into(),
    };
    let bridge_context = CpiContext::new(program_id, accounts);

    // contract call etme & starts transfer
    multichain_transfer::transfer_sol_to_eth(bridge_context, receiver_address, &file_content)?;

    Ok(())
}
