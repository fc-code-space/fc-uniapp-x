# FC Stores 使用规范

> **AI 召回信号**：本文件描述 fcuni 框架中 Pinia 持久化状态管理（基于 `defineStore` + 自定义持久化插件）的使用规则。
> 当用户提到「store / 状态 / 全局变量 / pinia / 持久化 / 跨页面状态 / 用户状态」时，必须读本文件。
> 当用户要新增状态管理、读取 / 修改持久化数据、清理登录态时，也必须先读本文件。

## 1. 模块定位

- 基于 `pinia` 的 `defineStore`（composition API 风格：`defineStore('id', () => { ... })`），框架已自动 `createPinia()` 并挂载持久化插件，业务代码不需要再调用 `createPinia()` 或 `app.use(pinia)`。
- 持久化通过自定义插件实现（见 `fcuni/store/persist.ts`），底层是 `uni.getStorageSync` / `uni.setStorageSync` / `uni.removeStorageSync`。Store 创建时自动恢复数据，mutation 后自动写入。
- 系统级状态（语言、主题）由 `FC.useFcSystemStore()` 提供（见 `fcuni/store/system.ts`），**业务状态必须新建在 `modules/stores/<业务>.ts`**。
- 持久化 key 必须互不相同，避免互相覆盖。

## 2. ✅ 必须遵守

- 业务 Store 统一放在 `modules/stores/<业务名>.ts`，导出 `useXxxStore`（注意不是 `useFcXxxStore`，那是框架内部命名空间）。
- Store 内状态必须可被 `JSON.stringify` 序列化，**禁止保存函数、循环引用、平台原生对象**（如 `Map` / `Set` / `Date` 实例）。
- 持久化用 `defineStore` 第三个参数：
  ```ts
  defineStore('user', () => { ... }, {
    persist: { key: 'fc-user' }      // 必须传 key
  })
  ```
- 系统级状态（`language`、`theme`）通过 `FC.useFcSystemStore()` 访问，**不要在 `modules/stores` 里定义同名 `fcSystem` Store**。
- 修改语言、主题等系统状态时，直接赋值即可：`fcSystemStore.language = 'en'`。持久化和 i18n 实例都会自动同步。

## 3. ❌ 禁止

- ❌ 在业务代码里再调 `createPinia()` / `app.use(pinia)`。框架已挂载，会造成多实例互不感知。
- ❌ 在 `modules/stores` 里定义 `id` 为 `'fcSystem'` 的 Store，会覆盖框架系统 Store。
- ❌ 直接修改 `fcuni/store/system.ts`。该文件由 fc-cli 生成，业务状态应新建 Store。
- ❌ 把不同业务的持久化用同一个 `key`（如都用 `'fc-user'`）。每个 Store 必须用唯一 key。
- ❌ 在 Store 里保存 `Date`、`Map`、`Set`、`function` 等不可 JSON 序列化的值。`Date` 应存时间戳，`Map`/`Set` 应转 `Record` / `Array`。
- ❌ 在 setup 外（如 `main.ts`）调用 `useUserStore()`。Store 必须在组件 setup、其它 Store action、或被 `defineStore` 调用的地方调用。

## 4. 标准用法

### 4.1 定义业务 Store

```ts
// modules/stores/user.ts
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const token = ref('')
  const age = ref(0)

  const reset = () : void => {
    token.value = ''
    age.value = 0
  }

  return {
    token,
    age,
    reset
  }
}, {
  persist: {
    key: 'fc-user'
  }
})
```

要点：
- 第二个参数用 `() => { ... }`（composition API 风格），return 的字段会暴露给模板。
- `reset` 这种 action 函数直接 return 出去即可，不用 `actions: {}`。
- 持久化字段是 return 出来的全部 state；如只持久化部分字段，用 `persist.paths`（见 4.3）。

### 4.2 页面使用 Store

```vue
<script setup lang="ts">
import { useUserStore } from '@/modules/stores/user'

const userStore = useUserStore()

const setUser = () => {
  userStore.token = 'abcdefg'
  userStore.age = 18
}

const clearUser = () => {
  userStore.reset()
}
</script>

<template>
  <text>{{ userStore.token }}</text>
  <text>{{ userStore.age }}</text>
</template>
```

### 4.3 只持久化部分字段

```ts
persist: {
  key: 'fc-user',
  paths: ['token']    // 只持久化 token
}
```

| 配置 | 必填 | 说明 |
|------|------|------|
| `key` | 是 | uni Storage 中使用的唯一 key |
| `paths` | 否 | 只持久化指定字段；不填写时持久化全部 state |
| `debounceMs` | 否 | 保留配置项；当前实现为保证字节码模式稳定性，在 mutation 后同步写入 |

### 4.4 清除某个 Store 的持久化数据

```ts
import { clearPersistedState } from '@/fcuni/store/persist'

clearPersistedState('fc-user')  // 与 persist.key 一致
```

## 5. 关键文件清单

| 路径 | 作用 | AI 修改建议 |
|------|------|------|
| `fcuni/store/index.ts` | Pinia 实例（fc-cli 生成，勿手改） | **不要编辑** |
| `fcuni/store/system.ts` | 框架系统 Store：language、theme（fc-cli 生成，勿手改） | **不要编辑** |
| `fcuni/store/persist.ts` | 持久化插件实现（fc-cli 生成，勿手改） | **不要编辑**，但导出 `clearPersistedState`、`hasPersistedState` 给业务用 |
| `modules/stores/<业务>.ts` | 业务 Store，导出 `useXxxStore` | 新增业务状态时建文件 |

## 6. 默认行为（无需在业务代码处理）

- **自动持久化**：配置 `persist` 后，Store 创建时从 Storage 读初始值，mutation 后自动写回。
- **同步写入**：当前实现忽略 `debounceMs`，mutation 后立刻写入 Storage，保证字节码模式稳定性。
- **空对象自动清理**：state 全部被移除后，Storage 项也会被 `uni.removeStorageSync` 清掉。
- **持久化字段取自 return 的 state**：`paths` 不填时全部持久化。

## 7. 常见问题

**Q：登录退出想彻底清空，怎么做？**
A：在 Store action 里把 state 重置（如上面的 `reset` 函数），然后调 `clearPersistedState('fc-user')`。单独清 state 不够，Storage 里还有旧值，下次启动会恢复。

**Q：Store 里的 `Date` 字段存进去变了字符串，反序列化也变了？**
A：持久化走 `JSON.stringify`，不支持原生类型。`Date` 转时间戳（`number`），`Map`/`Set` 转 `Record` / `Array`。

**Q：自定义了 `persist.key = 'fc-user'`，但登录页和首页都用了同一个 Store，登录后页面没刷新？**
A：检查是否在 `modules/stores` 重复定义同名 Store。Pinia 不允许同名 Store 共存，会用首次注册的实例。

**Q：能不能监听 Store 变化？**
A：用 `store.$subscribe((mutation, state) => { ... })`，或在 setup 里用 `watch(() => store.xxx, ...)`。

**Q：业务代码能改 `fcSystemStore` 里的 `language` / `theme` 吗？**
A：可以，且应该这样做（`fcSystemStore.language = 'en'`）。持久化和响应式主题都会同步，**不要绕过去改内部状态**。