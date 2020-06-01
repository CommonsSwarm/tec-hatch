import minimeTokenAbi from '../abi/MiniMeToken.json'
import tokenManagerAbi from '../abi/token-manager.json'

export async function spendableBalanceOf(tokenAddress, connectedAccount, api) {
  const tokenManagerAddress = await api
    .external(tokenAddress, minimeTokenAbi)
    .controller()
    .toPromise()
  const spendableBalanceOf = await api
    .external(tokenManagerAddress, tokenManagerAbi)
    .spendableBalanceOf(connectedAccount)
    .toPromise()

  return spendableBalanceOf
}
