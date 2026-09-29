// 路由配置
export const FCTypeRouterConfig = {
    /**
     * 路由拦截判断方法，这里面的内容代表，未登录用户将会被拦截【根据实际情况定义】
     * 仅对 pages.json 中标记了 verify:true 的页面生效。
     */
    shouldInterceptRoute(): boolean {
        return false
    },
    /**
     * 路由拦截执行方法，这里面的内容代表，拦截路由后，跳转到登录页面【根据实际情况定义】
     */
    interceptFunc() {
        uni.navigateTo({ url: "/pages/login/index" })
    }
}
