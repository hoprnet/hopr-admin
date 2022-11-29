/**
 * Simple abstraction for API v2 calls.
 * TODO: replace with SDK
 */

import { type ApiPath } from '.'

/**
 * Wrapper around fetch that allows you to call various HOPRd API endpoints.
 */
export default class API {
  constructor(private apiEndpoint: string, private apiToken?: string) {}

  private getEndpoint(apiPath: ApiPath): string {
    return new URL(apiPath, this.apiEndpoint).href
  }

  private getHeaders(): Headers {
    const headers = new Headers()
    headers.set('Content-Type', 'application/json')
    headers.set('Accept-Content', 'application/json')
    if (this.apiToken) headers.set('Authorization', 'Basic ' + btoa(this.apiToken))
    return headers
  }

  public async getReq(apiPath: ApiPath): Promise<Response> {
    return fetch(this.getEndpoint(apiPath), {
      headers: this.getHeaders()
    })
  }

  public async postReq(apiPath: ApiPath, payload: any): Promise<Response> {
    return fetch(this.getEndpoint(apiPath), {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(payload)
    })
  }

  public async putReq(apiPath: ApiPath, payload: any): Promise<Response> {
    return fetch(this.getEndpoint(apiPath), {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(payload)
    })
  }

  public async delReq(apiPath: ApiPath): Promise<Response> {
    return fetch(this.getEndpoint(apiPath), {
      method: 'DELETE',
      headers: this.getHeaders()
    })
  }

  // account API
  public async withdraw(amount: string, currency: string, recipient: string): Promise<ExpandedJsonResponse> {
    return this.postReq('/api/v2/account/withdraw', { amount, currency: currency.toUpperCase(), recipient })
  }
  public async getBalances(): Promise<ExpandedJsonResponse<Balances>> {
    return this.getReq('/api/v2/account/balances')
  }
  public async getAddresses(): Promise<ExpandedJsonResponse<Addresses>> {
    return this.getReq('/api/v2/account/addresses')
  }

  // aliases API
  public async getAliases(): Promise<ExpandedJsonResponse<Aliases>> {
    return this.getReq('/api/v2/aliases')
  }
  public async setAlias(peerId: string, alias: string): Promise<ExpandedJsonResponse> {
    return this.postReq('/api/v2/aliases', { peerId, alias })
  }
  public async removeAlias(alias: string): Promise<ExpandedJsonResponse> {
    return this.delReq(`/api/v2/aliases/${alias}`)
  }

  // channels API
  public async getChannels(): Promise<ExpandedJsonResponse<{
    incoming: Channel[]
    outgoing: Channel[]
  }>> {
    return this.getReq('/api/v2/channels')
  }
  public async closeChannel(
    peerId: string,
    direction: ChannelDirection
  ): Promise<ExpandedJsonResponse<{
    receipt: string
    channelStatus: string
  }>> {
    return this.delReq(`/api/v2/channels/${peerId}/${direction}`)
  }
  public async openChannel(peerId: string, amount: string): Promise<ExpandedJsonResponse> {
    return this.postReq('/api/v2/channels', { peerId, amount })
  }

  // tickets API
  public async redeemTickets(): Promise<ExpandedJsonResponse> {
    return this.postReq('/api/v2/tickets/redeem', {})
  }
  public async getTickets(): Promise<ExpandedJsonResponse> {
    return this.getReq('/api/v2/tickets')
  }
  public async getTicketStats(): Promise<ExpandedJsonResponse> {
    return this.getReq('/api/v2/tickets/statistics')
  }

  // messages API
  public async signMessage(msg: string): Promise<ExpandedJsonResponse> {
    return this.postReq('/api/v2/messages/sign', { message: msg })
  }
  public async sendMessage(body: string, recipient: string, path?: string[]): Promise<ExpandedTextResponse> {
    return this.postReq('/api/v2/messages', { body, recipient, path })
  }

  // node API
  public async getInfo(): Promise<ExpandedJsonResponse<{
    announcedAddress: string[]
    channelClosurePeriod: number
    connectivityStatus: string
    environment: string
    hoprChannels: string
    hoprNetworkRegistry: string
    hoprToken: string
    isEligible: string
    listeningAddress: string[]
    network: string
  }>> {
    return this.getReq('/api/v2/node/info')
  }
  public async getVersion(): Promise<ExpandedTextResponse> {
    return this.getReq('/api/v2/node/version')
  }
  public async ping(peerId: string): Promise<ExpandedJsonResponse<{ latency: number }>> {
    return this.postReq('/api/v2/node/ping', { peerId })
  }
  public async getPeers(): Promise<ExpandedJsonResponse<{
    connected: {
      peerId: string
      quality: number
    }[]
    announced: {
      peerId: string
      quality: number
    }[]
  }>> {
    return this.getReq('/api/v2/node/peers')
  }
  public async getPeerInfo(peerId: string): Promise<ExpandedJsonResponse<{
    announced: string[]
    observed: string[]
  }>> {
    return this.getReq(`/api/v2/peerInfo/${peerId}`)
  }

  // settings API
  public async getSettings(): Promise<ExpandedJsonResponse<{
    strategy: string
    includeRecipient: boolean
  }>> {
    return this.getReq('/api/v2/settings')
  }
  public async setSetting(key: string, value: string | boolean): Promise<ExpandedJsonResponse> {
    return this.putReq(`/api/v2/settings/${key}`, { settingValue: value })
  }

  // entryNodes API
  public async getEntryNodes(): Promise<ExpandedJsonResponse<{
    [id: string]: {
      multiaddrs: string[]
      isEligible: boolean
    }
  }>> {
    return this.getReq('/api/v2/node/entryNodes')
  }
}

// some types

export type ExpandedJsonResponse<R = any> = {
    json: () => Promise<R>
  } & Response

export type ExpandedTextResponse = Response

export type Channel = {
  type: string
  channelId: string
  peerId: string
  status: string
  balance: string
}

export type Aliases = Record<string, string>

export type Balances = {
  hopr: string
  native: string
}

export type Addresses = {
  hopr: string
  native: string
}

export type ChannelDirection = 'incoming' | 'outgoing'
