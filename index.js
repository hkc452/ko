import Component from './packages/rax/component'
import { createElement } from './packages/rax/element'
function Foo (props) {
  return <props.tag />
}
let foo = <Foo tag='Foo' />
// let bar = () => {
// }
// let foo = <Foo foo='Foo' bar={bar} />
var instance =
<div>
  <div />
</div>


var element = instance.props.children

