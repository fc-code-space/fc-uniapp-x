# FC Router 使用规范

> **AI 召回信号**：本文件描述 fcuni 框架中 `FC.Router`（封装 `uni.navigateTo` / `uni.redirectTo` / `uni.switchTab` / `uni.reLaunch`，含路由拦截）的使用规则。
> 当用户提到「路由 / 跳转 / 页面 / push / back / tab / 拦截 / 白名单 / 路由传参」时，必须读本文件。
> 当用户要新增页面、跳转到指定页面、带参数跳转、配置登录拦截时，也必须先读本文件。

## 1. 模块定位

- 封装 `uni.navigateTo` / `uni.redirectTo` / `uni.switchTab` / `uni.reLaunch`，统一入口 `FC.Router.go()`（`fcuni/router/index.ts` 中的 `FCRouter.go()`）。
- 启动时读取 `pages.json` 自动注册拦截器，**业务代码不需要手动 `init`**。
- 在 `uni.*` 四个跳转 API 上加了 `addInterceptor`，可对 `verify: true` 的页面执行白名单/登录拦截。
- 提供参数序列化（`FC.Router.parseParams`）与反序列化（`FC.Router.parse`），对象/数组自动 `JSON` + `encodeURIComponent`。

## 2. ✅ 必须遵守

- **日常跳转走 `FC.Router.go(path, params?)`**，不要直接调用 `uni.navigateTo`（除非需要 `animationType` 等动画参数）。
- **新增页面必须同时在 `pages.json` 的 `pages` 数组注册**，否则 `FC.Router.go` 会跳不到。
- **需要登录的页面，在 `pages.json` 该页条目里加 `"verify": true`**；具体拦截条件写在 `modules/router/index.ts` 的 `FCTypeRouterConfig.shouldInterceptRoute`。
- **接收对象/数组参数用 `FC.Router.parse<T>(value, fallback)`**，不要自己 `decodeURIComponent` + `JSON.parse`。
- **所有拦截配置的 key 必须是 Android/iOS/HarmonyOS/小程序原生跳转 API 名称之一**：`navigateTo` / `redirectTo` / `switchTab` / `reLaunch`。`navigateBack` 不参与拦截。

## 3. ❌ 禁止

- ❌ 页面里直接 `uni.navigateTo({ url: '/pages/xxx' })` 跳普通业务页面。统一走 `FC.Router.go` 才能被拦截器覆盖。
- ❌ 自己手动调用 `Router.init()`。框架已自动初始化，重复 init 会创建多个拦截器。
- ❌ 自己写 `decodeURIComponent(JSON.parse(...))`。用 `FC.Router.parse<T>()` 兜底失败。
- ❌ 在拦截器里手动拦截 `navigateBack`。`navigateBack` 不在 `ROUTE_API_NAMES` 常量列表中，不参与拦截。
- ❌ 在 `interceptFunc` 里调用不会触发新拦截的前向跳转时，使用 `uni.reLaunch` + 自定义条件等花式操作。直接调 `uni.navigateTo` 会被拦截器递归保护放行——`FCRouter.shouldAllow()` 内 `interceptDepth++` 自增后跳过拦截判断。
- ❌ 删除 `pages.json` 里某条页面后又跳它——会跳到空白页。先改 pages.json 再跳。

## 4. 标准用法

### 4.1 普通跳转

```ts
// 无参数
FC.Router.go('pages/home/index')

// 带参数（基础类型）
FC.Router.go('pages/detail', { id: 123, name: '测试' })
```

### 4.2 需要原生动画选项时

```ts
const params = FC.Router.parseParams({ id: 123, token: 'abc' })

uni.navigateTo({
  url: '/pages/detail' + params,
  animationType: 'pop-out',
  animationDuration: 300
})
```

注意：原生 API 的 `url` 必须以 `/` 开头。

### 4.3 页面接收参数（基础类型 + 对象类型）

uni-app x 原生所有 query 参数都是字符串，在页面 `onLoad` 中读取：

```vue
<!-- pages/detail/index.uvue -->
<script setup lang="ts">
const id = ref(0)
const name = ref('')
const data = ref<Record<string, any>>({})

onLoad((e?: Record<string, any>) => {
  if (e == null) return
  id.value = Number(e.id ?? 0) // 基础类型
  // 对象/数组参数
  name.value = FC.Router.parse(e['name'], '') as string
  data.value = FC.Router.parse(e['data'], {}) as Record<string, any>
})
</script>
```

### 4.4 配置登录拦截（白名单）

**第 1 步**：在 `pages.json` 给需要登录的页面加 `verify: true`：

```json
{
  "pages": [
    { "path": "pages/home" },
    {
      "path": "pages/detail",
      "verify": true
    }
  ]
}
```

**第 2 步**：在 `modules/router/index.ts` 编写拦截逻辑：

```ts
import { useUserStore } from '@/modules/stores/user'

export const FCTypeRouterConfig = {
  // 返回 true 表示拦截。仅对 verify: true 的页面生效
  shouldInterceptRoute(): boolean {
    return useUserStore().token == ''
  },
  // 被拦截后执行，例如跳转登录页
  interceptFunc() {
    uni.navigateTo({ url: '/pages/login/index' })
  }
}
```

### 4.5 参数序列化规则

`FC.Router.go('pages/xxx', { ... })` 内部调用 `FCRouter.serializeParams()`（`fcuni/router/index.ts` 中的静态方法）：

| 值类型 | 编码方式 |
|------|------|
| `string` / `number` / `boolean` | `encodeURIComponent(String(value))` |
| `object` / `array` | `encodeURIComponent(JSON.stringify(value))` |
| `null` / `undefined` | 跳过，不生成参数项 |

反序列化用 `FC.Router.parse<T>(value, fallback)`：内部 `decodeURIComponent` + `JSON.parse`，失败/缺失返回 `fallback`。

## 5. 关键文件清单

| 路径 | 作用 | AI 修改建议 |
|------|------|------|
| `fcuni/router/index.ts` | Router 单例（fc-cli 生成，勿手改） | **不要编辑**，调整行为改 fc-cli 模板 |
| `fcuni/types.ts`（`FCTypeRouterConfig`、`FCTypeRouteParams`） | 路由配置/参数类型定义 | **不要编辑** |
| `pages.json` | 页面注册 + `verify` 白名单 | 新增页面必须改这里 |
| `modules/router/index.ts`（如不存在需新建） | 业务侧 `FCTypeRouterConfig`，提供 `shouldInterceptRoute` 与 `interceptFunc` | 新增拦截逻辑时改这里 |

## 6. 默认行为（无需在业务代码处理）

- **拦截范围**：仅 `verify: true` 的页面；未配置 `verify` 直接放行。
- **拦截 API**：`uni.navigateTo` / `uni.redirectTo` / `uni.switchTab` / `uni.reLaunch` 四个；`uni.navigateBack` 不拦截。
- **递归保护**：`interceptFunc` 内部再调前向路由时，本次跳直接通过，避免死循环（`interceptDepth` 自增减）。
- **路径规范化**：自动忽略前缀 / 后缀 `/`，自动去掉 `?` 之后的查询串（`FCRouter.normalizePath()` 处理）。

## 7. 常见问题

**Q：跳转到 `pages/home` 报「页面不存在」？**
A：检查 `pages.json` 的 `pages` 数组是否已注册该路径。`pages.json` 是路由表，跳转前必须先注册。

**Q：配置了 `verify: true` 但没拦截？**
A：检查 `modules/router/index.ts` 是否存在并被自动读取。如果未提供 `shouldInterceptRoute`，所有 `verify` 页面默认放行（`FCRouter.shouldAllow()` 中 `guard != null ? guard() : false`，guard 为 null 时 shouldBlock 为 false）。

**Q：拦截器里跳转登录页再点登录页按钮跳回，会卡死吗？**
A：不会。`interceptDepth` 在 `FCRouter.shouldAllow()` 入口判断 `if (this.interceptDepth > 0) return true`；`interceptFunc` 内部自增 `interceptDepth++` 期间不再走拦截判断，跳转完成后自减 `interceptDepth--`。

**Q：能不能拦截 `uni.navigateBack`？**
A：不能。`navigateBack` 不在 `ROUTE_API_NAMES` 列表中，`FCRouter.init()` 只会对这 4 个 API 加拦截。如果需要拦截返回，请改用页面级的 `onBackPress`。

**Q：传对象参数接收时是字符串 `[object Object]`？**
A：用 `FC.Router.parse<T>(value, fallback)` 解析对象/数组参数。详见 `FCRouter.parse()`（自动 `decodeURIComponent` + `JSON.parse`，失败/缺失返回 `fallback`）。