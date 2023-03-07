const { param, query } = require("express-validator");

exports.nftValidator = [
  param("address")
    .not()
    .isEmpty()
    .withMessage("Cannot be empty")
    .isString()
    .withMessage("Should be a string"),
  query("cursor")
    .not()
    .isEmpty()
    .withMessage("Cannot be empty")
    .isString()
    .withMessage("Should be a string")
    .optional(),
  param("chain")
    .not()
    .isEmpty()
    .withMessage("Cannot be empty")
    .isString()
    .withMessage("Should be a string")
    .custom(async (chain) => {
      if (
        ![
          "ETHEREUM",
          "GOERLI",
          "SEPOLIA",
          "POLYGON",
          "MUMBAI",
          "AVALANCHE",
          "FUJI",
          "BSC_TESTNET",
          "BSC",
          "FANTOM",
          "CRONOS",
          "CRONOS_TESTNET",
          "PALM",
          "ARBITRUM",
        ].includes(chain)
      ) {
        throw new Error("Chain not supported");
      }

      return true;
    }),
];
