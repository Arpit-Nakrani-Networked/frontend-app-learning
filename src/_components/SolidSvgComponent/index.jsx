import React from 'react';
import PropTypes from 'prop-types';
import './SolidSvgComponent.scss';

const SolidSvgComponent = (props) => {
  const {
    width, height, iconColor, url, fit, defaultClass, isPrimaryColor, onClick, isIconColor, ...p
  } = props;

  return (
    <div
      className={`SvgIcon ${isPrimaryColor ? 'primary' : ''} ${isIconColor ? 'iconColor' : ''} ${defaultClass}`}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { onClick?.(e); } }}
      role="button"
      tabIndex={0}
      style={{
        width,
        height,
        backgroundColor: iconColor,
        mask: `url(${url})`,
        maskSize: fit ? 'contain' : 'auto',
        maskRepeat: 'no-repeat',
      }}
      {...p}
    />
  );
};

SolidSvgComponent.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  id: PropTypes.string,
  iconColor: PropTypes.string,
  isIconColor: PropTypes.bool,
  url: PropTypes.string.isRequired,
  fit: PropTypes.bool,
  defaultClass: PropTypes.string,
  isPrimaryColor: PropTypes.bool,
  onClick: PropTypes.func,
};

export default SolidSvgComponent;
