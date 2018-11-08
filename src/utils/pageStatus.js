export  function addHomeListener () {
  document.addEventListener('visibilitychange',function() {
    if(document.visibilityState=='hidden') {
      location.reload(true);
    }
  })
  document.addEventListener('webkitvisibilitychange',function() {
    if(document.webkitVisibilityState=='visible') {
      location.reload(true);
    }
  })
  document.addEventListener('mozvisibilitychange',function() {
    if(document.mozVisibilityState=='visible') {
      location.reload(true);
    }
  })
  document.addEventListener('msvisibilitychange',function() {
    if(document.msVisibilityState=='visible') {
      location.reload(true);
    }
  })
}


export  function addListener () {
  document.addEventListener('visibilitychange',function() {
    if(document.visibilityState=='visible') {
      location.reload(true);
    }
  })
  document.addEventListener('webkitvisibilitychange',function() {
    if(document.webkitVisibilityState=='visible') {
      location.reload(true);
    }
  })
  document.addEventListener('mozvisibilitychange',function() {
    if(document.mozVisibilityState=='visible') {
      location.reload(true);
    }
  })
  document.addEventListener('msvisibilitychange',function() {
    if(document.msVisibilityState=='visible') {
      location.reload(true);
    }
  })
}

export  function removeListener () {
  document.removeEventListener('visibilitychange');
  document.removeEventListener('webkitvisibilitychange');
  document.removeEventListener('mozvisibilitychange');
  document.removeEventListener('msvisibilitychange');
}
