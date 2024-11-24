import React, { useState } from 'react'

function Navbar({place, setPlace, data}) {
  return (
    <div>
        <h2>Map Project</h2>
        <input type='text' onChange={(e)=>{
            setPlace(e.target.value)
        }}/>
        <h4>{data}</h4>
    </div>
  )
}

export default Navbar