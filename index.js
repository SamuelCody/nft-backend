require("dotenv").config({ path: "./src/.env" });
const express = require("express");
const handleResponse = require("./src/response");
const Moralis = require("moralis").default;
const { EvmChain } = require("@moralisweb3/common-evm-utils");
const { nftValidator } = require("./src/validators/nft");
const { validate } = require("./src/utils");
const cors = require("cors");
Moralis.start({
  apiKey: `${process.env.MORALIS_API}`,
  // ...and any other configuration
});

const app = express();

app.disable("x-powered-by"); // disable X-Powered-By header
app.use(function (req, res, next) {
  res.header("X-XSS-Protection", "1; mode=block");
  res.header("X-Frame-Options", "deny");
  res.header("X-Content-Type-Options", "nosniff");
  next();
});

const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true,
  })
);

// Initialize routes
app.get(
  "/api/v1/all-nfts/:address/:chain",
  nftValidator,
  validate,
  async (req, res, next) => {
    try {
      const { address, chain } = req.params;
      const { cursor } = req.query;

      //   http://localhost:3000/api/v1/all-nfts/0xd8da6bf26964af9d7eed9e03e53415d37aa96045/ETHEREUM
      // http://localhost:3000/api/v1/all-nfts/0x70417e99f63c0eed3b5ba95b23d35ef08cd004c7/ETHEREUM

      const response = await Moralis.EvmApi.nft.getWalletNFTs({
        address,
        chain: EvmChain[chain],
        disableTotal: false,
        limit: 16,
        cursor: cursor || null,
        normalizeMetadata: true
      });

      handleResponse(res, 200, "Success", response.toJSON());
    } catch (error) {
      return next(error);
    }
  }
);

app.get("/", (req, res, next) => {
  try {
    return handleResponse(res, 200, "Welcome to nft backend api");
  } catch (error) {
    return next(error);
  }
});

// Add catch all route
app.get("*", (req, res, next) => {
  try {
    return handleResponse(res, 400, "This route does not exist");
  } catch (error) {
    return next(error);
  }
});

// Add global error handler
app.use((req, res) => {
  return handleResponse(res, 500, "There is an error", undefined, {});
});

app.listen(PORT, function () {
  console.log(`Server listening on port ${PORT}`);
});
