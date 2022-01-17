import React from 'react'

export const onRenderBody = ({ setPostBodyComponents }) => {
  setPostBodyComponents([
    <script
      key='https://cdn.jsdelivr.net/npm/twikoo@1.4.15/dist/twikoo.all.min.js'
      src='https://cdn.jsdelivr.net/npm/twikoo@1.4.15/dist/twikoo.all.min.js'
      crossOrigin="anonymous"
      defer
    />,
  ])
}