import AV from '../lib/leancloud'
export default function(user){
  var {id, attributes:{username}} = user || AV.User.current() || {attributes:{}}
  return {
    id:id || '',
    username: username || ''
  }//避免出现属性值变为 undefined 或者 null
}
