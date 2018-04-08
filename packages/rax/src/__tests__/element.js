import Component from '../component'
import { createElement, createFactory } from '../element'
import ServerDriver from 'driver-server'
import Host from '../vdom/host'

describe('Element', () => {
  function createNodeElement (tagName) {
    return {
      nodeType: 1,
      tagName: tagName.toUpperCase(),
      attributes: {},
      style: {},
      childNodes: [],
      parentNode: null
    }
  }

  beforeEach(function () {
    Host.driver = ServerDriver
  })

  afterEach(function () {
    Host.driver = null
  })

  class ComponentClass extends Component {
    render () {
      return <div />
    }
  }
  it('createElement', () => {
    function Foo (props) {
      return <props.tag />
    }
    let foo = <Foo tag='Foo' />
    expect(foo.props.tag).toBe('Foo')
  })

  it('return a complete element according to spec', () => {
    let element = createFactory(ComponentClass)()
    expect(element.type).toBe(ComponentClass)
    expect(element.key).toBe(null)
    expect(element.ref).toBe(null)
    // expect(Object.isFrozen(element)).toBe(true)
    // expect(Object.isFrozen(element.props)).toBe(true)
    expect(element.props).toEqual({})
  })

  it('coerces the key to a string', function () {
    let element = createFactory(ComponentClass)({
      key: 12,
      foo: '56'
    })
    expect(element.type).toBe(ComponentClass)
    expect(element.key).toBe('12')
    expect(element.ref).toBe(null)
    // expect(Object.isFrozen(element)).toBe(true)
    // expect(Object.isFrozen(element.props)).toBe(true)
    expect(element.props).toEqual({foo: '56'})
  })

  it('merges an additional argument onto the children prop', function () {
    let a = 1
    let element = createFactory(ComponentClass)({
      children: 'text'
    }, a)
    expect(element.props.children).toBe(a)
  })

  it('does not override children if no rest args are provided', function () {
    let element = createFactory(ComponentClass)({
      children: 'text'
    })
    expect(element.props.children).toBe('text')
  })

  it('overrides children if null is provided as an argument', function () {
    let element = createFactory(ComponentClass)({
      children: 'text'
    }, null)
    expect(element.props.children).toBe(null)
  })

  it('merges rest arguments onto the children prop in an array', function () {
    let a = 1
    let b = 2
    let c = 3
    let element = createFactory(ComponentClass)(null, a, b, c)
    expect(element.props.children).toEqual([1, 2, 3])
  })


  it('should use the same key for a cloned element', function() {
    var instance =
      <div>
        <div />
      </div>
    ;

    var element = instance.props.children;
    var cloned = cloneElement(element);
    console.log('key',  cloned.key)
    expect(cloned.key).toBe(element.key);
  });
})
