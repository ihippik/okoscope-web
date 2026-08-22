import type { InventoryKind, RuntimeGroup } from '../../shared/api/types'

type ActivityPresentation = {
  itemLabel: string
  countLabel: string
  behaviorLabel: string
}

const activityCopy: Record<InventoryKind, ActivityPresentation> = {
  process: {
    itemLabel: 'Process launches',
    countLabel: 'launches',
    behaviorLabel: 'Process launch',
  },
  destination: {
    itemLabel: 'Outbound connections',
    countLabel: 'connection observations',
    behaviorLabel: 'Outbound connection',
  },
  domain: { itemLabel: 'Domains', countLabel: 'DNS observations', behaviorLabel: 'DNS request' },
  syscall: { itemLabel: 'System calls', countLabel: 'observations', behaviorLabel: 'System call' },
  inbound_endpoint: {
    itemLabel: 'Inbound connections',
    countLabel: 'inbound observations',
    behaviorLabel: 'Inbound connection',
  },
  file_activity: {
    itemLabel: 'File activity',
    countLabel: 'file activity observations',
    behaviorLabel: 'File activity',
  },
}

export function getActivityPresentation(kind: InventoryKind): ActivityPresentation {
  return activityCopy[kind]
}

export function getEventKindLabel(
  eventKind: string,
  summary?: RuntimeGroup['semantic_summary'],
): string {
  if (summary) {
    if ('executable' in summary) return 'Process launch'
    if ('destination_address' in summary) return 'Outbound connection'
    if ('name' in summary && 'query_type' in summary) return 'DNS request'
    if ('syscall' in summary) return 'System call'
    if ('local_address' in summary)
      return eventKind === 'network.accept' ? 'Accepted inbound connection' : 'Opened port'
    if ('operation' in summary && 'path' in summary) return `File ${String(summary.operation)}`
  }
  const known: Record<string, string> = {
    ProcessExec: 'Process launch',
    NetworkConnect: 'Outbound connection',
    NetworkDnsQuery: 'DNS request',
    NetworkDnsResponse: 'DNS response',
    Syscall: 'System call',
    'network.listen': 'Opened port',
    'network.accept': 'Accepted inbound connection',
    NetworkListen: 'Opened port',
    NetworkAccept: 'Accepted inbound connection',
    'file.create': 'File create',
    'file.modify': 'File modify',
    'file.delete': 'File delete',
    'file.rename': 'File rename',
  }
  return known[eventKind] ?? 'Observed activity'
}

export type AddressFamily = 'ipv4' | 'ipv6'

export function formatEndpoint(
  addressFamily: AddressFamily,
  address: string,
  port: number,
): string {
  return addressFamily === 'ipv6' ? `[${address}]:${Number(port)}` : `${address}:${Number(port)}`
}

export function getWildcardEndpointLabel(
  addressFamily: AddressFamily,
  address: string,
): string | undefined {
  if (addressFamily === 'ipv4' && address === '0.0.0.0') return 'All IPv4 interfaces'
  if (addressFamily === 'ipv6' && address === '::') return 'All IPv6 interfaces'
  return undefined
}

export const directionLabel = (direction: 'egress' | 'ingress') =>
  direction === 'egress' ? 'Outgoing' : 'Incoming'
