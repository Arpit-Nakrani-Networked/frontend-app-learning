import React from 'react'
import style from './SolidSvgComponent.module.scss'

const SolidSvgComponent = (props) => {
	const { width, height, iconColor, url, fit, defaultClass, isPrimaryColor, onClick,...p } = props

	return (
		<div className={`${style.SvgIcon} ${isPrimaryColor ? style.primary : ''} ${defaultClass}`} onClick={onClick} style={{
			width,
			height,
			backgroundColor: iconColor,
			mask: `url(${url})`,
			maskSize: fit ? "contain" : "auto",
			maskRepeat:'no-repeat'
		}} {...p}></div>
	)
}

export default SolidSvgComponent