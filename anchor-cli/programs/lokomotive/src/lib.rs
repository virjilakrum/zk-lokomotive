use anchor_lang::prelude::*;
use wormhole_sdk::token_extensions::{TokenExtension, TokenExtensionClient};
use wormhole_sdk::{bridge::Bridge, solana::SolanaWallet, token::Token, types::*}; // Wormhole SDK Library
use zkfile::ZkFile;

declare_id!("Fhip5iGYbNmDmzB9H4DUiXXEhotfzCfgqajk95Fs7FCK");

#[program]
pub mod multichain_transfer {
    use super::*;

    // Function: Solana to Ethereum (with Zero Knowledge)

    pub fn transfer_sol_to_eth(
        ctx: Context<MultichainTransfer>,
        receiver_address: Pubkey,
        file_content: &[u8],
    ) -> Result<()> {
        // IPFS Integration
        let client = IpfsClient::new("https://ipfs.infura.io:5001"); // Infura IPFS node
        let ipfs_hash = upload_file(&client, file_content).await?;

        // Add IPFS hash to data content
        let data = Data::from_bytes(file_content);
        data.ipfs_hash = Some(ipfs_hash);

        // Create ZK file from data
        let zk_file = ZkFile::from_bytes(&data);

        // Create a new Solana account for storing the access key/token
        let access_key_account = Keypair::new();
        let access_key_account_pubkey = access_key_account.pubkey();

        //
        //
        // Örnek:
        let create_instruction = SystemInstruction::create_account(
            &payer.pubkey(),            // Hesap oluşturma için ödeyen
            &access_key_account_pubkey, // Oluşturulan hesap
            lamports,                   // Hesaba aktarilan lamport miktari
            &program_id,                // Hesap programı
        );

        //
        //
        //

        let instructions = vec![create_instruction];

        // Sign and send transaction to create the access key account
                let mut tx = Transaction::new_with_payer(
                    &instructions,
                    &Some(&payer),
                    &[&access_key_account],
                );

                send_and_confirm_transaction(&mut tx)?;

        // Wormhole bridge & create Solana wallet
        let bridge = Bridge::new(ctx.accounts.bridge.to_account_info());
        let solana_wallet = SolanaWallet::new(ctx.accounts.solana_wallet.to_account_info());

        // Transfer the access key to the receiver (Ethereum address)
        bridge.transfer(
            &solana_wallet,
            &Token::native_sol(), // Native SOL as the token
            1,                    // Amount of the access key (can be customized)
            "ethereum",
            receiver_address.as_ref(),
        )?;

        // Token Extension Client
        let token_extension_client =
            TokenExtensionClient::new(ctx.accounts.bridge.to_account_info());

        // Send ZK file as token extension
        let token_extension = TokenExtension::new(zk_file.content, zk_file.proof);

        token_extension_client.transfer(
            &solana_wallet,
            &data, // Data object containing IPFS hash (optional)
            1,     // Transfer amount for data
            "ethereum",
            receiver_address.as_ref(), // Ethereum wallet address
            &token_extension,
        )?;

        Ok(())
    }
}
// ...(ZkFile.rs, MultichainTransfer struct, IPFS file upload logic remains the same)
