import BaseIconLink from './_base-icon-link'

const mountBaseIconLink = (options = {}) => {
  return mount(BaseIconLink, {
    stubs: {
      RouterLink: {
        functional: true,
        render(h, { slots, data }) {
          return <a data-router-link="true">{slots().default}</a>
        },
      },
    },
    slots: {
      default: 'hello',
    },
    ...options,
  })
}

describe('@components/_base-icon-link', () => {
  const originalConsoleWarn = global.console.warn
  let warning
  beforeEach(() => {
    warning = undefined
    global.console.warn = jest.fn((text) => {
      warning = text
    })
  })
  afterAll(() => {
    global.console.warn = originalConsoleWarn
  })

  it('exports a valid component', () => {
    expect(BaseIconLink).toBeAComponent()
  })

  it('warns about missing required props', () => {
    mountBaseIconLink()
    expect(console.warn).toHaveBeenCalledTimes(1)
    expect(warning).toMatch(/Invalid <base-icon-link> props/)
  })

  it('warns about an invalid href', () => {
    mountBaseIconLink({
      propsData: {
        href: '/some/local/path',
        icon: 'home',
      },
    })
    expect(console.warn).toHaveBeenCalledTimes(1)
    expect(warning).toMatch(/Invalid <base-icon-link> href/)
  })

  it('warns about an insecure href', () => {
    mountBaseIconLink({
      propsData: {
        href: 'http://google.com',
        icon: 'home',
      },
    })
    expect(console.warn).toHaveBeenCalledTimes(1)
    expect(warning).toMatch(/Insecure <base-icon-link> href/)
  })

  it('renders an anchor element when passed an `href` and `home` prop', () => {
    const externalUrl = 'https://google.com/'
    const { element } = mountBaseIconLink({
      propsData: {
        href: externalUrl,
        icon: 'home',
      },
    })
    expect(console.warn).not.toHaveBeenCalled()
    expect(element.tagName).toEqual('A')
    expect(element.href).toEqual(externalUrl)
    expect(element.target).toEqual('_blank')
    expect(element.textContent.replace(/\s/g, '')).toEqual('hello')
  })

  it('renders a RouterLink when passed a `name` prop', () => {
    const routeName = 'home'
    const { element, vm } = mountBaseIconLink({
      propsData: {
        name: routeName,
      },
    })
    expect(console.warn).not.toHaveBeenCalled()
    expect(element.dataset.routerLink).toEqual('true')
    expect(element.textContent.replace(/\s/g, '')).toEqual('hello')
    expect(vm.routerLinkTo).toEqual({
      name: routeName,
      params: {},
    })
  })

  it('renders a RouterLink when passed name` and `params` props', () => {
    const routeName = 'home'
    const routeParams = { foo: 'bar' }
    const { element, vm } = mountBaseIconLink({
      propsData: {
        name: routeName,
        params: routeParams,
      },
    })
    expect(console.warn).not.toHaveBeenCalled()
    expect(element.dataset.routerLink).toEqual('true')
    expect(element.textContent.replace(/\s/g, '')).toEqual('hello')
    expect(vm.routerLinkTo).toEqual({
      name: routeName,
      params: routeParams,
    })
  })

  it('renders a RouterLink when passed a `to` prop', () => {
    const routeName = 'home'
    const { element, vm } = mountBaseIconLink({
      propsData: {
        to: {
          icon: routeName,
          name: routeName,
        },
      },
    })
    expect(console.warn).not.toHaveBeenCalled()
    expect(element.dataset.routerLink).toEqual('true')
    expect(element.textContent.replace(/\s/g, '')).toEqual('hello')
    expect(vm.routerLinkTo).toEqual({
      icon: routeName,
      name: routeName,
      params: {},
    })
  })

  it('renders a RouterLink when passed a `to` prop with `params`', () => {
    const routeName = 'home'
    const routeParams = { foo: 'bar' }
    const { element, vm } = mountBaseIconLink({
      propsData: {
        to: {
          icon: routeName,
          name: routeName,
          params: routeParams,
        },
      },
    })
    expect(console.warn).not.toHaveBeenCalled()
    expect(element.dataset.routerLink).toEqual('true')
    expect(element.textContent.replace(/\s/g, '')).toEqual('hello')
    expect(vm.routerLinkTo).toEqual({
      icon: routeName,
      name: routeName,
      params: routeParams,
    })
  })
})
