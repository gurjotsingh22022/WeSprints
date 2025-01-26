import React from 'react'

export const NotFound = () => {

    const css = `
    #div-big{
  min-height: 98vh;
  width: 100%;
}
#div-left{
  height: 100%;
  float: left;
  width: 40%;  
}
#div-right{
  height: 100%;
  float: right;
  width: 40%;  
}
#div-center{
  height: 98vh;
  margin: 0 auto;
  width: 300px;  
  text-align: left;
}
#div-center-top{
  min-height: 30%;
  text-align: left;
}
#div-center-middle{
  height: 40%;
  text-align: left;
}
#div-center-buttom{
  min-height: 30%;
  text-align: left;
}
#font-color1{
  color:#FF9900;
}
#font-color2{
  color:#636592;
}
#font-color3{
  color:#FF44CC;
}
#font-color4{
  color:#526273;
}
#text-link{
  color:#526273;
  text-decoration:none; 
}

span, a{
font-size: 1.4em;
}

    `
  return (
    <>
    <style>
        {css}
    </style>
    
    <div id="div-big">
            <div id="div-center">
                <div id="div-center-top">
                </div>
                <div id="div-center-middle">
                    <span id="font-color4">//404 error</span><br />
                    <span id="font-color1">if</span>
                    <span>(</span>
                    <span id="font-color3">&#160;! </span>
                    <span>found_website&#160;)</span><br />
                    <span id="font-color1">&#160;&#160;&#160;&#160;console.log{'('}</span>
                    <span id="font-color2">"what !?"</span><span id="font-color1">{')'}</span><span>;</span><br />
                    <a id="text-link" href="#">
                      //Click here go home.
                    </a><br />
                </div>
                <div id="div-center-buttom">
                </div>
            </div>
        </div>

    </>
  )
}

export default NotFound;
