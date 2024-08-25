module FileTransferTest {
    use 0x1::Signer;
    use 0x1::Coin;
    use 0x1::Hash;
    use 0x1::Event;
    use 0x1::Timestamp;
    use 0x1::Vector;
    use FileTransfer;

    struct TestContext has store {
        owner: address,
        file_id: u64,
        raw_data: vector<u8>,
        encrypted_data: vector<u8>,
        arweave_hash: vector<u8>,
        token_hash: vector<u8>,
        message_hash: vector<u8>,
    }

    public fun initialize_test_context(account: &signer, file_id: u64, raw_data: vector<u8>): TestContext {
        let owner = Signer::address_of(account);

        let encrypted_file = FileTransfer::encrypt_file(account, file_id, raw_data);
        let encrypted_data = encrypted_file.encrypted_data;
        let arweave_hash = encrypted_file.arweave_hash;

        let token_hash = Hash::sha3_256(arweave_hash);

        let test_context = TestContext {
            owner: owner,
            file_id: file_id,
            raw_data: raw_data,
            encrypted_data: encrypted_data,
            arweave_hash: arweave_hash,
            token_hash: token_hash,
            message_hash: Hash::keccak256(TokenizedFileHash::serialize(&TokenizedFileHash {
                file_id: file_id,
                owner: owner,
                token_hash: token_hash,
                timestamp: Timestamp::now_seconds(),
            })),
        };

        FileTransfer::tokenize_file_hash(account, file_id);
        FileTransfer::transfer_token_via_wormhole(account, file_id);

        test_context
    }

    public fun test_encrypt_file(account: &signer, file_id: u64, raw_data: vector<u8>) {
        let encrypted_file = FileTransfer::encrypt_file(account, file_id, raw_data);
        assert!(encrypted_file.id == file_id, 101);
        assert!(Vector::length(&encrypted_file.encrypted_data) > 0, 102);
        assert!(Vector::length(&encrypted_file.arweave_hash) > 0, 103);
    }

    public fun test_tokenize_file_hash(account: &signer, file_id: u64) {
        let owner = Signer::address_of(account);
        FileTransfer::tokenize_file_hash(account, file_id);

        let tokenized_file = borrow_global<FileTransfer::TokenizedFileHash>(file_id);
        assert!(tokenized_file.owner == owner, 201);
        assert!(tokenized_file.file_id == file_id, 202);
        assert!(Vector::length(&tokenized_file.token_hash) > 0, 203);
    }

    public fun test_transfer_token_via_wormhole(account: &signer, file_id: u64) {
        let owner = Signer::address_of(account);
        FileTransfer::transfer_token_via_wormhole(account, file_id);

        let events = Event::get_events<FileTransfer::WormholeMessageEvent>();
        let last_event = &events[Vector::length(&events) - 1];
        assert!(last_event.file_id == file_id, 301);
        assert!(last_event.owner == owner, 302);
        assert!(Vector::length(&last_event.message_hash) > 0, 303);
    }

    public fun test_verify_and_retrieve_file(account: &signer, context: &TestContext) {
        FileTransfer::verify_and_retrieve_file(account, context.file_id, context.token_hash, context.message_hash);
        
        let encrypted_file = borrow_global<FileTransfer::EncryptedFile>(context.file_id);
        assert!(encrypted_file.arweave_hash == context.token_hash, 401);

        let decrypted_data = FileTransfer::zkSNARKs_decrypt(encrypted_file.encrypted_data);
        assert!(decrypted_data == context.raw_data, 402);
    }

    public fun run_all_tests(account: &signer) {
        let file_id: u64 = 1;
        let raw_data: vector<u8> = b"Test data to encrypt and store";
        
        test_encrypt_file(account, file_id, raw_data);

        let context = initialize_test_context(account, file_id, raw_data);

        test_tokenize_file_hash(account, file_id);
        test_transfer_token_via_wormhole(account, file_id);
        test_verify_and_retrieve_file(account, &context);

        debug("All tests passed successfully!");
    }
}
