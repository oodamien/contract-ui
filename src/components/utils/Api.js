import get from 'lodash.get'

export const getSchema = function getSchema(url) {
  return new Promise((resolve, reject) => {
    fetch(`${url}`, {
      method: 'GET',
      headers: {
        Accept: 'application/vnd.initializr.v2.1+json',
      },
    })
      .then(
        response => response.json(),
        () => {
          reject()
          return null
        }
      )
      .then(data => {
        if (data) {
          resolve(data)
        }
      })
  })
}

export const getConfig = function getConfig(json) {
  const properties = get(json, 'properties', {})
  const items = Object.keys(properties).sort()
  const keyProperties = []

  const buildProp = (name, item, parents = [], level = 0) => {
    const type = get(item, 'type')
    const props = get(item, 'properties', null)
    const key = [...parents, name].join('.')
    keyProperties.push(key)
    if (['string', 'boolean', 'any'].indexOf(type) > -1 || !props) {
      return {
        type,
        name,
        key,
        parents,
      }
    }
    const keyItems = Object.keys(props).sort()
    return {
      type,
      name,
      key,
      parents,
      children: keyItems.map(keyItem =>
        buildProp(keyItem, get(props, keyItem), [...parents, name], level + 1)
      ),
    }
  }
  return {
    properties: items
      .map(item => buildProp(item, get(properties, item)))
      .sort((a, b) => {
        if (
          get(a, 'children', []).length === 0 &&
          get(b, 'children', []).length === 0
        ) {
          return get(a, 'name') > get(b, 'name') ? 1 : -1
        }
        if (
          get(a, 'children', []).length > 0 &&
          get(b, 'children', []).length > 0
        ) {
          return get(a, 'name') > get(b, 'name') ? 1 : -1
        }
        if (get(a, 'children', []).length === 0) {
          return -1
        }
        if (get(b, 'children', []).length === 0) {
          return 1
        }
        return 0
      }),
    keyProperties,
  }
}
