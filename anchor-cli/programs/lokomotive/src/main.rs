use anchor_lang::prelude::*;
use multichain_transfer::{MultichainTransfer, CpiContext};
use std::convert::TryInto;
use wormhole_sdk::token_extensions::{TokenExtension, TokenExtensionClient};
use wormhole_sdk::{bridge::Bridge, solana::SolanaWallet, token::Token, types::*};

// @import ZKFile.rs
use crate::zkfile::ZkFile;

// ...(IPFS client struct'ı ve upload_file fonksiyonunu ekleyin)

fn main() -> Result<()> {
    // Program ID & RPC URL
    let program_id = Pubkey::new_from_array(<YOUR_PROGRAM_ID_ARRAY>.try_into().unwrap());
    let rpc_url = "https://api.devnet.solana.com"; // Devnet (Örnek, network adresinizi değiştirin)

    // Anchor Solana sağlayıcısını oluşturma
    let solana_provider = anchor_lang::solana::Provider::new(rpc_url.to_string());
    let payer = solana_provider.wallet();

    // file content example
    let file_content: Vec<u8> = vec![1, 2, 3, 4, 5];

    // IPFS client
    let client = IpfsClient::new("https://ipfs.infura.io:5001");
    let ipfs_hash = upload_file(&client, &file_content).await?;


    let zk_file = ZkFile::from_bytes(&file_content);
    let zk_file_data = zk_file.to_data(); // Detaylı meta veri içerir

    // receiver wallet id (example)
    let receiver_address = Pubkey::new_from_array(<RECEIVER_ADDRESS_ARRAY>.try_into().unwrap());

    // generate Solana  account  (for zk file)
    let access_key_account = Keypair::new();
    let access_key_account_pubkey = access_key_account.pubkey();
    let lamports = Rent::get()?.minimum_balance(ZkFileData::LEN); // enough lamports

    let create_instruction = SystemInstruction::create_account(
        &payer.pubkey(),
        &access_key_account_pubkey,
        lamports,
        ZkFileData::LEN as u64, // ZkFileData length
        &program_id,
    );

    let instructions = vec![create_instruction];
    let mut tx = Transaction::new_with_payer(&instructions, &Some(&payer));
    tx.sign(&[&payer, &access_key_account], ctx.accounts.recent_blockhash);

    let connection = Connection::new(rpc_url.to_string());
    connection.send_and_confirm_transaction(&mut tx)?;

    // Wormhole Bridge
    let bridge = Bridge::new(connection.clone());
    let solana_wallet = SolanaWallet::new(connection.clone());

    // token transfer with bridge
    bridge.transfer(
        &solana_wallet,
        &Token::native_sol(),
        1u64, // Access key token amount
        "ethereum",
        receiver_address.as_ref(), // ETH wallet id (input)
    )?;

    let token_extension_client = TokenExtensionClient::new(connection);
    let token_extension = TokenExtension::new(zk_file.content, zk_file.proof);

    token_extension_client.transfer(
        &solana_wallet,
        &zk_file_data, // file meta-data
        1u64, // Data transfer amount
        "ethereum",
        receiver_address.as_ref(),
        &token_extension,
    )?;

    Ok(())
}
