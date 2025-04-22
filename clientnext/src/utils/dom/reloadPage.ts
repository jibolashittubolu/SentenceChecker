const reloadPage = () :void => {
  window.location.reload();
};



const reloadPageStrategy2 = () :void => {
  window.location.href = window.location.href;
};

export {reloadPage, reloadPageStrategy2}
