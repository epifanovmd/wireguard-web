---
name: Pages Reference
description: Все страницы — компоненты, stores, API calls, socket subscriptions, permissions
type: project
---

## Dashboard (`/`)

**Компоненты:** Dashboard.tsx
**Stores:** OverviewStatsStore (socket: wg:stats:overview), ServersListStore
**Permissions:** wg:server:view, wg:stats:view
**UI:** 4 stat cards (servers, active, peers, speeds), speed chart, traffic chart, clickable servers table

---

## Servers List (`/wireguard/servers`)

**Компоненты:** ServersList.tsx, ServerForm.tsx (modal)
**Stores:** ServersListStore (CRUD, pagination)
**VM:** useServersListVM()
**Socket:** live status updates
**Permissions:** wg:server:view (list), wg:server:manage (create/delete)
**Actions:** Create, Delete, Start, Stop, Restart

## Server Detail (`/wireguard/servers/$serverId`)

**Компоненты:** ServerDetail.tsx, ServerLiveCharts.tsx, ServerForm.tsx (edit modal)
**Stores:** ServerDetailStore (server + peers), ServerStatsStore (charts)
**VM:** useServerDetailVM(serverId)
**Socket:** wg:subscribe:server(serverId) → real-time charts
**Tabs:** Charts (speed + traffic), Configuration, Peers
**Actions:** Edit, Start/Stop/Restart

---

## Peers List (`/wireguard/peers`)

**Компоненты:** PeersList.tsx, PeerForm.tsx (modal)
**Stores:** PeersListStore (pagination, server filter), PeersLiveStore (active/status)
**VM:** usePeersListVM(serverId?)
**Socket:** live status + active updates
**Permissions:** wg:peer:view (list), wg:peer:manage (create/delete/toggle)
**Actions:** Create, Delete, Toggle (start/stop), QR

## Peer Detail (`/wireguard/peers/$peerId`)

**Компоненты:** PeerDetail.tsx, PeerLiveCharts.tsx, PeerForm.tsx (edit modal)
**Stores:** PeerDataStore (detail + mutations), PeerStatsStore (charts), PeersLiveStore
**VM:** usePeerDetailVM(peerId)
**Socket:** wg:subscribe:peer(peerId) → real-time charts + active status
**Tabs:** Charts (speed + traffic), Configuration
**Actions:** Edit, Toggle, Delete, QR, Assign/Revoke user, Rotate/Remove PSK

---

## Stats (`/wireguard/stats`)

**Компоненты:** Stats.tsx
**Stores:** OverviewStatsStore
**Socket:** wg:subscribe:overview
**Permissions:** wg:stats:view
**UI:** Aggregated charts, history

---

## Users List (`/users`)

**Компоненты:** UsersList.tsx, CreateUserModal.tsx
**Stores:** UsersDataStore
**VM:** useUsersListVM()
**Permissions:** user:view (list), user:manage (create/delete)

## User Detail (`/users/$userId`)

**Компоненты:** UserDetail.tsx
**VM:** useUserDetailVM(userId)
**Permissions:** user:manage (edit)

---

## Auth Pages (`/auth/*`)

- **SignIn:** email/password form + passkey button. AuthStore.signIn()
- **SignUp:** email, password, confirm. AuthStore.signUp()
- **ForgotPassword:** send reset email
- **RecoveryPassword:** reset with token

## Profile (`/profile`)

**Stores:** AuthStore (updateProfile)
**UI:** Edit firstName, lastName, birthDate, gender

## Settings (`/settings`)

**Tabs:** MyPermissions (read-only roles + permissions list)
