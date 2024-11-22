import React, { useState } from 'react'

function Navbar({place, setPlace}) {
  return (
    <div>
        <h2>Map Project</h2>
        <input type='text' onChange={(e)=>{
            setPlace(e.target.value)
        }}/>
    </div>
  )
}

export default Navbar