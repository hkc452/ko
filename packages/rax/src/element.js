import Host from './vdom/host'
import { isWeex } from 'universal-env'
import flattenChildren from './flattenChildren'
const RESERVED_PROPS = {
  key: true,
  ref: true
}
function getRenderErrorInfo () {
  if (Host.component) {
    var name = Host.component.getName()
    if (name) {
      return ' Check the render method of `' + name + '`.'
    }
  }
  return ''
}
function Element(type, key, ref, props, owner) {
  if (isWeex) {
    props = filterProps(type, props);
  }

  return {
    // Built-in properties that belong on the element
    type,
    key,
    ref,
    props,
    // Record the component responsible for creating this element.
    _owner: owner,
  };
};
function flattenStyle (style) {
  if (!style) {
    return undefined
  }

  if (!Array.isArray(style)) {
    return style
  } else {
    let result = {}
    for (let i = 0; i < style.length; ++i) {
      let computedStyle = flattenStyle(style[i])
      if (computedStyle) {
        for (let key in computedStyle) {
          result[key] = computedStyle[key]
        }
      }
    }
    return result
  }
}
function flattenStyle (style) {
  if (!style) {
    return undefined
  }

  if (!Array.isArray(style)) {
    return style
  } else {
    let result = {}
    for (let i = 0; i < style.length; ++i) {
      let computedStyle = flattenStyle(style[i])
      if (computedStyle) {
        for (let key in computedStyle) {
          result[key] = computedStyle[key]
        }
      }
    }
    return result
  }
}
// TODO: move to weex-drvier
function filterProps (type, props) {
  // Only for weex text
  if (type === 'text') {
    let children = props.children
    let value = props.value

    // Value is first
    if (value == null && children != null) {
      if (Array.isArray(children)) {
        children = children.map(function (val) {
          if (typeof val === 'number' || typeof val === 'string') {
            return val
          } else {
            return ''
          }
        }).join('')
      } else if (typeof children !== 'number' && typeof children !== 'string') {
        children = ''
      }

      props.value = String(children)
    }

    props.children = null
  }

  return props
}
export function createElement (type, config, children) {
  if (type == null) {
    throw Error('createElement: type should not be null or undefined.' + getRenderErrorInfo())
  }
  // Reserved names are extracted
  let props = {}
  let propName
  let key = null
  let ref = null

  if (config != null) {
    ref = config.ref === undefined ? null : config.ref
    key = config.key === undefined ? null : String(config.key)
    // Remaining properties are added to a new props object
    for (propName in config) {
      if (!RESERVED_PROPS[propName]) {
        props[propName] = config[propName]
      }
    }
  }

  const childrenLength = arguments.length - 2
  if (childrenLength > 0) {
    if (childrenLength === 1 && !Array.isArray(children)) {
      props.children = children
    } else {
      let childArray = children
      if (childrenLength > 1) {
        childArray = new Array(childrenLength)
        for (var i = 0; i < childrenLength; i++) {
          childArray[i] = arguments[i + 2]
        }
      }
      props.children = flattenChildren(childArray)
    }
  }

  // Resolve default props
  if (type && type.defaultProps) {
    let defaultProps = type.defaultProps
    for (propName in defaultProps) {
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName]
      }
    }
  }

  if (props.style && (Array.isArray(props.style) || typeof props.style === 'object')) {
    props.style = flattenStyle(props.style)
  }

  return new Element(
    type,
    key,
    ref,
    props,
    Host.component
  )
}
export function createFactory(type) {
  const factory = createElement.bind(null, type);
  // Expose the type on the factory and the prototype so that it can be
  // easily accessed on elements. E.g. `<Foo />.type === Foo`.
  // This should not be named `constructor` since this may not be the function
  // that created the element, and it may not even be a constructor.
  factory.type = type;
  return factory;
}