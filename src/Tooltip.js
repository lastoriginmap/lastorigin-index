import React, {Fragment} from 'react';

class Tooltip extends React.Component
{
  render()
  {
    const base = this.props.tooltipdata.base;
    const increment = this.props.tooltipdata.increment;
    if (this.props.isStatExpanded)
    {
      return (
        <Fragment>
          {this.props.children}
          <div className="tooltip-innertext tooltip-innertext-expanded" > {base} + {increment} / Lv</div >
        </Fragment >
      );
    }
    else return (
      <div className="tooltip tooltip-stat">
        {this.props.children}
        <div className="tooltip-innertext tooltip-innertext-right">기본: {base}<br />레벨당 증가량: {increment}</div>
      </div>
    );
  }
}

export default Tooltip;