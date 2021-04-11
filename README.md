# Hatch Frontend

Frontend for the Hatch that uses the [Hatch Connector](https://github.com/TECommons/hatch-connector). 

## How to run locally

1. Clone the repo:

```sh
git clone https://github.com/TECommons/tec-hatch.git
```

2. Install the dependencies:

```sh
cd tec-hatch
yarn
```

3. Start the frontend:

```sh
yarn start
```

## JSON general view of the frontend state

```json
{
    "generalConfig": {
        "hatch": {
            "id": string,
            "hatchConfig": {
                "id": string,
                "token": {
                    "id": string, // address
                    "name": string,
                    "symbol": string,
                    "decimals": number
                },
                "reserve": string,
                "beneficiary": string, // address
                "contributionToken": {
                    "id": string, // address
                    "name": string,
                    "symbol": string,
                    "decimals": number
                },
                "minGoal": BigNumber,
                "maxGoal": BigNumber,
                "period": number,
                "exchangeRate": BigNumber,
                "vestingCliffPeriod": number,
                "vestingCompletePeriod": number,
                "supplyOfferedPct": string,
                "fundingForBeneficiaryPct": string,
                "openDate": number,
                "vestingCliffDate": number,
                "vestingCompleteDate": number,
                "totalRaised": BigNumber,
                "state": string, // "PENDING", "FUNDING", "REFUNDING", "GOAL_REACHED" or "CLOSED",
                "PPM": BigNumber
            },
            "hatchOracleConfig": {
                "id": string,
                "ratio": BigNumber,
                "scoreToken": {
                    "id": string, // address
                    "name": string,
                    "symbol": string,
                    "decimals": number
                }
            }
        }
    },
    "contributions": [{
        "contributor": string, // address
        "createdAt": number,
        "amount": BigNumber,
        "value": BigNumber
    }],
    "contributor": {
        "id": string,
        "account": string,
        "totalAmount": BigNumber,
        "totalValue": BigNumber,
    }
}
```

## Environment Variables

```
REACT_APP_CONNECTOR_TYPE # Connector implementation type
REACT_APP_CHAIN_ID # Chain id number (mainnet: 1, rinkeby: 4, xdai: 100)
REACT_APP_ORG_ADDRESS #  Aragon DAO address where we have our hatch app installed
REACT_APP_HATCH_APP_NAME # Hatch app name (it's usually marketplace-hatch)
```

## Contributing

We welcome community contributions!

Please check out our open [Issues](https://github.com/TECommons/tec-hatch/issues) to get started.