---
name: MobX Stores
description: Все stores — state, methods, socket subscriptions, dependencies
type: project
---

## AppDataStore

Root store. Наблюдает `auth.isAuthenticated` → подключает/отключает socket.
**Dependencies:** AuthStore, SocketTransport

---

## AuthStore

**State:** user (UserDto | null), status (AuthStatus)
**Computed:** roles[], permissions[], isAuthenticated
**Methods:**
- `restore()` — load user from saved token
- `signIn(login, password)` → API → save tokens → load user
- `signUp(params)` → API → save tokens → load user
- `signOut()` → clear tokens → disconnect socket
- `load()` — fetch current user from API
- `updateProfile(data)` — update profile via API
**Dependencies:** ApiService, AuthSessionService

---

## ServersListStore

**State:** servers (PagedHolder), mutations
**Methods:** load(pagination), create(params), update(id, params), delete(id), start(id), stop(id), restart(id)
**Dependencies:** ApiService

## ServerDetailStore

**State:** server (EntityHolder), peers list
**Methods:** load(serverId), start(), stop(), restart(), loadPeers()
**Dependencies:** ApiService

## ServerStatsStore

**State:** speedHistory[], trafficHistory[]
**Socket:** wg:subscribe:server(serverId) → wg:server:stats
**Methods:** subscribe(serverId), unsubscribe()

---

## PeersListStore

**State:** peers (PagedHolder), optional serverId filter
**Methods:** load(pagination, serverId?), create(serverId, params), update(id, params), delete(id), start(id), stop(id)
**Dependencies:** ApiService

## PeerDataStore

**State:** peer (EntityHolder), mutations
**Methods:** load(peerId), toggle(), delete(), assign(userId), revoke(), rotatePsk(), removePsk(), getQr()
**Dependencies:** ApiService

## PeerStatsStore

**State:** speedHistory[], trafficHistory[]
**Socket:** wg:subscribe:peer(peerId) → wg:peer:stats
**Methods:** subscribe(peerId), unsubscribe()

## PeersLiveStore

**State:** Map<peerId, { isActive, lastHandshake, status }>
**Socket:** wg:peer:active, wg:peer:status (persistent listeners)
**Methods:** getIsActive(peerId), getStatus(peerId)

---

## OverviewStatsStore

**State:** overview stats, speedHistory[], trafficHistory[]
**Socket:** wg:subscribe:overview → wg:stats:overview
**Methods:** subscribe(), unsubscribe()

---

## UsersDataStore

**State:** users (PagedHolder)
**Methods:** load(pagination, query?), create(params), delete(id)
**Dependencies:** ApiService

---

## Паттерн использования

```typescript
// В компоненте
const store = useServersListStore(); // IoC singleton через hook

useEffect(() => {
  store.load({ offset: 0, limit: 1000 });
  return () => store.dispose();
}, []);

// Наблюдение
return <Observer render={() => (
  <Table data={store.servers.data} />
)} />;
```
