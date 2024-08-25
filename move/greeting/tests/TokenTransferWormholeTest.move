
module TokenTransferWormholeTest {
    use 0x1::Signer;
    use 0x1::Coin;
    use 0x1::Hash;
    use 0x1::Event;
    use 0x1::Timestamp;
    use TokenTransferWormhole;

    // Test struct to represent the test context
    struct TestContext has store {
        owner: address,
        initial_amount: u64,
        token_id: u64,
    }

    // Initialize the test context
    public fun initialize_test_context(account: &signer, token_id: u64, initial_amount: u64): TestContext {
        let owner = Signer::address_of(account);
        
        // Mint the initial token
        let token = TokenTransferWormhole::Token {
            id: token_id,
            owner: owner,
            amount: initial_amount,
        };
        move_to(account, token);
        
        // Return the test context
        TestContext {
            owner: owner,
            initial_amount: initial_amount,
            token_id: token_id,
        }
    }

    // Test locking the token
    public fun test_lock_token(account: &signer, context: &TestContext, amount: u64) {
        // Call the lock_token function
        TokenTransferWormhole::lock_token(account, context.token_id, amount);

        // Validate the lock state
        let lock_state = borrow_global<TokenTransferWormhole::LockState>(context.owner);
        assert!(lock_state.token_id == context.token_id, 101);
        assert!(lock_state.amount == amount, 102);
        assert!(lock_state.locked == true, 103);
    }

    // Test generating the Wormhole message
    public fun test_generate_wormhole_message(account: &signer, context: &TestContext, amount: u64) {
        // Generate the Wormhole message
        TokenTransferWormhole::generate_wormhole_message(account, context.token_id, context.owner, amount);

        // Validate the Wormhole message event (simple validation, further checks can be added)
        let events = Event::get_events<TokenTransferWormhole::WormholeMessageEvent>();
        let last_event = &events[Vector::length(&events) - 1];
        assert!(last_event.token_id == context.token_id, 201);
        assert!(last_event.amount == amount, 202);
    }

    // Test minting the equivalent token
    public fun test_mint_equivalent_token(account: &signer, context: &TestContext, amount: u64, message_hash: vector<u8>) {
        // Call the mint_equivalent_token function
        TokenTransferWormhole::mint_equivalent_token(account, context.token_id, context.owner, amount, message_hash);

        // Validate the new token
        let new_token = borrow_global<TokenTransferWormhole::Token>(context.owner);
        assert!(new_token.id == context.token_id, 301);
        assert!(new_token.amount == amount, 302);
    }

    // Run all tests
    public fun run_all_tests(account: &signer) {
        let token_id: u64 = 1;
        let initial_amount: u64 = 1000;
        let lock_amount: u64 = 500;

        // Initialize the test context
        let context = initialize_test_context(account, token_id, initial_amount);

        // Test locking the token
        test_lock_token(account, &context, lock_amount);

        // Test generating the Wormhole message
        test_generate_wormhole_message(account, &context, lock_amount);

        // Mock a message hash for testing the minting function
        let message_hash = Hash::keccak256(TokenTransferWormhole::Token::serialize(&token_id), TokenTransferWormhole::Token::serialize(&context.owner), TokenTransferWormhole::Token::serialize(&lock_amount));

        // Test minting the equivalent token
        test_mint_equivalent_token(account, &context, lock_amount, message_hash);

        // Print a success message
        debug("All tests passed successfully!");
    }
}
