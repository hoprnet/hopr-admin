import type { PeerId } from '@libp2p/interface-peer-id'
import type API from '../utils/api'
import BN from 'bn.js'
import { utils as ethersUtils } from 'ethers'
import { Command, type CacheFunctions } from '../utils/command'

export default class FundMultiChannels extends Command {
  constructor(api: API, cache: CacheFunctions) {
    super(
      {
        default: [[['hoprAddressOrAlias'], ['number', 'Amount of HOPR tokens for outgoing channel'], ['number', 'Amount of HOPR tokens for incoming channel']], 'fund both an outgoing and incoming channel']
      },
      api,
      cache
    )
  }

  public name() {
    return 'fund'
  }

  public description() {
    return 'Fund two payment channels between you and the counterparty provided. First provide amount for outgoing channel and second '
  }

  /**
   * Encapsulates the functionality that is executed once the user decides to fund two payment channels
   * with another party.
   * @param query peerId string to send message to
   */
  public async execute(log: (msg: string) => void, query: string): Promise<void> {
    const [error, , counterparty, outgoingAmount, incomingAmount] = this.assertUsage(query) as [string | undefined, string, PeerId, number, number]
    if (error) return log(error)

    const outgoingAmountToFund = new BN(String(ethersUtils.parseEther(String(outgoingAmount))))
    const incomingAmountToFund = new BN(String(ethersUtils.parseEther(String(incomingAmount))))
    const amountToFund = outgoingAmountToFund.add(incomingAmountToFund)
    const counterpartyStr = counterparty.toString()

    const balancesRes = await this.api.getBalances()
    if (!balancesRes.ok) {
      return log(
        await this.failedApiCall(balancesRes, `fetch balances so we can fund channels ${counterpartyStr}`, {
          422: (v) => v.error
        })
      )
    }

    const myAvailableTokens = await balancesRes.json().then((d) => new BN(d.hopr))

    if (amountToFund.lten(0)) {
      return log(`Invalid 'amount' provided: ${amountToFund.toString(10)}`)
    } else if (amountToFund.gt(myAvailableTokens)) {
      return log(`You don't have enough tokens: ${amountToFund.toString(10)}<${myAvailableTokens.toString(10)}`)
    }

    log(`Funding multi channels for node "${counterpartyStr}" with ${outgoingAmount} and ${incomingAmount} token ...`)

    const response = await this.api.fundMultiChannels(counterpartyStr, outgoingAmountToFund.toString(), incomingAmountToFund.toString())

    if (!response.ok) {
      return log(
        await this.failedApiCall(response, `fund multiple channels with ${counterpartyStr}`, {
          400: (v) => `one or more invalid inputs ${v.status}`,
          403: 'not enough balance',
          422: (v) => v.error
        })
      )
    }

    return log(`Successfully funded multi channels (outgoing ${outgoingAmount}, incoming ${incomingAmount}) with node "${counterpartyStr}".`)
  }
}
