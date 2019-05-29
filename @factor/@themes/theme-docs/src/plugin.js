module.exports.default = Factor => {
  return new (class {
    constructor() {
      this.addPaths()
      this.addComponents()
    }

    addComponents() {
      Factor.$filters.add("components", _ => {
        _["app-btn"] = () => import("./el/btn")
        _["app-link"] = () => import("./el/link")
        return _
      })
    }

    async addPaths() {
      Factor.$filters.add("page-templates", _ => {
        return _.concat([
          {
            name: "Default",
            value: "default",
            component: () => import("./page-template-default")
          }
        ])
      })

      Factor.$filters.add("content-routes", _ => {
        const base = "docs"
        const routes = [
          {
            path: "/",
            component: () => import("./page-home"),
            meta: { background: "#fafbff" }
          },
          {
            path: "/docs",
            component: () => import("./page-docs")
          },
          {
            path: "/docs/:markdownurl",
            component: () => import("./page-docs")
          }
        ]

        return _.concat(routes)
      })
    }
  })()
}
