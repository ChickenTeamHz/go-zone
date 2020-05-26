const shortid = require('shortid');

// 校验合法ID
global.checkCurrentId = (ids) => {
  if (!ids) return false;
  let idState = true;
  if( typeof ids === 'string'){
     return shortid.isValid(ids);
  }
  if (ids instanceof Array  && ids.length > 0) {
    for (let i = 0; i < ids.length; i++) {
      if (!shortid.isValid(ids[i])) {
        idState = false;
        break;
      }
    }
  } else {
    idState = false;
  }
  return idState;
}
