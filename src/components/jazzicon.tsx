// Hacks based on
// https://github.com/MetaMask/metamask-extension/blob/develop/ui/app/components/ui/jazzicon/jazzicon.component.js
import React, { createRef, CSSProperties, PureComponent } from 'react'
import PropTypes from 'prop-types'
import md5 from 'md5'

// @ts-ignore
import jazzicon from '@metamask/jazzicon'

/**
 * Wrapper around the jazzicon library to return a React component, as the library returns an
 * HTMLDivElement which needs to be appended.
 */

export type Props = {
  diameter: number | null | undefined
  className?: string
  style?: Partial<CSSProperties>
  address?: string
}

export default class Jazzicon extends PureComponent<Props> {
  static propTypes = {
    address: PropTypes.string.isRequired,
    className: PropTypes.string,
    diameter: PropTypes.number,
    style: PropTypes.object
  }

  static defaultProps = {
    diameter: 46
  }

  container = createRef<HTMLDivElement>()

  componentDidMount() {
    this.appendJazzicon()
  }

  componentDidUpdate(prevProps: Props) {
    const { address: prevAddress, diameter: prevDiameter } = prevProps
    const { address, diameter } = this.props

    if (address !== prevAddress || diameter !== prevDiameter) {
      this.removeExistingChildren()
      this.appendJazzicon()
    }
  }

  removeExistingChildren() {
    // remove icon
    while (this.container.current?.firstChild) {
      this.container.current.firstChild.remove();
    }
  }

  appendJazzicon() {
    if (typeof window !== 'undefined') {
      const { address, diameter } = this.props
      // NB: 'goodenough' transform between B58 string and js int
      const image = jazzicon(diameter, md5(address || "default"))
      this.container.current?.appendChild(image)
    }
  }

  render() {
    const { className, style } = this.props

    return <div className={className} ref={this.container} style={style} />
  }
}
