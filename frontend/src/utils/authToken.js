export function getToken(){
  return localStorage.getItem('gozone-authToken') || null;
}

export function setToken(token){
  localStorage.setItem('gozone-authToken',token);
}

export function clearToken(){
  localStorage.removeItem('gozone-authToken');
}
