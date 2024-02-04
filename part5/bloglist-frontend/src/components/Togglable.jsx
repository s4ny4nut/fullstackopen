import { useState, forwardRef, useImperativeHandle } from 'react'
import propTypes from 'prop-types'

const Toggleable = forwardRef((props, refs) => {
  const [isVisible, setIsVisible] = useState(false)


  const hideWhenVisible = isVisible ? 'none' : ''
  const showWhenVisible = isVisible ? '' : 'none'

  const toggleVisibility = () => {
    setIsVisible(!isVisible)
  }

  useImperativeHandle(refs, () => {
    return {
      toggleVisibility
    }
  })

  return (
    <div>
      <div style={{ display: hideWhenVisible }}>
        <button
          onClick={() => toggleVisibility()}>{props.buttonLabel}</button>
      </div>
      <div style={{ display: showWhenVisible }}>
        {props.children}
        <button onClick={() => toggleVisibility()}>cancel</button>
      </div>
    </div>
  )
})

Toggleable.displayName = 'Toggleable'

Toggleable.propTypes = {
  buttonLabel: propTypes.string.isRequired
}

export default Toggleable