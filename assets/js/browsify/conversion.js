function conversion(){
  if(localStorage.getItem('browsifyToken')){
    let fingerprint_id = localStorage.getItem('browsifyToken')
    fetch(`http://localhost:1337/api/v1/fingerprint/conversion/${fingerprint_id}`, {
      method: "GET"
    })
  }
}
