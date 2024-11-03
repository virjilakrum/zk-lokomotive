# zkl-eswm-ES6
ZKL Cross-chain messaging library between Ethereum and Solana using Wormhole protocol.

## Overview
The ZKL Ethereum-Solana Wormhole Messaging module represents a crucial component of the ZKL ecosystem, facilitating secure and efficient cross-chain communication between Ethereum and Solana blockchains. This implementation leverages modern ES6+ standards to provide a robust, maintainable, and highly interoperable solution for cross-chain messaging needs. By utilizing the Wormhole protocol as its foundation, this module ensures reliable message delivery while maintaining the security guarantees essential for cross-chain operations.

## Why ES6?
Our decision to implement this module using ES6+ standards stems from several key considerations that align with both modern development practices and the broader ZKL ecosystem's architecture. ES6 introduces significant improvements in code organization through modules, enhanced type safety via TypeScript integration, and better asynchronous operation handling through Promises and async/await patterns. These features are particularly crucial in blockchain development, where code reliability and maintainability are paramount. The module system allows for better dependency management and code splitting, while modern JavaScript features enable more expressive and concise code without sacrificing readability or performance.

## Integration with ZKL Ecosystem
This module is designed to work seamlessly with other ZKL components, particularly the Key Derivation System (KDS) and Zero-Knowledge Layer infrastructure. It shares common cryptographic primitives and standardized interfaces with these components, ensuring consistent behavior across the ecosystem. The module's architecture allows it to participate in ZKL's broader privacy-preserving operations while handling the complexities of cross-chain communication. Through careful interface design and standardized message formats, it maintains compatibility with existing ZKL modules while introducing new capabilities for cross-chain interactions.

## Technical Architecture
At its core, the module implements a sophisticated message passing system that handles the intricacies of cross-chain communication while maintaining ZKL's security standards. The architecture is built around pure functions and immutable data structures, making the system more predictable and easier to test. The implementation includes robust validation mechanisms, standardized error handling, and comprehensive event logging, all designed to integrate naturally with both blockchain environments and the broader ZKL ecosystem's requirements.

## Security Considerations
Security is a fundamental aspect of this module's design, particularly given its role in cross-chain operations. The implementation includes comprehensive input validation, secure key handling procedures, and robust error management. By leveraging the Wormhole protocol's proven security model and combining it with ZKL's encryption standards, the module provides a secure channel for cross-chain message passing while maintaining the privacy guarantees expected in the ZKL ecosystem.

## Installation

```bash
npm install ethereum-solana-wormhole-messaging
```

## Usage

```typescript
import { 
  CrossChainMessage, 
  ChainType, 
  validateMessage 
} from 'ethereum-solana-wormhole-messaging';

// Create a cross-chain message
const message: CrossChainMessage = {
  id: "msg-1",
  sourceChain: {
    type: ChainType.Ethereum,
    emitter: "0x..."
  },
  targetChain: {
    type: ChainType.Solana,
    recipient: "..."
  },
  payload: "Your message",
  timestamp: Date.now()
};

// Validate message
validateMessage(message);
```

## Test 
```bash
zkl-eswm-ES6 git:(main) ✗ npm publish                          

> ethereum-solana-wormhole-messaging@1.0.0 prepublishOnly
> npm test && npm run lint && npm run build


> ethereum-solana-wormhole-messaging@1.0.0 test
> jest --passWithNoTests --coverage

watchman warning:  Recrawled this watch 7 times, most recently because:
MustScanSubDirs UserDroppedTo resolve, please review the information on
https://facebook.github.io/watchman/docs/troubleshooting.html#recrawl
To clear this warning, run:
`watchman watch-del '/Users/dante/Desktop/reacthreejs/zkl-eswm-ES6' ; watchman watch-project '/Users/dante/Desktop/reacthreejs/zkl-eswm-ES6'`

 FAIL  src/__tests__/validation.test.ts
  ● Test suite failed to run

    Jest encountered an unexpected token

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see https://jestjs.io/docs/ecmascript-modules for how to enable it.
     • If you are trying to use TypeScript, see https://jestjs.io/docs/getting-started#using-typescript
     • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
     • If you need a custom transformation specify a "transform" option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.

    You'll find more details and examples of these config options in the docs:
    https://jestjs.io/docs/configuration
    For information about custom transformations, see:
    https://jestjs.io/docs/code-transformation

    Details:

    SyntaxError: /Users/dante/Desktop/reacthreejs/zkl-eswm-ES6/src/__tests__/validation.test.ts: Missing initializer in const declaration. (14:26)

      12 |     describe('validateMessage', () => {
      13 |       it('should validate a correct message', () => {
    > 14 |         const validMessage: CrossChainMessage = {
         |                           ^
      15 |           id: '1',
      16 |           sourceChain: {
      17 |             type: ChainType.Ethereum,

      at constructor (node_modules/@babel/parser/src/parse-error.ts:95:45)
      at Parser.toParseError [as raise] (node_modules/@babel/parser/src/tokenizer/index.ts:1495:19)
      at Parser.raise [as parseVar] (node_modules/@babel/parser/src/parser/statement.ts:1560:16)
      at Parser.parseVar [as parseVarStatement] (node_modules/@babel/parser/src/parser/statement.ts:1206:10)
      at Parser.parseVarStatement [as parseStatementContent] (node_modules/@babel/parser/src/parser/statement.ts:558:21)
      at Parser.parseStatementContent [as parseStatementLike] (node_modules/@babel/parser/src/parser/statement.ts:429:17)
      at Parser.parseStatementLike [as parseStatementListItem] (node_modules/@babel/parser/src/parser/statement.ts:378:17)
      at Parser.parseStatementListItem [as parseBlockOrModuleBlockBody] (node_modules/@babel/parser/src/parser/statement.ts:1399:16)
      at Parser.parseBlockOrModuleBlockBody [as parseBlockBody] (node_modules/@babel/parser/src/parser/statement.ts:1372:10)
      at Parser.parseBlockBody [as parseBlock] (node_modules/@babel/parser/src/parser/statement.ts:1340:10)
      at Parser.parseBlock [as parseFunctionBody] (node_modules/@babel/parser/src/parser/expression.ts:2565:24)
      at Parser.parseFunctionBody [as parseArrowExpression] (node_modules/@babel/parser/src/parser/expression.ts:2506:10)
      at Parser.parseArrowExpression [as parseParenAndDistinguishExpression] (node_modules/@babel/parser/src/parser/expression.ts:1802:12)
      at Parser.parseParenAndDistinguishExpression [as parseExprAtom] (node_modules/@babel/parser/src/parser/expression.ts:1126:21)
      at Parser.parseExprAtom [as parseExprSubscripts] (node_modules/@babel/parser/src/parser/expression.ts:709:23)
      at Parser.parseExprSubscripts [as parseUpdate] (node_modules/@babel/parser/src/parser/expression.ts:688:21)
      at Parser.parseUpdate [as parseMaybeUnary] (node_modules/@babel/parser/src/parser/expression.ts:650:23)
      at Parser.parseMaybeUnary [as parseMaybeUnaryOrPrivate] (node_modules/@babel/parser/src/parser/expression.ts:389:14)
      at Parser.parseMaybeUnaryOrPrivate [as parseExprOps] (node_modules/@babel/parser/src/parser/expression.ts:401:23)
      at Parser.parseExprOps [as parseMaybeConditional] (node_modules/@babel/parser/src/parser/expression.ts:356:23)
      at Parser.parseMaybeConditional [as parseMaybeAssign] (node_modules/@babel/parser/src/parser/expression.ts:298:21)
      at parseMaybeAssign (node_modules/@babel/parser/src/parser/expression.ts:252:12)
      at Parser.callback [as allowInAnd] (node_modules/@babel/parser/src/parser/expression.ts:3116:12)
      at Parser.allowInAnd [as parseMaybeAssignAllowIn] (node_modules/@babel/parser/src/parser/expression.ts:251:17)
      at Parser.parseMaybeAssignAllowIn [as parseExprListItem] (node_modules/@babel/parser/src/parser/expression.ts:2728:18)
      at Parser.parseExprListItem [as parseCallExpressionArguments] (node_modules/@babel/parser/src/parser/expression.ts:1005:14)
      at Parser.parseCallExpressionArguments [as parseCoverCallAndAsyncArrowHead] (node_modules/@babel/parser/src/parser/expression.ts:883:29)
      at Parser.parseCoverCallAndAsyncArrowHead [as parseSubscript] (node_modules/@babel/parser/src/parser/expression.ts:772:19)
      at Parser.parseSubscript [as parseSubscripts] (node_modules/@babel/parser/src/parser/expression.ts:730:19)
      at Parser.parseSubscripts [as parseExprSubscripts] (node_modules/@babel/parser/src/parser/expression.ts:715:17)
      at Parser.parseExprSubscripts [as parseUpdate] (node_modules/@babel/parser/src/parser/expression.ts:688:21)
      at Parser.parseUpdate [as parseMaybeUnary] (node_modules/@babel/parser/src/parser/expression.ts:650:23)
      at Parser.parseMaybeUnary [as parseMaybeUnaryOrPrivate] (node_modules/@babel/parser/src/parser/expression.ts:389:14)
      at Parser.parseMaybeUnaryOrPrivate [as parseExprOps] (node_modules/@babel/parser/src/parser/expression.ts:401:23)
      at Parser.parseExprOps [as parseMaybeConditional] (node_modules/@babel/parser/src/parser/expression.ts:356:23)
      at Parser.parseMaybeConditional [as parseMaybeAssign] (node_modules/@babel/parser/src/parser/expression.ts:298:21)
      at Parser.parseMaybeAssign [as parseExpressionBase] (node_modules/@babel/parser/src/parser/expression.ts:221:23)
      at parseExpressionBase (node_modules/@babel/parser/src/parser/expression.ts:212:39)
      at Parser.callback [as allowInAnd] (node_modules/@babel/parser/src/parser/expression.ts:3111:16)
      at Parser.allowInAnd [as parseExpression] (node_modules/@babel/parser/src/parser/expression.ts:212:17)
      at Parser.parseExpression [as parseStatementContent] (node_modules/@babel/parser/src/parser/statement.ts:648:23)
      at Parser.parseStatementContent [as parseStatementLike] (node_modules/@babel/parser/src/parser/statement.ts:429:17)
      at Parser.parseStatementLike [as parseStatementListItem] (node_modules/@babel/parser/src/parser/statement.ts:378:17)
      at Parser.parseStatementListItem [as parseBlockOrModuleBlockBody] (node_modules/@babel/parser/src/parser/statement.ts:1399:16)
      at Parser.parseBlockOrModuleBlockBody [as parseBlockBody] (node_modules/@babel/parser/src/parser/statement.ts:1372:10)
      at Parser.parseBlockBody [as parseBlock] (node_modules/@babel/parser/src/parser/statement.ts:1340:10)
      at Parser.parseBlock [as parseFunctionBody] (node_modules/@babel/parser/src/parser/expression.ts:2565:24)
      at Parser.parseFunctionBody [as parseArrowExpression] (node_modules/@babel/parser/src/parser/expression.ts:2506:10)
      at Parser.parseArrowExpression [as parseParenAndDistinguishExpression] (node_modules/@babel/parser/src/parser/expression.ts:1802:12)
      at Parser.parseParenAndDistinguishExpression [as parseExprAtom] (node_modules/@babel/parser/src/parser/expression.ts:1126:21)
      at Parser.parseExprAtom [as parseExprSubscripts] (node_modules/@babel/parser/src/parser/expression.ts:709:23)
      at Parser.parseExprSubscripts [as parseUpdate] (node_modules/@babel/parser/src/parser/expression.ts:688:21)
      at Parser.parseUpdate [as parseMaybeUnary] (node_modules/@babel/parser/src/parser/expression.ts:650:23)
      at Parser.parseMaybeUnary [as parseMaybeUnaryOrPrivate] (node_modules/@babel/parser/src/parser/expression.ts:389:14)
      at Parser.parseMaybeUnaryOrPrivate [as parseExprOps] (node_modules/@babel/parser/src/parser/expression.ts:401:23)
      at Parser.parseExprOps [as parseMaybeConditional] (node_modules/@babel/parser/src/parser/expression.ts:356:23)
      at Parser.parseMaybeConditional [as parseMaybeAssign] (node_modules/@babel/parser/src/parser/expression.ts:298:21)
      at parseMaybeAssign (node_modules/@babel/parser/src/parser/expression.ts:252:12)
      at Parser.callback [as allowInAnd] (node_modules/@babel/parser/src/parser/expression.ts:3116:12)
      at Parser.allowInAnd [as parseMaybeAssignAllowIn] (node_modules/@babel/parser/src/parser/expression.ts:251:17)
      at Parser.parseMaybeAssignAllowIn [as parseExprListItem] (node_modules/@babel/parser/src/parser/expression.ts:2728:18)
      at Parser.parseExprListItem [as parseCallExpressionArguments] (node_modules/@babel/parser/src/parser/expression.ts:1005:14)
      at Parser.parseCallExpressionArguments [as parseCoverCallAndAsyncArrowHead] (node_modules/@babel/parser/src/parser/expression.ts:883:29)
      at Parser.parseCoverCallAndAsyncArrowHead [as parseSubscript] (node_modules/@babel/parser/src/parser/expression.ts:772:19)
      at Parser.parseSubscript [as parseSubscripts] (node_modules/@babel/parser/src/parser/expression.ts:730:19)
      at Parser.parseSubscripts [as parseExprSubscripts] (node_modules/@babel/parser/src/parser/expression.ts:715:17)
      at Parser.parseExprSubscripts [as parseUpdate] (node_modules/@babel/parser/src/parser/expression.ts:688:21)
      at Parser.parseUpdate [as parseMaybeUnary] (node_modules/@babel/parser/src/parser/expression.ts:650:23)
      at Parser.parseMaybeUnary [as parseMaybeUnaryOrPrivate] (node_modules/@babel/parser/src/parser/expression.ts:389:14)
      at Parser.parseMaybeUnaryOrPrivate [as parseExprOps] (node_modules/@babel/parser/src/parser/expression.ts:401:23)
      at Parser.parseExprOps [as parseMaybeConditional] (node_modules/@babel/parser/src/parser/expression.ts:356:23)
      at Parser.parseMaybeConditional [as parseMaybeAssign] (node_modules/@babel/parser/src/parser/expression.ts:298:21)
      at Parser.parseMaybeAssign [as parseExpressionBase] (node_modules/@babel/parser/src/parser/expression.ts:221:23)
      at parseExpressionBase (node_modules/@babel/parser/src/parser/expression.ts:212:39)
      at Parser.callback [as allowInAnd] (node_modules/@babel/parser/src/parser/expression.ts:3111:16)
      at Parser.allowInAnd [as parseExpression] (node_modules/@babel/parser/src/parser/expression.ts:212:17)
      at Parser.parseExpression [as parseStatementContent] (node_modules/@babel/parser/src/parser/statement.ts:648:23)
      at Parser.parseStatementContent [as parseStatementLike] (node_modules/@babel/parser/src/parser/statement.ts:429:17)
      at Parser.parseStatementLike [as parseStatementListItem] (node_modules/@babel/parser/src/parser/statement.ts:378:17)
      at Parser.parseStatementListItem [as parseBlockOrModuleBlockBody] (node_modules/@babel/parser/src/parser/statement.ts:1399:16)
      at Parser.parseBlockOrModuleBlockBody [as parseBlockBody] (node_modules/@babel/parser/src/parser/statement.ts:1372:10)
      at Parser.parseBlockBody [as parseBlock] (node_modules/@babel/parser/src/parser/statement.ts:1340:10)
      at Parser.parseBlock [as parseFunctionBody] (node_modules/@babel/parser/src/parser/expression.ts:2565:24)
      at Parser.parseFunctionBody [as parseArrowExpression] (node_modules/@babel/parser/src/parser/expression.ts:2506:10)
      at Parser.parseArrowExpression [as parseParenAndDistinguishExpression] (node_modules/@babel/parser/src/parser/expression.ts:1802:12)
      at Parser.parseParenAndDistinguishExpression [as parseExprAtom] (node_modules/@babel/parser/src/parser/expression.ts:1126:21)
      at Parser.parseExprAtom [as parseExprSubscripts] (node_modules/@babel/parser/src/parser/expression.ts:709:23)
      at Parser.parseExprSubscripts [as parseUpdate] (node_modules/@babel/parser/src/parser/expression.ts:688:21)
      at Parser.parseUpdate [as parseMaybeUnary] (node_modules/@babel/parser/src/parser/expression.ts:650:23)
      at Parser.parseMaybeUnary [as parseMaybeUnaryOrPrivate] (node_modules/@babel/parser/src/parser/expression.ts:389:14)
      at Parser.parseMaybeUnaryOrPrivate [as parseExprOps] (node_modules/@babel/parser/src/parser/expression.ts:401:23)
      at Parser.parseExprOps [as parseMaybeConditional] (node_modules/@babel/parser/src/parser/expression.ts:356:23)
      at Parser.parseMaybeConditional [as parseMaybeAssign] (node_modules/@babel/parser/src/parser/expression.ts:298:21)
      at parseMaybeAssign (node_modules/@babel/parser/src/parser/expression.ts:252:12)
      at Parser.callback [as allowInAnd] (node_modules/@babel/parser/src/parser/expression.ts:3116:12)
      at Parser.allowInAnd [as parseMaybeAssignAllowIn] (node_modules/@babel/parser/src/parser/expression.ts:251:17)
      at Parser.parseMaybeAssignAllowIn [as parseExprListItem] (node_modules/@babel/parser/src/parser/expression.ts:2728:18)
      at Parser.parseExprListItem [as parseCallExpressionArguments] (node_modules/@babel/parser/src/parser/expression.ts:1005:14)
      at Parser.parseCallExpressionArguments [as parseCoverCallAndAsyncArrowHead] (node_modules/@babel/parser/src/parser/expression.ts:883:29)
      at Parser.parseCoverCallAndAsyncArrowHead [as parseSubscript] (node_modules/@babel/parser/src/parser/expression.ts:772:19)

----------|---------|----------|---------|---------|-------------------
File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
----------|---------|----------|---------|---------|-------------------
All files |       0 |        0 |       0 |       0 |                   
----------|---------|----------|---------|---------|-------------------
Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        0.982 s
Ran all test suites.

```

## Features

- Cross-chain messaging between Ethereum and Solana
- Message validation and encryption
- Wormhole protocol integration
- TypeScript support
- Comprehensive testing

## Documentation

For detailed documentation, please visit [documentation](./docs).

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -am 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

@virjilakrum
